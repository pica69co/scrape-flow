import "server-only";

// import { writeFile } from "fs";
import Stripe from "stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import prisma from "../prisma";

export const HandleCheckoutSessionCompleted = async (
  event: Stripe.Checkout.Session
) => {
  //    writeFile("session.completed.json", JSON.stringify(event), (err) => {})

  if (!event.metadata) {
    throw new Error("No metadata found in the event");
  }

  const { userId, PackId } = event.metadata;
  if (!userId || !PackId) {
    throw new Error("No userId or PackId found in the event metadata");
  }

  const purchasedPack = getCreditsPack(PackId as PackId);
  if (!purchasedPack) {
    throw new Error("No purchased pack found");
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });
};
