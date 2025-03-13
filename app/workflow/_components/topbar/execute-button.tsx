"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import UseExecutionPlan from "@/components/hooks/use-execution-plan";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = UseExecutionPlan();
  return (
    <Button
      variant={"outline"}
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => {
        const plan = generate();
        console.log("---Execution Plan---");
        console.table(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};
