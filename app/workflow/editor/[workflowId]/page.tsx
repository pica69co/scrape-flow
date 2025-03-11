import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Editor } from "../../_components/editor";

const EditorPage = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) return <div>Unauthorized</div>;
  if (!workflowId) return <div>Workflow ID is required</div>;
  console.log("Workflow ID:", workflowId);

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  if (!workflow) return <div>Workflow not found</div>;

  return <Editor workflow={workflow} />;
};

export default EditorPage;
