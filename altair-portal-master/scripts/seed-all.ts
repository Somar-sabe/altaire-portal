import { PrismaClient, Role, Permission, UserStatus, SpaceRole, SpacePrivacy, LeadStage, LeadStatus, LeadActionType, FeedPostType, InvitationStatus } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  // GPT-Codex (G) BEGIN: require explicit demo seed password and guard production execution.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Refusing to seed production without ALLOW_PRODUCTION_SEED=true.')
  }

  const seedPassword = process.env.SEED_DEMO_PASSWORD
  if (!seedPassword || seedPassword.length < 12) {
    throw new Error('SEED_DEMO_PASSWORD is required and must be at least 12 characters.')
  }

  console.log('Starting seed...')
  const passwordHash = await argon2.hash(seedPassword)
  // GPT-Codex (G) END: seed users no longer share a hardcoded password.
  
  // 1. Users
  console.log('Seeding users...')
  const usersData = [
    { id: 'cdev-user-admin-002', firstName: 'Sara', lastName: 'Al-Mansouri', email: 'sara.admin@altair.dev', role: Role.ADMIN, department: 'Sales', jobTitle: 'Sales Director' },
    { id: 'cdev-user-manager-003', firstName: 'Khalid', lastName: 'Rashid', email: 'khalid.mgr@altair.dev', role: Role.MANAGER, department: 'Sales', jobTitle: 'Sales Manager' },
    { id: 'cdev-user-agent-004', firstName: 'Lena', lastName: 'Kovač', email: 'lena.agent@altair.dev', role: Role.AGENT, department: 'Sales', jobTitle: 'Sales Agent' },
    { id: 'cdev-user-agent-005', firstName: 'Omar', lastName: 'Farouq', email: 'omar.agent@altair.dev', role: Role.AGENT, department: 'Sales', jobTitle: 'Senior Sales Agent' },
    { id: 'cdev-user-agent-006', firstName: 'Nour', lastName: 'Hassan', email: 'nour.agent@altair.dev', role: Role.AGENT, department: 'Marketing', jobTitle: 'Marketing Agent' },
  ]
  
  const DEFAULT_PERMS: Record<Role, Permission[]> = {
    SUPER_ADMIN: ["view_leads", "create_lead", "edit_lead", "delete_lead", "assign_lead", "export_leads", "view_feed", "publish_to_feed", "delete_feed_posts", "comment_on_feed", "view_workspace", "create_space", "view_team", "invite_users", "manage_roles", "edit_users", "delete_users", "send_messages", "view_all_messages", "manage_campaigns", "view_campaigns", "view_reports", "export_reports", "view_overview", "manage_company_settings", "manage_billing"],
    ADMIN: ["view_leads", "create_lead", "edit_lead", "assign_lead", "export_leads", "view_feed", "publish_to_feed", "comment_on_feed", "view_workspace", "create_space", "view_team", "invite_users", "manage_roles", "edit_users", "send_messages", "view_all_messages", "manage_campaigns", "view_campaigns", "view_reports", "export_reports", "view_overview"],
    MANAGER: ["view_leads", "create_lead", "edit_lead", "assign_lead", "view_feed", "publish_to_feed", "comment_on_feed", "view_workspace", "view_team", "send_messages", "view_reports", "export_reports", "view_overview"],
    AGENT: ["view_leads", "create_lead", "edit_lead", "view_feed", "publish_to_feed", "comment_on_feed", "view_workspace", "view_team", "send_messages", "view_overview"]
  }

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        mobileNumber: '0000000000',
        department: u.department,
        role: u.role,
        jobTitle: u.jobTitle,
        status: UserStatus.ACTIVE,
        passwordHash,
        permissions: DEFAULT_PERMS[u.role]
      }
    })
  }

  // 2. Spaces
  console.log('Seeding spaces...')
  const spaces = [
    { id: 'cdev-space-general-001', name: 'General', privacy: SpacePrivacy.PUBLIC, desc: 'Company-wide announcements' },
    { id: 'cdev-space-sales-002', name: 'Sales Team', privacy: SpacePrivacy.PUBLIC, desc: 'Leads, deals, and pipeline' },
    { id: 'cdev-space-marketing-003', name: 'Marketing', privacy: SpacePrivacy.PRIVATE, desc: 'Campaigns' },
    { id: 'cdev-space-leadership-004', name: 'Leadership', privacy: SpacePrivacy.PRIVATE, desc: 'Management' }
  ]
  for (const s of spaces) {
    await prisma.workspaceSpace.upsert({
      where: { id: s.id },
      update: {},
      create: { id: s.id, name: s.name, privacy: s.privacy, description: s.desc }
    })
  }

  // 3. Leads
  console.log('Seeding leads...')
  const leads = [
    { id: 'cdev-lead-001', name: 'Ahmed Al-Farsi', company: 'TechVenture FZCO', stage: LeadStage.NEW, val: 45000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-002', name: 'Priya Sharma', company: 'InnovateME Ltd', stage: LeadStage.NEW, val: 28000, agent: 'cdev-user-agent-005' },
    { id: 'cdev-lead-003', name: 'Mohammed Jaber', company: 'Gulf Builders LLC', stage: LeadStage.NEW, val: 120000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-004', name: 'Sarah Thompson', company: 'NexGen Solutions', stage: LeadStage.IN_PROGRESS, val: 67000, agent: 'cdev-user-agent-005' },
    { id: 'cdev-lead-005', name: 'Kareem Saleh', company: 'Arabian Dynamics', stage: LeadStage.IN_PROGRESS, val: 95000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-006', name: 'Liu Wei', company: 'PanAsia Exports', stage: LeadStage.IN_PROGRESS, val: 38000, agent: 'cdev-user-agent-005' },
    { id: 'cdev-lead-007', name: 'Fatima Al-Zaabi', company: 'Emirates Retail Group', stage: LeadStage.INTERESTED, val: 210000, agent: 'cdev-user-manager-003' },
    { id: 'cdev-lead-008', name: 'James Okafor', company: 'Afrique Trade Co', stage: LeadStage.INTERESTED, val: 74000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-009', name: 'Aisha Benali', company: 'MaghrebTech', stage: LeadStage.CONTACTED, val: 51000, agent: 'cdev-user-agent-005' },
    { id: 'cdev-lead-010', name: 'Ravi Nair', company: 'IndoGulf Partners', stage: LeadStage.CONTACTED, val: 32000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-011', name: 'Elena Petrov', company: 'EuroME Consulting', stage: LeadStage.BOOKED, val: 88000, agent: 'cdev-user-manager-003' },
    { id: 'cdev-lead-012', name: 'Hassan Yousef', company: 'Levant Industries', stage: LeadStage.BOOKED, val: 145000, agent: 'cdev-user-agent-005' },
    { id: 'cdev-lead-013', name: 'Diana Müller', company: 'DACH Solutions', stage: LeadStage.CONVERTED, val: 175000, agent: 'cdev-user-manager-003' },
    { id: 'cdev-lead-014', name: 'Tariq Al-Jabri', company: 'Desert Capital', stage: LeadStage.LOST, val: 250000, agent: 'cdev-user-agent-004' },
    { id: 'cdev-lead-015', name: 'Mei Lin', company: 'SinoGulf Trading', stage: LeadStage.NOT_INTERESTED, val: 42000, agent: 'cdev-user-agent-005' }
  ]
  for (const l of leads) {
    const isLost = l.stage === LeadStage.LOST || l.stage === LeadStage.NOT_INTERESTED
    await prisma.lrmLead.upsert({
      where: { id: l.id },
      update: {},
      create: {
        id: l.id,
        name: l.name,
        company: l.company,
        targetProject: 'Standard B2B Package',
        value: l.val,
        stage: l.stage,
        email: `${l.name.split(' ')[0].toLowerCase()}@example.com`,
        phone: '+97100000000',
        status: isLost ? LeadStatus.INACTIVE : LeadStatus.ACTIVE,
        aiScore: Math.floor(Math.random() * 80) + 10,
        assignedAgentId: l.agent,
        tags: ['b2b', 'follow-up']
      }
    })
  }

  // 4. Space Members
  console.log('Seeding space members...')
  const ghanemId = 'cdev-ghanemite-superadmin-001'
  const memberships = [
    { spaceId: 'cdev-space-general-001', userId: ghanemId, role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-general-001', userId: 'cdev-user-admin-002', role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-general-001', userId: 'cdev-user-manager-003', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-general-001', userId: 'cdev-user-agent-004', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-general-001', userId: 'cdev-user-agent-005', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-general-001', userId: 'cdev-user-agent-006', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-sales-002', userId: ghanemId, role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-sales-002', userId: 'cdev-user-admin-002', role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-sales-002', userId: 'cdev-user-manager-003', role: SpaceRole.MODERATOR },
    { spaceId: 'cdev-space-sales-002', userId: 'cdev-user-agent-004', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-sales-002', userId: 'cdev-user-agent-005', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-marketing-003', userId: ghanemId, role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-marketing-003', userId: 'cdev-user-agent-006', role: SpaceRole.MODERATOR },
    { spaceId: 'cdev-space-marketing-003', userId: 'cdev-user-admin-002', role: SpaceRole.MEMBER },
    { spaceId: 'cdev-space-leadership-004', userId: ghanemId, role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-leadership-004', userId: 'cdev-user-admin-002', role: SpaceRole.ADMIN },
    { spaceId: 'cdev-space-leadership-004', userId: 'cdev-user-manager-003', role: SpaceRole.MEMBER },
  ]
  for (const m of memberships) {
    const existing = await prisma.spaceMember.findFirst({ where: { spaceId: m.spaceId, userId: m.userId }})
    if (!existing) await prisma.spaceMember.create({ data: m })
  }

  // 5. Space Invitations
  console.log('Seeding invitations...')
  const invs = [
    { spaceId: 'cdev-space-sales-002', spaceName: 'Sales Team', invitedById: 'cdev-user-admin-002', invitedByName: 'Sara Al-Mansouri', userId: 'cdev-user-agent-006', status: InvitationStatus.PENDING },
    { spaceId: 'cdev-space-marketing-003', spaceName: 'Marketing', invitedById: 'cdev-user-admin-002', invitedByName: 'Sara Al-Mansouri', userId: 'cdev-user-agent-004', status: InvitationStatus.PENDING },
    { spaceId: 'cdev-space-leadership-004', spaceName: 'Leadership', invitedById: ghanemId, invitedByName: 'Ghanem', userId: 'cdev-user-manager-003', status: InvitationStatus.ACCEPTED },
  ]
  for (const i of invs) {
    const existing = await prisma.spaceInvitation.findFirst({ where: { spaceId: i.spaceId, userId: i.userId }})
    if (!existing) await prisma.spaceInvitation.create({ data: i })
  }

  // 6. Lead Comments
  console.log('Seeding lead comments...')
  const lComments = [
    { leadId: 'cdev-lead-001', authorId: 'cdev-user-agent-004', authorName: 'Lena Kovač', authorRole: Role.AGENT, content: 'First call went well, they are evaluating 3 vendors. Sending proposal tomorrow.' },
    { leadId: 'cdev-lead-007', authorId: 'cdev-user-manager-003', authorName: 'Khalid Rashid', authorRole: Role.MANAGER, content: 'Fatima confirmed budget is approved. Decision expected by end of month.' },
    { leadId: 'cdev-lead-013', authorId: 'cdev-user-manager-003', authorName: 'Khalid Rashid', authorRole: Role.MANAGER, content: 'Contract signed. Onboarding call scheduled for next week.' },
    { leadId: 'cdev-lead-014', authorId: 'cdev-user-agent-004', authorName: 'Lena Kovač', authorRole: Role.AGENT, content: 'They went with a competitor. Price was the deciding factor.' }
  ]
  for (const c of lComments) await prisma.leadComment.create({ data: c })

  // 7. Lead Activities
  console.log('Seeding lead activities...')
  for (const l of leads) {
    await prisma.leadActivity.create({ data: { leadId: l.id, actorId: ghanemId, actorName: 'Ghanem', actionType: LeadActionType.CREATED, details: 'Lead created' }})
    await prisma.leadActivity.create({ data: { leadId: l.id, actorId: ghanemId, actorName: 'Ghanem', actionType: LeadActionType.ASSIGNED, details: `Lead assigned to ${l.agent}` }})
    if (l.stage !== LeadStage.NEW) {
      await prisma.leadActivity.create({ data: { leadId: l.id, actorId: l.agent, actorName: 'System', actionType: LeadActionType.STAGE_CHANGED, details: `Stage changed to ${l.stage}` }})
    }
  }

  // 8. Feed Posts
  console.log('Seeding feed posts...')
  const fPosts = [
    { id: 'cdev-feed-001', authorId: ghanemId, authorName: 'Ghanem', type: FeedPostType.ANNOUNCEMENT, title: 'Q3 Sales Targets Published', content: 'We have aggressive targets for Q3. Check the dashboard.' },
    { id: 'cdev-feed-002', authorId: 'cdev-user-admin-002', authorName: 'Sara Al-Mansouri', type: FeedPostType.UPDATE, title: 'Pipeline Review — Week 23', content: 'Pipeline review is looking solid. Keep up the momentum.' },
    { id: 'cdev-feed-003', authorId: 'cdev-user-admin-002', authorName: 'Sara Al-Mansouri', type: FeedPostType.EVENT, title: 'Team Outing — Friday 20 June', content: 'Join us for the team outing next Friday!' },
    { id: 'cdev-feed-004', authorId: 'cdev-user-manager-003', authorName: 'Khalid Rashid', type: FeedPostType.POLL, title: 'When should we hold the monthly all-hands?', content: 'Please vote on the preferred time.' },
    { id: 'cdev-feed-005', authorId: 'cdev-user-agent-004', authorName: 'Lena Kovač', type: FeedPostType.DISCUSSION, title: 'Best approach for cold outreach in the Gulf?', content: 'Would love to hear what worked for you all recently.' },
    { id: 'cdev-feed-006', authorId: ghanemId, authorName: 'Ghanem', type: FeedPostType.ANNOUNCEMENT, title: 'New Feature: AI Lead Scoring Now Live', content: 'Check out the new AI scores on your leads.' },
    { id: 'cdev-feed-007', authorId: 'cdev-user-agent-005', authorName: 'Omar Farouq', type: FeedPostType.UPDATE, title: 'CONVERTED: Desert Capital deal closed!', content: 'Just signed the Desert Capital deal!' },
    { id: 'cdev-feed-008', authorId: 'cdev-user-agent-006', authorName: 'Nour Hassan', type: FeedPostType.DISCUSSION, title: 'Campaign ideas for Q3 — share your thoughts', content: 'Drop your ideas below.' },
  ]
  for (const f of fPosts) {
    await prisma.feedPost.upsert({ where: { id: f.id }, update: {}, create: f })
  }

  // 9. Feed Poll Options
  console.log('Seeding poll options...')
  const pollOpts = [
    { id: 'cdev-poll-opt-1', postId: 'cdev-feed-004', text: 'First Monday of the month (10 AM)', votes: 0 },
    { id: 'cdev-poll-opt-2', postId: 'cdev-feed-004', text: 'Last Friday of the month (3 PM)', votes: 0 },
    { id: 'cdev-poll-opt-3', postId: 'cdev-feed-004', text: 'Mid-month Wednesday (2 PM)', votes: 0 }
  ]
  for (const p of pollOpts) {
    const existing = await prisma.feedPollOption.findFirst({ where: { id: p.id }})
    if (!existing) await prisma.feedPollOption.create({ data: p })
  }

  // 10. Feed Comments
  console.log('Seeding feed comments...')
  await prisma.feedComment.create({ data: { postId: 'cdev-feed-001', authorId: 'cdev-user-manager-003', authorName: 'Khalid Rashid', content: 'Great targets! The pipeline is looking strong.' }})
  await prisma.feedComment.create({ data: { postId: 'cdev-feed-003', authorId: 'cdev-user-agent-004', authorName: 'Lena Kovač', content: 'Count me in! 🎉' }})
  await prisma.feedComment.create({ data: { postId: 'cdev-feed-003', authorId: 'cdev-user-agent-005', authorName: 'Omar Farouq', content: 'Same, looking forward to it.' }})
  await prisma.feedComment.create({ data: { postId: 'cdev-feed-004', authorId: 'cdev-user-admin-002', authorName: 'Sara Al-Mansouri', content: 'Voted for mid-month — gives us time to prep the numbers.' }})

  // 11. Feed Reactions
  console.log('Seeding feed reactions...')
  const reacts = [
    { postId: 'cdev-feed-001', userId: 'cdev-user-agent-004', emoji: '🔥' },
    { postId: 'cdev-feed-002', userId: ghanemId, emoji: '👍' },
    { postId: 'cdev-feed-003', userId: 'cdev-user-manager-003', emoji: '❤️' },
    { postId: 'cdev-feed-007', userId: 'cdev-user-admin-002', emoji: '👏' }
  ]
  for (const r of reacts) {
    const existing = await prisma.feedReaction.findFirst({ where: { postId: r.postId, userId: r.userId, emoji: r.emoji }})
    if (!existing) await prisma.feedReaction.create({ data: r })
  }

  // 12. Messages
  console.log('Seeding messages...')
  const msgs = [
    { id: 'cdev-msg-1', spaceId: 'cdev-space-general-001', senderId: ghanemId, content: 'Welcome everyone to the new platform!' },
    { id: 'cdev-msg-2', spaceId: 'cdev-space-general-001', senderId: 'cdev-user-admin-002', content: 'Thanks! The interface looks great.' },
    { id: 'cdev-msg-3', spaceId: 'cdev-space-general-001', senderId: 'cdev-user-manager-003', content: 'Agreed. Really clean UX.' },
    { id: 'cdev-msg-4', spaceId: 'cdev-space-general-001', senderId: 'cdev-user-agent-004', content: 'When does the lead import go live?' },
    { id: 'cdev-msg-5', spaceId: 'cdev-space-general-001', senderId: ghanemId, content: 'This week — watching the pipeline closely.' },
    { id: 'cdev-msg-6', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-admin-002', content: 'Quick reminder — pipeline review is tomorrow at 10 AM.' },
    { id: 'cdev-msg-7', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-manager-003', content: 'Confirmed. Will have the numbers ready.' },
    { id: 'cdev-msg-8', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-agent-005', content: 'Just closed the Elena Petrov deal — she is booked!' },
    { id: 'cdev-msg-9', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-admin-002', content: 'Great work Omar! 🎯' },
    { id: 'cdev-msg-10', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-agent-004', content: 'Following up with Fatima Al-Zaabi today.' },
    { id: 'cdev-msg-11', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-manager-003', content: 'Perfect timing — she is close to decision.' },
    { id: 'cdev-msg-12', spaceId: 'cdev-space-sales-002', senderId: 'cdev-user-agent-005', content: 'Fingers crossed. The deal is 210k.' },
  ]
  for (const m of msgs) {
    await prisma.message.upsert({ where: { id: m.id }, update: {}, create: m })
  }

  // 13. Message Reactions
  console.log('Seeding message reactions...')
  const mReacts = [
    { messageId: 'cdev-msg-8', userId: 'cdev-user-admin-002', emoji: '🎉' },
    { messageId: 'cdev-msg-9', userId: 'cdev-user-manager-003', emoji: '👏' },
    { messageId: 'cdev-msg-1', userId: 'cdev-user-agent-004', emoji: '❤️' }
  ]
  for (const mr of mReacts) {
    const existing = await prisma.messageReaction.findFirst({ where: { messageId: mr.messageId, userId: mr.userId, emoji: mr.emoji }})
    if (!existing) await prisma.messageReaction.create({ data: mr })
  }

  // 14. Audit Log
  console.log('Seeding audit logs...')
  const audits = [
    { actorId: ghanemId, actorRole: 'SUPER_ADMIN', action: 'USER_CREATED', entityType: 'User', entityId: 'cdev-user-admin-002', summary: 'Created Sales Director: Sara Al-Mansouri' },
    { actorId: 'cdev-user-admin-002', actorRole: 'ADMIN', action: 'LEAD_CREATED', entityType: 'LrmLead', entityId: 'cdev-lead-001', summary: 'New lead: Ahmed Al-Farsi / TechVenture FZCO' },
    { actorId: 'cdev-user-admin-002', actorRole: 'ADMIN', action: 'LEAD_ASSIGNED', entityType: 'LrmLead', entityId: 'cdev-lead-001', summary: 'Lead assigned to Lena Kovač' },
    { actorId: 'cdev-user-manager-003', actorRole: 'MANAGER', action: 'LEAD_STAGE_CHANGED', entityType: 'LrmLead', entityId: 'cdev-lead-007', summary: 'Fatima Al-Zaabi moved to INTERESTED' },
  ]
  for (const a of audits) await prisma.auditLog.create({ data: a })

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
