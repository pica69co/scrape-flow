import { ExecutionEnvironment } from "@/types/executor";

import { ReadPropertyFromJsonTask } from "../task/read-property-from-json";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = await environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input->JSON not defined");
    }
    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input->Property name not defined");
    }
    const parsedJson = JSON.parse(jsonData);
    const propertyValue = parsedJson[propertyName];
    if (propertyValue === undefined) {
      environment.log.error(`Property ${propertyName} not found in JSON`);
      return false;
    }
    environment.setOutput("Property value", propertyValue);

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
