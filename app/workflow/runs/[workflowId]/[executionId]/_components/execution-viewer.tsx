"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/get-workflow-execution-with-phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { WorkflowExecution } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, CircleDashedIcon } from "lucide-react";
import React from "react";

type ExecutionData = WorkflowExecution;
// Awaited<typeof GetWorkflowExecutionWithPhases>;

export const ExecutionViewer = ({
  initialData,
}: {
  initialData: ExecutionData;
}) => {
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden ">
        <div className="py-4 px-2">
          {/*Status label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CircleDashedIcon
                size={20}
                className="stroke-muted-foreground/80"
              />
              <span>Status</span>
            </div>
            <div className="capitalize font-semibold flex gap-2 items-center">
              {query.data?.status}
            </div>
          </div>
          {/*Started at label */}
          <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <CalendarIcon size={20} className="stroke-muted-foreground/80" />
              <span>Started At</span>
            </div>
            <div className="lowercase font-semibold flex gap-2 items-center">
              {query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
