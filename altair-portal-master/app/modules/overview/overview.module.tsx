"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Sub-components
import KPICards from './components/KPICards';
import DealsInStagesChart from './components/DealsInStagesChart';
import MonthlyOverviewChart from './components/MonthlyOverviewChart';
import LatestCompanyList from './components/LatestCompanyList';
import RevenueWonChart from './components/RevenueWonChart';
import LatestActivityList from './components/LatestActivityList';
import DealsReportTable from './components/DealsReportTable';
import UsersByCountry from './components/UsersByCountry';

// Hooks
import { useOverviewData } from './hooks/useOverviewData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function OverviewModule() {
  const { 
    loading, leadsTotal, leadsThisMonth, leadsLastMonth, wonThisMonth, wonLastMonth, lostThisMonth, lostLastMonth,
    stagesCount, maxStageCount, latestCompanies, revenueMonths, maxRev, latestActivities, dealsReport, userCountries 
  } = useOverviewData();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-10">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div className="w-full mx-auto space-y-6 pb-10 px-2" variants={containerVariants} initial="hidden" animate="show">
      <KPICards 
        leadsTotal={leadsTotal} leadsThisMonthCount={leadsThisMonth.length} leadsLastMonthCount={leadsLastMonth.length}
        wonThisMonth={wonThisMonth} wonLastMonth={wonLastMonth} lostThisMonth={lostThisMonth} lostLastMonth={lostLastMonth}
        itemVariants={itemVariants} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DealsInStagesChart stagesCount={stagesCount} maxStageCount={maxStageCount} itemVariants={itemVariants} />
        <MonthlyOverviewChart itemVariants={itemVariants} />
        <LatestCompanyList companies={latestCompanies} itemVariants={itemVariants} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueWonChart revenueMonths={revenueMonths} maxRev={maxRev} itemVariants={itemVariants} />
        <LatestActivityList activities={latestActivities} itemVariants={itemVariants} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DealsReportTable dealsReport={dealsReport} itemVariants={itemVariants} />
         <UsersByCountry userCountries={userCountries} itemVariants={itemVariants} />
      </div>
    </motion.div>
  );
}
