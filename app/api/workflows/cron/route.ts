import { getAppUrl } from "@/lib/helper/app-url";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: {
        not: null,
      },
      nextRunAt: { lte: now },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json(
    { workflowsToRun: workflows.length },
    {
      status: 200,
    }
  );
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );
  console.log(`@Triggering URL: ${triggerApiUrl}`);

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
    },
    cache: "no-store",
    // signal: AbortSignal.timeout(5000),
  }).catch((error) => {
    console.error(
      `@Error triggering workflow ${workflowId}: error -> `,
      error.message
    );
  });
}
