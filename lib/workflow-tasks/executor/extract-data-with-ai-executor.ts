import OpenAI from "openai";

import { ExecutionEnvironment } from "@/types/executor";

import { ExtractDataWithAITask } from "../task/extract-data-with-ai";
import prisma from "@/lib/prisma";
import { symetricDecrypt } from "@/lib/encryption";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = await environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->Credentials not defined");
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->Prompt not defined");
    }
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->Content not defined");
    }

    // Get credentials from the db
    const credentialsData = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });
    if (!credentialsData) {
      environment.log.error("Credential not found");
      return false;
    }

    // decrypt the credential
    const plainCredentialValue = symetricDecrypt(credentialsData.value);
    if (!plainCredentialValue) {
      environment.log.error("cannot decrypt the credential");
      return false;
    }

    // console.log("@PLAIN CREDENTIAL VALUE", plainCredentialValue);

    const openai = new OpenAI({
      apiKey: plainCredentialValue,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a web scraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input, and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object. Do not include any other text or explanation. analyze the input content carefully and extract the data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the data provided in the input content and ensure the output is always a valid JSON array without any additional text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
    });

    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens}`
    );

    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("Empty response from OpenAI");
      return false;
    }

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    environment.log.error(`Error in LaunchBrowserExecutor: ${error.message}`);
    return false;
  }
}
