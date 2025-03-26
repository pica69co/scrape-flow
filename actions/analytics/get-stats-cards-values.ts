"use server";

import { PeriodsToDateRange } from "@/lib/helper/dates";
import { Periods } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { WorkflowExecutionStatus } from "@/types/workflow";
import prisma from "@/lib/prisma";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export const GetStatsCardsValues = async (period: Periods) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodsToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };
  stats.creditsConsumed = executions.reduce(
    (acc, execution) => acc + execution.creditsConsumed,
    0
  );
  stats.phaseExecutions = executions.reduce(
    (acc, execution) => acc + execution.phases.length,
    0
  );

  return stats;
};
