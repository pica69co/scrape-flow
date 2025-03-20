"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";
export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const interval = parser.parse(cron);
    await prisma.workflow.update({
      where: { id, userId },
      data: { cron, nextRunAt: interval.next().toDate() },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to update workflow cron");
  }

  revalidatePath("/workflows");
}
