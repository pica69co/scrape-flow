import React, { Suspense } from "react";
import { Topbar } from "@/app/workflow/_components/topbar/topbar";

import { Loader2Icon } from "lucide-react";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/get-workflow-execution-with-phases";
import { ExecutionViewer } from "@/app/workflow/runs/[workflowId]/[executionId]/_components/execution-viewer";

const ExecutionViewerPage = async ({
  params,
}: {
  params: { executionId: string; workflowId: string };
}) => {
  // params should be awaited before using its properties
  const { executionId, workflowId } = await params;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={executionId}
        title="Workflow run details"
        subTitle={workflowId}
        hideButtons // to avoid error with zustand
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full">
              <Loader2Icon className="size-10 animate-spin stroke-emerald-600" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
};

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Error: Workflow execution data is unavailable.</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}

export default ExecutionViewerPage;
