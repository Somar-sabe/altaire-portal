"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Trophy, Medal } from 'lucide-react';

const salesData = [
  { id: 1, period: 'Q1 2026', revenue: '$145,000', growth: '+12.5%', deals: 45, status: 'Exceeded' },
  { id: 2, period: 'Q2 2026', revenue: '$162,500', growth: '+14.2%', deals: 52, status: 'Exceeded' },
  { id: 3, period: 'Q3 2026', revenue: '$138,200', growth: '-2.1%', deals: 38, status: 'On Track' },
  { id: 4, period: 'Q4 2026', revenue: '$185,900', growth: '+18.4%', deals: 64, status: 'Exceeded' },
];

const agentsData = [
  { id: 1, name: 'Sarah Jenkins', role: 'Senior Executive', closed: 42, revenue: '$420k', score: 98, trend: 'up' },
  { id: 2, name: 'Michael Chen', role: 'Account Manager', closed: 38, revenue: '$385k', score: 94, trend: 'up' },
  { id: 3, name: 'Emily Rodriguez', role: 'Sales Rep', closed: 31, revenue: '$290k', score: 88, trend: 'down' },
  { id: 4, name: 'David Kim', role: 'Sales Rep', closed: 28, revenue: '$260k', score: 85, trend: 'up' },
  { id: 5, name: 'Jessica Taylor', role: 'Junior Rep', closed: 19, revenue: '$150k', score: 76, trend: 'down' },
];

const stats = [
  { label: 'Total Revenue', value: '$2.4M', change: '+14%', icon: DollarSign, trend: 'up' },
  { label: 'Active Deals', value: '142', change: '+8%', icon: Activity, trend: 'up' },
  { label: 'Conversion Rate', value: '24.8%', change: '-2%', icon: TrendingUp, trend: 'down' },
  { label: 'Total Agents', value: '48', change: '+4%', icon: Users, trend: 'up' },
];

export default function ReportsModule() {
  return (
    <div className="w-full h-full flex flex-col gap-6 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of team performance and sales metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-[12px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-[12px] transition-colors shadow-sm shadow-indigo-200 dark:shadow-none">
            Generate New
          </button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] shadow-sm flex flex-col gap-4 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {/* Sales Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold">Sales Performance</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="px-5 py-3">Period</th>
                  <th className="px-5 py-3">Revenue</th>
                  <th className="px-5 py-3">Deals</th>
                  <th className="px-5 py-3">Growth</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salesData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium">{row.period}</td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">{row.revenue}</td>
                    <td className="px-5 py-4">{row.deals}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1 ${row.growth.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {row.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {row.growth}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${row.status === 'Exceeded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Agent Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Agent Leaderboard
            </h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Full Ranking</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="px-5 py-3 w-12 text-center">Rank</th>
                  <th className="px-5 py-3">Agent</th>
                  <th className="px-5 py-3">Closed</th>
                  <th className="px-5 py-3">Revenue</th>
                  <th className="px-5 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agentsData.map((agent, index) => (
                  <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 text-center">
                      {index === 0 ? <Medal className="w-5 h-5 text-amber-500 mx-auto" /> : 
                       index === 1 ? <Medal className="w-5 h-5 text-slate-400 mx-auto" /> : 
                       index === 2 ? <Medal className="w-5 h-5 text-amber-700 mx-auto" /> : 
                       <span className="text-slate-400 font-medium">{index + 1}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {agent.name.charAt(0)}{agent.name.split(' ')[1]?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{agent.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{agent.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{agent.closed} deals</td>
                    <td className="px-5 py-4 font-bold text-indigo-600 dark:text-indigo-400">{agent.revenue}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        <span className="font-bold">{agent.score}</span>
                        {agent.trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
