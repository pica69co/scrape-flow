import puppeteer from "puppeteer";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../task/launch-browser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    const browser = await puppeteer.launch({
      headless: true, // true: headless mode, false: non-headless mode
    });
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
