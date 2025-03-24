import { ExecutionEnvironment } from "@/types/executor";

import { AddPropertyToJsonTask } from "../task/add-property-to-json ";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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
    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("input->Property value not defined");
    }

    const parsedJson = JSON.parse(jsonData);
    parsedJson[propertyName] = propertyValue;
    environment.setOutput("Update JSON", JSON.stringify(parsedJson));

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
