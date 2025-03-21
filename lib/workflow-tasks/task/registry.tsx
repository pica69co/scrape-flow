import { TaskType } from "@/types/task";
import { ExtractTexFromElementTask } from "./extract-text-from-elemnt";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHtmlTask } from "./page-to-html";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fill-input";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTexFromElementTask,
  FILL_INPUT: FillInputTask,
};
