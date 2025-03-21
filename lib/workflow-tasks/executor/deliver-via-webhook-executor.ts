import { ExecutionEnvironment } from "@/types/executor";

import { DeliverViaWebhookTask } from "../task/deliver-via-webhook";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = await environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input->TargetUrl not defined");
    }
    const body = await environment.getInput("Body");
    if (!body) {
      environment.log.error("input->Body not defined");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(
        `statusCode->${statusCode} - Failed to deliver via webhook`
      );
      return false;
    }
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
