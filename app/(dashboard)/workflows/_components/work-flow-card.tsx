"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
  ChevronRightIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteWorkflowDialog from "./delete-workflow-dialog";
import { RunBtn } from "./run-button";
import { ScheduleDialog } from "./schedule-dialog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/execution-status-indicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { DuplicateWorkflowDialog } from "./duplicate-workflow-dialog";

export const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === "DRAFT";

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-yellow-500 text-yellow-600",
    [WorkflowStatus.PUBLISHED]: "bg-emerald-500",
  };

  return (
    <Card className="border border-separate rounded-lg overflow-hidden shadow-sm dark:shadow-emerald/30 hover:shadow-md group/card">
      <CardContent className="flex h-[100px] justify-between p-4 items-center">
        <div className="flex justify-end items-center space-x-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 text-white w-5" />
            )}
          </div>
          <div className="">
            <h3 className="flex text-base text-muted-foreground font-bold items-center">
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex hover:underline items-center"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              <span
                className={cn(
                  isDraft && "text-xs font-medium bg-yellow-100 ml-2 px-2"
                  // !isDraft && "text-xs font-medium bg-emerald-100 ml-2 px-2"
                )}
              >
                {isDraft ? "(Draft)" : ""}
              </span>
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <ScheduleSection
              isDraft={isDraft}
              creditsCost={workflow.creditCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
};

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size="sm">
            <TooltipWrapper content={"More Actions"}>
              <div className="flex h-full justify-center w-full cursor-pointer items-center">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex text-destructive cursor-pointer gap-2 items-center"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>{" "}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ScheduleSection({
  isDraft,
  creditsCost,
  workflowId,
  cron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) return null;
  return (
    <div className="flex gap-2 items-center">
      <CornerDownRightIcon className="h-4 text-muted-foreground w-4" />
      <ScheduleDialog
        key={`${cron}-${workflowId}`} // to force re-render when cron changes
        workflowId={workflowId}
        cron={cron}
      />
      <MoveRightIcon className="h-4 text-muted-foreground w-4" />
      <TooltipWrapper content={"Credit consumption for full run"}>
        <div className="flex gap-3 items-center">
          <Badge
            variant="outline"
            className="rounded-sm text-muted-foreground space-x-2"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  if (workflow.status === WorkflowStatus.DRAFT) return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt &&
    formatDistanceToNow(lastRunAt, {
      addSuffix: true,
    });
  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-emerald-400/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        )}
        {!lastRunAt && <p>No runs yet</p>}
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at: </span>
          <span>{nextSchedule}</span>
          <span className="text-sm">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
}
