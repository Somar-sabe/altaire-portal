// GPT-Codex (G) BEGIN: Vitest unit coverage for the permission resolver CI gate.
import { describe, expect, test } from "vitest";
import { hasEffectivePermission, resolveEffectivePermissions } from "../lib/permissions";

describe("permission resolver", () => {
  test("uses explicit permissions when a user has overrides", () => {
    const explicitAdmin = {
      role: "ADMIN" as const,
      permissions: ["view_team" as const],
    };

    expect(hasEffectivePermission(explicitAdmin, "view_team")).toBe(true);
    expect(hasEffectivePermission(explicitAdmin, "manage_roles")).toBe(false);
    expect(resolveEffectivePermissions(explicitAdmin)).toEqual(["view_team"]);
  });

  test("falls back to role permissions when no explicit list exists", () => {
    const fallbackAgent = {
      role: "AGENT" as const,
      permissions: [],
    };

    expect(hasEffectivePermission(fallbackAgent, "view_leads")).toBe(true);
    expect(hasEffectivePermission(fallbackAgent, "manage_billing")).toBe(false);
  });

  test("reflects explicit permission updates immediately", () => {
    const beforeChange = {
      role: "MANAGER" as const,
      permissions: ["view_team" as const],
    };

    const afterChange = {
      role: "MANAGER" as const,
      permissions: ["view_team" as const, "view_reports" as const],
    };

    expect(hasEffectivePermission(beforeChange, "view_reports")).toBe(false);
    expect(hasEffectivePermission(afterChange, "view_reports")).toBe(true);
  });
});
// GPT-Codex (G) END: permission tests now run under the unit-test script and CI.
