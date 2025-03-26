import { GETPeriods } from "@/actions/analytics/get-periods";
import React, { Suspense } from "react";
import { PeriodSelector } from "./_components/period-selector";
import { Periods } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/get-stats-cards-values";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { StatsCard } from "./_components/stats-card";
import { getWorkflowExecutionStats } from "@/actions/analytics/get-workflow-execution-stats";
import { ExecutionStatusChart } from "./_components/execution-status-chart";
import { getCreditUsageToPeriod } from "@/actions/analytics/get-credit-usage-to-period";
import { CreditUsageChart } from "../billing/_components/credit-usage-chart";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    month?: string;
    year?: string;
  };
}) => {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Periods = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="flex flex-col h-full gap-4 py-6">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatusExecutionStatus selectPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
};

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Periods;
}) {
  const periods = await GETPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Periods }) {
  const stats = await GetStatsCardsValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={stats.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="phase executions"
        value={stats.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={stats.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

async function StatusExecutionStatus({
  selectPeriod,
}: {
  selectPeriod: Periods;
}) {
  const data = await getWorkflowExecutionStats(selectPeriod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditsUsageInPeriod({
  selectPeriod,
}: {
  selectPeriod: Periods;
}) {
  const data = await getCreditUsageToPeriod(selectPeriod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credits consumed in the selected period"
    />
  );
}

export default Page;
