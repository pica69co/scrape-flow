import { ExecutionEnvironment } from "@/types/executor";

import { ExtractTexFromElementTask } from "../task/extract-text-from-elemnt";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTexFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.log("Selector is required");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      console.log("Html is required");
      return false;
    }
    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      console.error(`Element not found for selector: ${selector}`);
      return false;
    }
    const extractedText = $.text(element);
    if (!extractedText) {
      console.error(`No text found in selector: ${selector}`);
      return false;
    }
    environment.setOutput("Extracted text", extractedText);
    return true;
  } catch (error) {
    console.log("Error in LaunchBrowserExecutor:", error);
    return false;
  }
}
