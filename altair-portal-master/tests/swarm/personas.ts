import type { Permission, Role } from '@prisma/client';
import { DEFAULT_ROLE_PERMISSIONS } from '../../app/modules/team/types';

export const SWARM_PASSWORD = 'SwarmDemo123!';

export type SwarmPersona = {
  key: string;
  seedId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department: string;
  permissions: Permission[];
  skipOnboarding: boolean;
  mission: string;
  routes: string[];
};

const restrictedPermissions: Permission[] = ['view_overview', 'view_team'];

export const SWARM_PERSONAS: SwarmPersona[] = [
  {
    key: 'super-admin',
    seedId: 'swarm-user-super-admin-001',
    email: 'swarm.superadmin@altair.dev',
    firstName: 'Sara',
    lastName: 'Al-Mansouri',
    role: 'SUPER_ADMIN',
    department: 'Executive',
    permissions: DEFAULT_ROLE_PERMISSIONS.SUPER_ADMIN,
    skipOnboarding: false,
    mission: 'Full executive walk-through across every major module.',
    routes: ['/overview', '/leads', '/feed', '/marketing', '/reports', '/workspace', '/team', '/company', '/settings', '/help'],
  },
  {
    key: 'admin',
    seedId: 'swarm-user-admin-001',
    email: 'swarm.admin@altair.dev',
    firstName: 'Khalid',
    lastName: 'Rashid',
    role: 'ADMIN',
    department: 'Sales',
    permissions: DEFAULT_ROLE_PERMISSIONS.ADMIN,
    skipOnboarding: true,
    mission: 'Campaign, reporting, and team supervision walk-through.',
    routes: ['/overview', '/marketing', '/reports', '/workspace', '/team', '/settings'],
  },
  {
    key: 'manager',
    seedId: 'swarm-user-manager-001',
    email: 'swarm.manager@altair.dev',
    firstName: 'Nour',
    lastName: 'Hassan',
    role: 'MANAGER',
    department: 'Sales',
    permissions: DEFAULT_ROLE_PERMISSIONS.MANAGER,
    skipOnboarding: true,
    mission: 'Pipeline, lead assignment, and reporting walk-through.',
    routes: ['/overview', '/leads', '/reports', '/workspace'],
  },
  {
    key: 'agent',
    seedId: 'swarm-user-agent-001',
    email: 'swarm.agent@altair.dev',
    firstName: 'Lena',
    lastName: 'Kovac',
    role: 'AGENT',
    department: 'Sales',
    permissions: DEFAULT_ROLE_PERMISSIONS.AGENT,
    skipOnboarding: true,
    mission: 'Daily lead handling and direct messaging walk-through.',
    routes: ['/overview', '/leads', '/workspace', '/feed'],
  },
  {
    key: 'restricted-agent',
    seedId: 'swarm-user-restricted-001',
    email: 'swarm.restricted@altair.dev',
    firstName: 'Omar',
    lastName: 'Farouq',
    role: 'AGENT',
    department: 'Operations',
    permissions: restrictedPermissions,
    skipOnboarding: true,
    mission: 'Negative-path access check for restricted navigation.',
    routes: ['/overview', '/leads', '/team'],
  },
];
