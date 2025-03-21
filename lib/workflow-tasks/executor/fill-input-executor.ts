import { ExecutionEnvironment } from "@/types/executor";

import { FillInputTask } from "../task/fill-input";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = await environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->Selector not defined");
    }
    const value = await environment.getInput("Value");
    if (!value) {
      environment.log.error("input->Value not defined");
    }
    await environment.getPage()!.type(selector, value);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
