"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow-tasks/task/registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon } from "lucide-react";

export const TaskMenu = () => {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "extraction",
          "interactions",
          "timing",
          "results",
          "storage",
        ]}
      >
        <AccordionItem value="interactions">
          <AccordionTrigger className="text-lg font-bold">
            User interactions
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />
            <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extraction">
          <AccordionTrigger className="text-lg font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="storage">
          <AccordionTrigger className="text-lg font-semibold">
            Data storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="timing">
          <AccordionTrigger className="text-lg font-semibold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="results">
          <AccordionTrigger className="text-lg font-bold">
            Result delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];

  const onDragStart = (e: React.DragEvent, type: TaskType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"secondary"}
      draggable
      onDragStart={(e) => onDragStart(e, taskType)}
      className="flex items-center justify-between gap-2 w-full border"
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
      <Badge className="flex items-center gap-2" variant="outline">
        <CoinsIcon size={14} className="" />
        {task.credits}
      </Badge>
    </Button>
  );
}
