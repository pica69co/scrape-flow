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

export const TaskMenu = () => {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction", "interactions", "timing", "results"]}
      >
        <AccordionItem value="interactions">
          <AccordionTrigger className="text-lg font-semibold">
            User interactions
          </AccordionTrigger>
          <AccordionContent>
            <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
            <TaskMenuBtn taskType={TaskType.CLICK_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="extraction">
          <AccordionTrigger className="text-lg font-semibold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent>
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="text-lg font-semibold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent>
            <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="results">
          <AccordionTrigger className="text-lg font-semibold">
            Result delivery
          </AccordionTrigger>
          <AccordionContent>
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
      className="flex items-center justify-center gap-2 w-full border"
    >
      <div className="flex items-center gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
}
