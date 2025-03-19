"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LoaderCircle } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { UnpublishWorkflow } from "@/actions/workflows/unpublish-workflow";
import { toast } from "sonner";

export const UnpublishBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Unpublish Workflow Started...", {
        id: workflowId,
        icon: <LoaderCircle className="animate-spin stroke-white" size={16} />,
      });
    },
    onError: () => {
      toast.error("Error Unpublishing workflow", { id: workflowId });
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      {mutation.isPending ? (
        <LoaderCircle className="animate-spin stroke-orange-500" size={16} />
      ) : (
        <>
          <DownloadIcon size={16} className="stroke-orange-500" />
          Unpublish
        </>
      )}
    </Button>
  );
};
