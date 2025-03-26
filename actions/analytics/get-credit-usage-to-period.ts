"use server";

import { PeriodsToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Periods } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

export const getCreditUsageToPeriod = async (period: Periods) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { COMPLETED, FAILED } = ExecutionPhaseStatus;

  const dateRange = PeriodsToDateRange(period);
  const executionsPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        // filter by status
        in: [COMPLETED, FAILED],
      },
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as Record<string, { success: number; failed: number }>);

  executionsPhases.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  // return an object more suitable for charting
  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
};
