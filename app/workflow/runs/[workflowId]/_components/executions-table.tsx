"use client";
import { GetWorkflowExecutions } from "@/actions/workflows/get-workflow-executions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";

import { WorkflowExecutionStatus } from "@/types/workflow";
import ExecutionStatusIndicator from "./execution-status-indicator";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export const ExecutionsTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000, // 5 seconds
  });

  return (
    <div className="border round-lg shadow-md overflow-auto">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="">Execution ID</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started At (desc){" "}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data.map((execution) => {
            const duration = DatesToDurationString(
              execution.completedAt,
              execution.startedAt
            );

            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, {
                addSuffix: true,
              });

            return (
              <TableRow
                key={execution.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  router.push(`/workflow/runs/${workflowId}/${execution.id}`);
                }}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs gap-2">
                      <span className="">Triggered via </span>
                      <Badge variant="outline">{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExecutionStatus}
                      />
                      <span className="font-semibold">{execution.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <CoinsIcon className="text-emerald-600" />

                      <span className="font-semibold">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-muted-foreground font-semibold ">
                    {formattedStartedAt}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
