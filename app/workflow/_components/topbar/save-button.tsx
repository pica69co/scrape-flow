"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflows } from "@/actions/workflows/update-workflows";
import { toast } from "sonner";

export const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflows,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
      // Optionally, you can add logic to refresh the workflow or navigate to another page
    },
    onError: () => {
      toast.error("Error saving workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
      disabled={saveMutation.isPending}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      {saveMutation.isPending ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        "Save"
      )}
    </Button>
  );
};
