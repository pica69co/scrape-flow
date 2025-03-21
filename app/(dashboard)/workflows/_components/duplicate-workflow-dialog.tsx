"use client";
import { CustomDialogHeader } from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DuplicateWorkflowSchema,
  DuplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { duplicateWorkflow } from "@/actions/workflows/duplicate-workflow";
import { cn } from "@/lib/utils";

export const DuplicateWorkflowDialog = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<DuplicateWorkflowSchemaType>({
    resolver: zodResolver(DuplicateWorkflowSchema),
    defaultValues: {
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", {
        id: "workflow-duplicate",
      });
      setOpen((prev) => !prev);
      form.reset();
    },
    onError: () => {
      toast.error("Error creating workflow", { id: "workflow-duplicate" });
    },
  });

  const onSubmit = useCallback(
    (values: DuplicateWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", {
        id: "workflow-duplicate",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader title="Duplicate Workflow" icon={Layers2Icon} />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center text-emerald-600">
                      Name
                      <p className="text-xs text-emerald-600">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Workflow Name"
                        className="dark:text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-emerald-600">
                      Choose a descriptive name for your workflow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center text-emerald-600">
                      Description
                      <p className="text-xs text-emerald-600">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none dark:text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-emerald-600">
                      Provide a brief description of your workflow.
                      <br /> This will help you remember the workflow&apos;
                      purpose .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {!isPending && "Create Workflow"}
                {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
