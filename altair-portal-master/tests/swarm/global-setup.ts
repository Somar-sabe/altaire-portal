import { seedSwarmPersonas } from './seed';

export default async function globalSetup() {
  await seedSwarmPersonas();
}
