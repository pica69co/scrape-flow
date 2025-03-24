import { ExecutionEnvironment } from "@/types/executor";

import { NavigateUrlTask } from "../task/navigate-url";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    const url = await environment.getInput("URL");
    if (!url) {
      environment.log.error("input->Url not defined");
    }
    await environment.getPage()!.goto(url);
    environment.log.info(`Visited URL: ${url}`);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
