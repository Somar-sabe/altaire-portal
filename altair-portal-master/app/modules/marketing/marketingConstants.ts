/**
 * @file /app/modules/marketing/marketingConstants.ts
 * @purpose Centralized constants and mock data for the marketing module.
 */

import { Mail, Target, LayoutDashboard, FileText, Image as ImageIcon } from 'lucide-react';

export const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

export const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const campaigns = [
  { id: 1, name: 'Q3 Product Launch', type: 'Email', status: 'ACTIVE', metrics: { openRate: '24.5%', ctr: '4.2%', spend: '$0.00' }, trend: '+2.4%', date: 'Oct 15 - Nov 30', icon: Mail, color: 'bg-orange-50 text-orange-600' },
  { id: 2, name: 'Retargeting Ads - Fall', type: 'Ad', status: 'ACTIVE', metrics: { openRate: '-', ctr: '1.8%', spend: '$4,250' }, trend: '+1.1%', date: 'Sep 01 - Oct 31', icon: Target, color: 'bg-rose-50 text-rose-600' },
  { id: 3, name: 'Weekly Newsletter', type: 'Email', status: 'Draft', metrics: { openRate: '-', ctr: '-', spend: '$0.00' }, trend: '0%', date: 'Ongoing', icon: Mail, color: 'bg-orange-50 text-orange-600' },
  { id: 4, name: 'Black Friday Teaser', type: 'Ad', status: 'Paused', metrics: { openRate: '-', ctr: '3.4%', spend: '$1,120' }, trend: '-0.5%', date: 'Nov 01 - Nov 15', icon: Target, color: 'bg-rose-50 text-rose-600' }
];

export const planningColumns = [
  { title: 'Ideation', items: ['Q4 Holiday Promo', 'New Feature Blog Post'] },
  { title: 'Copywriting', items: ['Webinar Invite Sequence', 'LinkedIn Carousel'] },
  { title: 'In Review', items: ['CEO Newsletter', 'FB Retargeting Creatives'] },
  { title: 'Scheduled', items: ['Product Launch Announce', 'Partner Co-Marketing Email'] }
];

export const swipeFiles = [
  { id: 1, title: 'Notion Onboarding Email', category: 'Email', likes: 124, type: 'FileText', icon: FileText },
  { id: 2, title: 'Apple Landing Page Hero', category: 'Design', likes: 89, type: 'ImageIcon', icon: ImageIcon },
  { id: 3, title: 'Stripe Pricing Table', category: 'UI', likes: 256, type: 'LayoutDashboard', icon: LayoutDashboard },
  { id: 4, title: 'HubSpot Cold Outreach', category: 'Sales', likes: 45, type: 'Mail', icon: Mail },
  { id: 5, title: 'Figma Release Notes', category: 'Copy', likes: 112, type: 'FileText', icon: FileText },
  { id: 6, title: 'Nike Facebook Ad', category: 'Ad', likes: 302, type: 'Target', icon: Target },
];

export const budgetData = [
  { channel: 'Google Ads', allocated: '$15,000', spent: '$12,450', remaining: '$2,550', roi: '3.2x', status: 'On Track' },
  { channel: 'LinkedIn Ads', allocated: '$8,000', spent: '$8,200', remaining: '-$200', roi: '1.8x', status: 'Over Budget' },
  { channel: 'Meta Ads', allocated: '$10,000', spent: '$6,100', remaining: '$3,900', roi: '2.4x', status: 'On Track' },
  { channel: 'Influencer', allocated: '$5,000', spent: '$1,500', remaining: '$3,500', roi: 'TBD', status: 'Under Budget' },
  { channel: 'Content Marketing', allocated: '$4,000', spent: '$3,800', remaining: '$200', roi: '4.5x', status: 'On Track' },
];
