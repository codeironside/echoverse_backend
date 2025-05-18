import crypto from "crypto";

class CryptoService {
  private algorithm = "aes-256-gcm";
  private key: Buffer;

  constructor() {
    const secret = process.env.ID_ENC_SECRET || "fallback_secret";
    this.key = crypto.scryptSync(secret, "salt", 32);
  }

  public encryptId(plainId: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      iv
    ) as crypto.CipherGCM;
    const encrypted = Buffer.concat([
      cipher.update(plainId, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return [
      iv.toString("hex"),
      authTag.toString("hex"),
      encrypted.toString("hex"),
    ].join(":");
  }

  public decryptId(token: string): string {
    const [ivHex, authTagHex, encryptedHex] = token.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error("Invalid token format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      iv
    ) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  }
}

export default new CryptoService();
