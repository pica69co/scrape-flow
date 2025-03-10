"use server";

import prisma from "@/lib/prisma";
import {
  CreateWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createWorkflow = async (form: CreateWorkflowSchemaType) => {
  const { success, data } = CreateWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });
  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
};
