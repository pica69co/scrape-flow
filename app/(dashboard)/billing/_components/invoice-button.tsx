"use client";

import { DownloadInvoice } from "@/actions/billing/download-invoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export const InvoiceBtn = ({ id }: { id: string }) => {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => {
      toast.error("Error downloading invoice");
    },
  });

  return (
    <Button
      variant="ghost"
      className="text-xs gap-2 text-muted-foreground px-1 cursor-pointer"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      Invoice
      {mutation.isPending && (
        <Loader2Icon className="animate-spin h-4 w-4 stroke-orange-400" />
      )}
    </Button>
  );
};
