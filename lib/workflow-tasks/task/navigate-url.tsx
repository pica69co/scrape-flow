import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon } from "lucide-react";

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate Url",
  icon: (props) => <Link2Icon {...props} className="stroke-orange-400" />,
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      // helperText: "CSS selector to extract text from",
    },
    {
      name: "URL",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const, // inputs are readonly
  outputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const, // outputs are readonly
} satisfies WorkflowTask;
