"use client";
/**
 * @file /app/modules/overview/components/KPICards.tsx
 * @purpose Renders the KPI summary cards for the overview module.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Layers, User as UserIcon, Trophy, TrendingDown, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface KPICardsProps {
  leadsTotal: number;
  leadsThisMonthCount: number;
  leadsLastMonthCount: number;
  wonThisMonth: number;
  wonLastMonth: number;
  lostThisMonth: number;
  lostLastMonth: number;
  itemVariants: any;
}

export default function KPICards({
  leadsTotal,
  leadsThisMonthCount,
  leadsLastMonthCount,
  wonThisMonth,
  wonLastMonth,
  lostThisMonth,
  lostLastMonth,
  itemVariants,
}: KPICardsProps) {
  const summaryData = [
    {
      title: 'Total Deals',
      value: leadsTotal.toString().padStart(2, '0'),
      change: '100%',
      isPositive: true,
      subtext: `${leadsThisMonthCount.toString().padStart(2, '0')} New Deals`,
      icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
      subIconColor: 'text-emerald-500',
      iconBg: 'bg-indigo-50',
    },
    {
      title: "This Month's Deals",
      value: leadsThisMonthCount.toString().padStart(2, '0'),
      change: '100%',
      isPositive: true,
      subtext: `${leadsLastMonthCount.toString().padStart(2, '0')} Last Month`,
      icon: <Layers className="w-5 h-5 text-amber-500" />,
      subIconColor: 'text-emerald-500',
      iconBg: 'bg-amber-50',
    },
    {
      title: 'Contacts Created',
      value: leadsThisMonthCount.toString().padStart(2, '0'),
      change: '100%',
      isPositive: true,
      subtext: `${leadsLastMonthCount.toString().padStart(2, '0')} Last Month`,
      icon: <UserIcon className="w-5 h-5 text-blue-500" />,
      subIconColor: 'text-emerald-500',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'Pipelines Won',
      value: wonThisMonth.toString().padStart(2, '0'),
      change: wonThisMonth >= wonLastMonth ? '100%' : '-50%',
      isPositive: wonThisMonth >= wonLastMonth,
      subtext: `${wonLastMonth} Last Month`,
      icon: <Trophy className="w-5 h-5 text-emerald-500" />,
      subIconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
    },
    {
      title: 'Pipelines Lost',
      value: lostThisMonth.toString().padStart(2, '0'),
      change: lostThisMonth <= lostLastMonth ? '100%' : '-50%',
      isPositive: lostThisMonth <= lostLastMonth,
      subtext: `${lostLastMonth} Last Month`,
      icon: <TrendingDown className="w-5 h-5 text-rose-500" />,
      subIconColor: 'text-rose-500',
      iconBg: 'bg-rose-50',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {summaryData.map((card, idx) => (
        <motion.div key={idx} variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between text-left">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-700">{card.title}</p>
            <div className={`p-1.5 rounded-lg ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
            <span className={`flex items-center text-xs font-bold ${card.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {card.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {card.change}
            </span>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-500">
            <TrendingUp className={`w-3.5 h-3.5 mr-1.5 ${card.subIconColor}`} />
            {card.subtext}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
