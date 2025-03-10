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
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  FileTextIcon,
  MoreVerticalIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DeleteWorkflowDialog from "./delete-workflow-dialog";

export const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === "DRAFT";

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-yellow-500 text-yellow-600",
    [WorkflowStatus.PUBLISHED]: "bg-emerald-500",
  };

  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-emerald/30 transition-all duration-200">
      <CardContent className="flex items-center justify-between p-4 h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="">
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflows/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
                <span
                  className={cn(
                    isDraft && "text-xs font-medium bg-yellow-100 ml-2 px-2"
                  )}
                >
                  {isDraft ? "(Draft)" : "(Published)"}
                </span>
              </Link>
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflows/${workflow.id}`}
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
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center cursor-pointer gap-2"
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
