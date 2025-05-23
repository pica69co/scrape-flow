import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTexFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text from Element",
  icon: (props: LucideProps) => (
    <TextIcon {...props} className="stroke-rose-400" />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
      // helperText: "CSS selector to extract text from",
    },
  ] as const, // inputs are readonly
  outputs: [
    {
      name: "Extracted text",
      type: TaskParamType.STRING,
    },
  ] as const, // outputs are readonly
} satisfies WorkflowTask;
