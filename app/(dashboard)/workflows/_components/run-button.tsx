"use client";
import { RunWorkflow } from "@/actions/workflows/run-workflows";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow run started", { id: workflowId });
    },
    onError: () => {
      toast.error("Error! Something went wrong...", { id: workflowId });
    },
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2 cursor-pointer"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run...", {
          id: workflowId,
        });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} className="stroke-green-400" />
      Run
    </Button>
  );
};
