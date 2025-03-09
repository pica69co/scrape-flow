import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
// import { waitFor } from "@/lib/helper/waitFor";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateWorkflowDialog } from "./_components/create-workflow-dialog";

const WorkflowsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflowsSuspense />
        </Suspense>
      </div>
    </div>
  );
};

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkflowsSuspense() {
  // await waitFor(3000);
  const workflows = await getWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong!...Please, Try Again.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent">
          <InboxIcon className="stroke-emerald-500" size={40} />
        </div>
        <div className="flex flex-col text-center gap-1">
          <p className="font-bold">No Workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first Workflow" />
      </div>
    );
  }

  return <div></div>;
}

export default WorkflowsPage;
