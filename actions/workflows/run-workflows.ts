"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow-tasks/execute-workflow";
import { FlowToExecutionPlan } from "@/lib/workflow-tasks/execution-plan";
import { TaskRegistry } from "@/lib/workflow-tasks/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;

  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("No execution plan found");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    // if the workflow is a draft

    if (!flowDefinition) {
      throw new Error("Flow definition is not defined");
    }
    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error || !result.executionPlan) {
      throw new Error("No valid execution plan generated");
    }
    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution not created");
  }

  ExecuteWorkflow(execution.id);

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
