import { TaskType } from "@/types/task";
import { ExtractTexFromElementTask } from "./extract-text-from-elemnt";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHtmlTask } from "./page-to-html";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fill-input";
import { ClickElementTask } from "./click-element";
import { WaitForElementTask } from "./wait-for-element";
import { DeliverViaWebhookTask } from "./deliver-via-webhook";
import { ExtractDataWithAITask } from "./extract-data-with-ai";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTexFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
};
