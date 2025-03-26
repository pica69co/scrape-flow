"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Periods } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const PeriodSelector = ({
  periods,
  selectedPeriod,
}: {
  periods: Periods[];
  selectedPeriod: Periods;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a period" />
        <SelectContent>
          {periods.map((period, index) => (
            <SelectItem key={index} value={`${period.month}-${period.year}`}>
              {`${MONTH_NAMES[period.month]} ${period.year}`}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectTrigger>
    </Select>
  );
};
