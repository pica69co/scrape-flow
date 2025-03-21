"use server";

import { symetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  CreateCredentialSchema,
  CreateCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCredential(form: CreateCredentialSchemaType) {
  const { success, data } = CreateCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Encrypt the credential data
  const encryptedValue = symetricEncrypt(data.value);

  // Store the credential in the database
  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) {
    throw new Error("Error creating credential");
  }

  revalidatePath("/credentials");
}
