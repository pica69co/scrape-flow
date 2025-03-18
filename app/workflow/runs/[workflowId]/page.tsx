import React, { Suspense } from "react";
import { Topbar } from "../../_components/topbar/topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/get-workflow-executions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { ExecutionsTable } from "./_components/executions-table";

const ExecutionPage = async ({
  params,
}: {
  params: { workflowId: string };
}) => {
  const { workflowId } = await params;
  return (
    <div>
      <Topbar
        workflowId={workflowId}
        title="All runs"
        subTitle="List of all your workflow runs"
        hideButtons
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon
              size={30}
              className="animate-spin stroke-emerald-600"
            />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
};

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return <div>No executions found</div>;
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-gray-200 w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-emerald-600" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No Runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}

export default ExecutionPage;
