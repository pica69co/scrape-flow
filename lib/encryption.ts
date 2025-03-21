import "server-only";

import crypto from "crypto";

const algorithm = "aes-256-cbc";
// openssl rand -hex 32
// https://generate-random.org/encryption-key-generator

export const symetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(data);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }

  const parts = encrypted.split(":");
  const iv = Buffer.from(parts.shift()! as string, "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
