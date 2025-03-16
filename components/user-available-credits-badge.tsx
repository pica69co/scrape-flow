"use client";

import { GetAvailableCredits } from "@/actions/billing/get-available-credits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ReactCountupWrapper } from "./ui/react-countup-wrapper";
import { buttonVariants } from "./ui/button";

export const UserAvailableCreditsBadge = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: GetAvailableCredits,
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return (
    <Link
      href={"/*billing"}
      className={cn(
        "w-full items-center space-x-2",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={16} className="text-emerald-500" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="animate-spin size-4" />}
        {!query.isLoading && query.data && (
          <ReactCountupWrapper value={query.data} />
        )}
        {!query.isLoading && !query.data && "-"}
      </span>
    </Link>
  );
};
