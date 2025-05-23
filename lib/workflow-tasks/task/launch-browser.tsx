import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => (
    <GlobeIcon {...props} className="stroke-pink-400" />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website URL",
      type: TaskParamType.STRING,
      helperText: "eg: https://example.com",
      required: true,
      hideHandle: true,
    },
  ] as const, // inputs are readonly
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const, // outputs are readonly
} satisfies WorkflowTask;
