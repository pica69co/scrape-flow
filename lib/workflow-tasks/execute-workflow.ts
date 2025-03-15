import "server-only";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
// import { waitFor } from "../helper/waitFor";
import { ExecutorRegistry } from "./executor/registry";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // TODO: setup the execution environment
  const environment = {
    phases: {},
  };

  // TODO: Initialize the workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);

  // TODO: Initialize the phases status
  await initializePhasesStatus(execution);

  // eslint-disable-next-line prefer-const
  let creditsConsumed = 0;

  let executionFailed = false;

  for (const phase of execution.phases) {
    // TODO: execute the phase
    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // TODO: finalize the execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  // TODO: clean up the execution environment

  revalidatePath(`/workflow/runs`);
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: WorkflowExecutionStatus.RUNNING,
      startedAt: new Date(),
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initializePhasesStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: { in: execution.phases.map((phase: any) => phase.id) },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId, // Ensure the last run ID is updated
      },
      data: { lastRunStatus: finalStatus },
    })
    .catch((error) => {
      // ignore the error if the last run ID is not found
      // this mean that we have triggered a new runs for this workflow while the previous one is still running

      console.error("Error updating workflow last run status:", error);
    });
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  // Update the phase status to RUNNING
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits required`
  );

  // TODO: Decrement the user's balance (with required credits)

  // execute phase simulation
  // await waitFor(2000);
  // const success = Math.random() < 0.7; // Simulate a 30% chance of failure
  const success = await executePhase(node, phase);

  await finalizePhase(phase.id, success);

  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function executePhase(node: AppNode, phase: ExecutionPhase) {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  return await runFn();
}
