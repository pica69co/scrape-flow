"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, LoaderCircle, PlayIcon } from "lucide-react";
import UseExecutionPlan from "@/components/hooks/use-execution-plan";
import { useMutation } from "@tanstack/react-query";
import { RunWorkflow } from "@/actions/workflows/run-workflows";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

export const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = UseExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution Started...", {
        id: "flow-execution",
        icon: <LoaderCircle className="animate-spin stroke-white" size={16} />,
      });
    },
    onError: () => {
      toast.error("Error generating execution plan", { id: "flow-execution" });
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
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      {mutation.isPending ? (
        <Loader2Icon size={16} className="animate-spin stroke-orange-400" />
      ) : (
        "Execute"
      )}
    </Button>
  );
};
