"use client";
import { UpdateWorkflowCron } from "@/actions/workflows/update-workflow-cron";
import { CustomDialogHeader } from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  TriangleAlertIcon,
  CalendarIcon,
  Loader2Icon,
  ClockIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import parser from "cron-parser";
import { RemoveWorkflowScheduled } from "@/actions/workflows/remove-workflow-scheduled";
import { Separator } from "@/components/ui/separator";

export const ScheduleDialog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = useState<string>(props.cron || "");
  const [validCron, setValidCron] = useState<boolean>(false);
  const [readableCronStr, setReadableCronStr] = useState<string>("");

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Workflow schedule updated", { id: "cron" });
    },
    onError: () => {
      toast.error("Error! Something went wrong...", { id: "cron" });
    },
  });

  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowScheduled,
    onSuccess: () => {
      toast.success("Workflow schedule removed", { id: "cron" });
    },
    onError: () => {
      toast.error("Error! Something went wrong...", { id: "cron" });
    },
  });

  useEffect(() => {
    try {
      parser.parse(cron);
      // Check if the cron expression is valid
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCronStr(humanCronStr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      setValidCron(false);
    }
  }, [cron]);

  // avoid unnecessary re-renders and flickering effect
  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm text-orange-500 p-0 h-auto cursor-pointer",
            workflowHasValidCron && "text-emerald-500"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex gap-2 items-center">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex gap-1 items-center">
              <TriangleAlertIcon className="h-4 w-4 stroke-yellow-500" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-red-500 text-red-500",
              validCron && "border-green-500 text-emerald-600"
            )}
          >
            {validCron ? readableCronStr : "Invalid cron expression"}
          </div>
          {workflowHasValidCron && (
            <div className="">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 w-full cursor-pointer hover:text-red-600"
                onClick={() => {
                  toast.loading("Removing schedule...", { id: "cron" });
                  removeScheduleMutation.mutate(props.workflowId);
                }}
              >
                Remove current schedule
              </Button>
              <Separator className="my-4" />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 px-6">
          {/* <DialogClose asChild>
            <Button variant="secondary" className="w-full" onClick={() => {}}>
              Cancel
            </Button>
          </DialogClose> */}
          <DialogClose asChild>
            <Button
              className="w-full cursor-pointer hover:bg-emerald-600 hover:text-white"
              onClick={() => {
                toast.loading("Updating schedule...", { id: "cron" });
                // Call the mutation function to update the cron schedule
                mutation.mutate({
                  id: props.workflowId,
                  cron,
                });
              }}
              disabled={mutation.isPending || !validCron}
            >
              {mutation.isPending ? (
                <Loader2Icon
                  size={16}
                  className="animate-spin stroke-emerald-500"
                />
              ) : (
                "Save"
              )}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
