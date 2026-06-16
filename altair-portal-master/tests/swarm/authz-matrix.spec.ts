// GPT-Codex (G) BEGIN: deterministic API authorization matrix for Wave 2 appsec review.
import { expect, test, type APIRequestContext } from '@playwright/test';
import { SWARM_PASSWORD, SWARM_PERSONAS, type SwarmPersona } from './personas';

const personaByKey = Object.fromEntries(SWARM_PERSONAS.map((persona) => [persona.key, persona]));

async function loginPersona(request: APIRequestContext, persona: SwarmPersona) {
  const csrfResponse = await request.get('/api/auth/csrf');
  expect(csrfResponse.ok(), 'GET /api/auth/csrf').toBe(true);

  const { csrfToken } = await csrfResponse.json();
  const loginResponse = await request.post('/api/auth/callback/credentials', {
    form: {
      csrfToken,
      email: persona.email,
      password: SWARM_PASSWORD,
      redirect: 'false',
      callbackUrl: '/overview',
    },
    maxRedirects: 0,
  });

  expect([200, 302], `login ${persona.key}`).toContain(loginResponse.status());
}

async function expectStatus(
  request: APIRequestContext,
  method: 'delete' | 'get' | 'patch' | 'post' | 'put',
  path: string,
  status: number,
  data?: unknown
) {
  const response = method === 'delete'
    ? await request.delete(path, data === undefined ? undefined : { data })
    : method === 'get'
      ? await request.get(path)
      : method === 'patch'
        ? await request.patch(path, { data })
        : method === 'put'
          ? await request.put(path, { data })
          : await request.post(path, { data });

  expect(response.status(), `${method.toUpperCase()} ${path}`).toBe(status);
}

// GPT-Codex (G) BEGIN: assert list endpoints expose the Wave 5D cursor envelope.
async function expectCursorPage(request: APIRequestContext, path: string) {
  const response = await request.get(`${path}${path.includes('?') ? '&' : '?'}limit=1`);
  expect(response.status(), `GET ${path} cursor page`).toBe(200);

  const payload = await response.json();
  expect(Array.isArray(payload.data), `${path} data array`).toBe(true);
  expect(payload.data.length, `${path} bounded data length`).toBeLessThanOrEqual(1);
  expect(payload.pageInfo.limit, `${path} limit echo`).toBe(1);
  expect(typeof payload.pageInfo.hasNextPage, `${path} hasNextPage type`).toBe('boolean');
  expect(
    payload.pageInfo.nextCursor === null || typeof payload.pageInfo.nextCursor === 'string',
    `${path} nextCursor type`
  ).toBe(true);
}
// GPT-Codex (G) END: pagination contract is covered without depending on fixture row counts.

const fakeId = 'wave4b-missing-record';

