import { ExecutionEnvironment } from "@/types/executor";

import { ExtractTexFromElementTask } from "../task/extract-text-from-elemnt";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTexFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      // console.log("Selector is required");
      environment.log.error("Selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not defined");
      return false;
    }
    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      environment.log.error(`No element found for selector: ${selector}`);
      return false;
    }
    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error(`No text found for selector: ${selector}`);
      return false;
    }
    environment.setOutput("Extracted text", extractedText);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(
      `Error in ExtractTextFromElementExecutor: ${error.message}`
    );
    return false;
  }
}
