"use client";

import React, { useCallback, useState } from "react";
import { CustomDialogHeader } from "@/components/custom-dialog-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  CreateCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential";

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
import { createCredential } from "@/actions/credentials/create-credential";
import { toast } from "sonner";
import { Loader2, ShieldEllipsis } from "lucide-react";

export const CreateCredentialDialog = ({
  triggerText,
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateCredentialSchemaType>({
    resolver: zodResolver(CreateCredentialSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      toast.success("Credential created successfully", {
        id: "credential-create",
      });
      form.reset();
    },
    onError: () => {
      toast.error("Error creating credential", { id: "credential-create" });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCredentialSchemaType) => {
      toast.loading("Creating credential...", {
        id: "credential-create",
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
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={ShieldEllipsis} title="Create Credential" />
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
                      Enter a unique and descriptive name for the credential.{" "}
                      <br />
                      This name will be used to identify the credential in the
                      list.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center text-emerald-600">
                      Value
                      <p className="text-xs text-emerald-600">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none dark:text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-emerald-600">
                      Enter the value associated with this credential.
                      <br /> This value will be securely encrypted and stored.
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
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
