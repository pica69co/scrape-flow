"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, LoaderCircle, UploadIcon } from "lucide-react";
import UseExecutionPlan from "@/components/hooks/use-execution-plan";
import { useMutation } from "@tanstack/react-query";
import { PublishWorkflow } from "@/actions/workflows/publish-workflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

export const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = UseExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Publish Workflow Started...", {
        id: workflowId,
        icon: <LoaderCircle className="animate-spin stroke-white" size={16} />,
      });
    },
    onError: () => {
      toast.error("Error Publishing workflow", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // client side validation
          return;
        }
        toast.loading("Publishing workflow...", {
          id: workflowId,
          icon: (
            <LoaderCircle
              className="animate-spin stroke-emerald-400"
              size={16}
            />
          ),
        });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      {mutation.isPending ? (
        <Loader2Icon size={16} className="animate-spin stroke-orange-400" />
      ) : (
        "Publish"
      )}
    </Button>
  );
};
