'use client';

import OverviewModule from '@/app/modules/overview/overview.module';

export default function OverviewPage() {
  return (
    <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto">
      <OverviewModule />
    </div>
  );
}
