"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow-tasks/execution-plan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

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

  if (!flowDefinition) {
    throw new Error("Flow definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error || !result.executionPlan) {
    throw new Error("No valid execution plan generated");
  }

  const executionPlan: WorkflowExecutionPlan = result.executionPlan;
  console.log("Execution plan", executionPlan);
}
