import { PrismaClient, SpaceRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding spaces...')

  // Check existing users
  const users = await prisma.user.findMany()
  if (users.length === 0) {
    console.log('No users found. Please seed users first.')
    return
  }

  // Find or create "General" space
  let generalSpace = await prisma.workspaceSpace.findFirst({
    where: { name: 'General' }
  })

  if (!generalSpace) {
    generalSpace = await prisma.workspaceSpace.create({
      data: {
        name: 'General',
        description: 'Company-wide general discussion space',
      }
    })
    console.log('Created General space')
  }

  // Find or create "Sales Force" space
  let salesSpace = await prisma.workspaceSpace.findFirst({
    where: { name: 'Sales Force' }
  })

  if (!salesSpace) {
    salesSpace = await prisma.workspaceSpace.create({
      data: {
        name: 'Sales Force',
        description: 'Updates and strategy for the sales team',
      }
    })
    console.log('Created Sales Force space')
  }

  // Find or create "Engineering" space
  let engSpace = await prisma.workspaceSpace.findFirst({
    where: { name: 'Engineering' }
  })

  if (!engSpace) {
    engSpace = await prisma.workspaceSpace.create({
      data: {
        name: 'Engineering',
        description: 'Product and engineering discussions',
      }
    })
    console.log('Created Engineering space')
  }

  for (const user of users) {
    const role: SpaceRole = user.role.includes('Admin') ? SpaceRole.ADMIN : SpaceRole.MEMBER

    // Add to General
    await addMemberIfNotExists(generalSpace.id, user.id, role)

    // Add to Sales
    if (user.department === 'Sales' || user.role.includes('Admin')) {
      await addMemberIfNotExists(salesSpace.id, user.id, role)
    }

    // Add to Engineering
    if (user.department === 'Engineering' || user.role.includes('Admin')) {
      await addMemberIfNotExists(engSpace.id, user.id, role)
    }
  }

  console.log('Space seeding completed!')
}

async function addMemberIfNotExists(spaceId: string, userId: string, role: SpaceRole) {
  const existing = await prisma.spaceMember.findFirst({
    where: { spaceId, userId }
  })

  if (!existing) {
    await prisma.spaceMember.create({
      data: {
        spaceId,
        userId,
        role
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
