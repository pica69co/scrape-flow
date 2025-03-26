"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const SetupUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });
  if (!balance) {
    // free
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }

  redirect("/");
};
