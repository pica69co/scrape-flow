"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { DeleteCredential } from "@/actions/credentials/delete-credential";

interface Props {
  name: string;
}

const DeleteCredentialDialog = ({ name }: Props) => {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success(`Credential ${name} deleted successfully!`, {
        id: name,
      });
      setConfirmText("");
    },
    onError: () => {
      toast.error(`Error deleting credential ${name}`, {
        id: name,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={"icon"}
          className="text-red-500 hover:text-red-600"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash2Icon size={18} className="cursor-pointer" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            credential and remove all of its data.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{name}</b> to confirm.
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
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-red-500 text-gray-300 hover:bg-red/90 cursor-pointer"
            onClick={() => {
              toast.loading(`Deleting workflow...`, { id: name });
              deleteMutation.mutate(name);
            }}
          >
            {"Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredentialDialog;
