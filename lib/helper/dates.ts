import { Periods } from "@/types/analytics";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";

export function DatesToDurationString(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined
) {
  if (!startDate || !endDate) {
    return null;
  }

  const timeElapsed = endDate.getTime() - startDate.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed} ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

export function PeriodsToDateRange(period: Periods) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));

  return {
    startDate,
    endDate,
  };
}
