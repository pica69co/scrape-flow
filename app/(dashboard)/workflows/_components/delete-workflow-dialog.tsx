"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DeleteWorkflows } from "@/actions/workflows/delete-workflows";

import {
  AlertDialog,
  // AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

const DeleteWorkflowDialog = ({
  open,
  setOpen,
  workflowName,
  workflowId,
}: Props) => {
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflows,
    onSuccess: () => {
      toast.success(`Workflow ${workflowName} deleted successfully!`, {
        id: workflowId,
      });
      setConfirmText("");
    },
    onError: () => {
      toast.error(`Error deleting workflow ${workflowName}`, {
        id: workflowId,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workflow and remove all of its data.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{workflowName}</b> to confirm.
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setConfirmText("");
            }}
            className="cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-red-500 text-gray-300 hover:bg-red/90 cursor-pointer"
            onClick={() => {
              toast.loading(`Deleting workflow...`, { id: workflowId });
              deleteMutation.mutate(workflowId);
            }}
          >
            {"Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
