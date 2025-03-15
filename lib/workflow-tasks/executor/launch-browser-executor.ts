import puppeteer from "puppeteer";
import { waitFor } from "@/lib/helper/waitFor";

export async function LaunchBrowserExecutor(): Promise<boolean> {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    await waitFor(3000);
    await browser.close();
    return true;
  } catch (error) {
    console.log("Error in LaunchBrowserExecutor:", error);
    return false;
  }
}
