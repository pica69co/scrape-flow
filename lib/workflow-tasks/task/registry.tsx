import { ExtractTexFromElementTask } from "./extract-text-from-elemnt";
import { LaunchBrowserTask } from "./launch-browser";
import { PageToHtmlTask } from "./page-to-html";

export const TaskRegistry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTexFromElementTask,
};