test.describe('authz matrix', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60000);

  test('unauthenticated API requests fail closed at middleware', async ({ request }) => {
    await expectStatus(request, 'get', '/api/feed', 401);
    await expectStatus(request, 'get', '/api/leads', 401);
    await expectStatus(request, 'get', '/api/team/users', 401);
  });

  test('restricted agent can view team but cannot read leads/feed/workspace', async ({ request }) => {
    await loginPersona(request, personaByKey['restricted-agent']);
    await expectStatus(request, 'get', '/api/team/users', 200);
    await expectStatus(request, 'get', '/api/leads', 403);
    await expectStatus(request, 'get', '/api/feed', 403);
    await expectStatus(request, 'get', '/api/workspace/spaces', 403);
    await expectStatus(request, 'post', '/api/leads', 403, {});
    await expectStatus(request, 'post', '/api/feed', 403, { content: 'blocked' });
    await expectStatus(request, 'post', '/api/team/users', 403, {});
  });

  test('agent can use daily-work APIs but cannot invite users or create spaces', async ({ request }) => {
    await loginPersona(request, personaByKey.agent);
    await expectStatus(request, 'get', '/api/leads', 200);
    await expectStatus(request, 'get', '/api/feed', 200);
    await expectStatus(request, 'get', '/api/workspace/messages', 200);
    await expectStatus(request, 'post', '/api/leads', 422, {});
    await expectStatus(request, 'post', '/api/team/users', 403, {});
    await expectStatus(request, 'post', '/api/workspace/spaces', 403, {});
  });

  test('list endpoints expose bounded cursor pagination envelopes', async ({ request }) => {
    await loginPersona(request, personaByKey.agent);
    await expectCursorPage(request, '/api/leads');
    await expectCursorPage(request, '/api/feed');
    await expectCursorPage(request, '/api/workspace/messages');
    await expectCursorPage(request, '/api/team/users');
  });

  test('admin reaches privileged mutation handlers before validation', async ({ request }) => {
    await loginPersona(request, personaByKey.admin);
    await expectStatus(request, 'post', '/api/team/users', 422, {});
    await expectStatus(request, 'post', '/api/workspace/spaces', 400, {});
  });

  test('cron rotation is not reachable by GET even with a session cookie', async ({ request }) => {
    await loginPersona(request, personaByKey['super-admin']);
    await expectStatus(request, 'get', '/api/cron/rotate', 405);
  });

  test('privileged team mutations deny unsafe lower-role and self-role edits', async ({ request }) => {
    await loginPersona(request, personaByKey['restricted-agent']);
    await expectStatus(request, 'put', '/api/team/users/swarm-user-agent-001', 403, { firstName: 'Nope' });

    await loginPersona(request, personaByKey.agent);
    await expectStatus(request, 'put', '/api/team/users/swarm-user-agent-001', 403, { role: 'ADMIN' });

    await loginPersona(request, personaByKey.admin);
    await expectStatus(request, 'delete', '/api/team/users/swarm-user-agent-001', 403);

    await loginPersona(request, personaByKey['super-admin']);
    await expectStatus(request, 'put', '/api/team/users/swarm-user-super-admin-001', 403, { role: 'ADMIN' });
  });

  test('lead nested and destructive routes keep permission gates ahead of fake records', async ({ request }) => {
    await loginPersona(request, personaByKey['restricted-agent']);
    await expectStatus(request, 'get', '/api/leads/comments', 403);
    await expectStatus(request, 'get', `/api/leads/${fakeId}/activities`, 403);
    await expectStatus(request, 'patch', `/api/leads/${fakeId}`, 403, { name: 'Blocked' });
    await expectStatus(request, 'delete', `/api/leads/${fakeId}`, 403);

    await loginPersona(request, personaByKey.agent);
    await expectStatus(request, 'post', `/api/leads/${fakeId}/comments`, 422, {});

    await loginPersona(request, personaByKey['super-admin']);
    await expectStatus(request, 'delete', `/api/leads/${fakeId}`, 404);
  });

  test('feed engagement routes separate restricted denials from agent validation', async ({ request }) => {
    await loginPersona(request, personaByKey['restricted-agent']);
    await expectStatus(request, 'post', `/api/feed/${fakeId}/react`, 403, {});
    await expectStatus(request, 'post', `/api/feed/${fakeId}/comments`, 403, {});
    await expectStatus(request, 'post', `/api/feed/${fakeId}/vote`, 403, {});

    await loginPersona(request, personaByKey.agent);
    await expectStatus(request, 'post', '/api/feed', 422, { type: 'BAD_TYPE', content: 'blocked by schema' });
    await expectStatus(request, 'post', '/api/feed', 422, { type: 'POLL', title: 'Incomplete poll', content: 'missing options', pollOptions: ['Only one'] });
    await expectStatus(request, 'post', `/api/feed/${fakeId}/comments`, 422, {});
    await expectStatus(request, 'post', `/api/feed/${fakeId}/vote`, 422, {});
  });

  test('workspace, AI, and cron boundaries remain session-scoped and fail closed', async ({ request }) => {
    await loginPersona(request, personaByKey['restricted-agent']);
    await expectStatus(request, 'get', '/api/workspace/invitations', 403);
    await expectStatus(request, 'post', '/api/workspace/invitations', 403, {});
    await expectStatus(request, 'post', '/api/workspace/messages', 403, {});
    await expectStatus(request, 'post', '/api/leads/ai-helper', 403, {});
    await expectStatus(request, 'post', '/api/gemini/chat', 400, {});
    await expectStatus(request, 'post', '/api/gemini/summarize', 400, {});

    await loginPersona(request, personaByKey.agent);
    await expectStatus(request, 'post', '/api/workspace/invitations', 400, {});
    await expectStatus(request, 'post', '/api/workspace/messages', 422, {});
    await expectStatus(request, 'post', '/api/cron/rotate', 401);
  });
});
// GPT-Codex (G) END: matrix covers unauthenticated, restricted, agent, admin, and cron negative paths.
