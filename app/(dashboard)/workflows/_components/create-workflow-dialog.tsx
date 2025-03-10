"use client";
import { CustomDialogHeader } from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  CreateWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import { Layers2Icon, Loader2 } from "lucide-react";
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
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";

export const CreateWorkflowDialog = ({
  triggerText,
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(CreateWorkflowSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      toast.success("Workflow created successfully", { id: "workflow-create" });
      form.reset();
    },
    onError: () => {
      toast.error("Error creating workflow", { id: "workflow-create" });
    },
  });

  const onSubmit = useCallback(
    (values: CreateWorkflowSchemaType) => {
      toast.loading("Creating workflow...", {
        id: "workflow-create",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create Workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Create Workflow"
          subTitle="Start building your workflow"
          icon={Layers2Icon}
        />
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
