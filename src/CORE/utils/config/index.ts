interface Config {
  PORT: number;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  OTP_EXPIRY_MINUTES: number;
  NODE_ENV: string;
  MONGO_URI: string;
  ID_ENC_SECRET: string;
  SESSIONSECRET: string;
  TERMII_API_KEY: string;
  TERMII_BASE_URL: string;
  TERMII_DEVICE_ID: string;
  TERMII_SENDER_ID: string;
  TERMII_FROM: string;
  TERMII_SMS_TYPE: string;
  TERMII_CHANNEL: string;
  PAYSTACK_SECRET_KEY: string;
  REDIS_URL: string;
  REDIS_HOST: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  REDIS_PORT: number;
  REDIS_TLS: string;
  JWT_SECRET: string;
}

// Export the concrete implementation
export const config: Config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "587", 10),
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES || "5", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "",
  ID_ENC_SECRET: process.env.ID_ENC_SECRET || "",
  SESSIONSECRET: process.env.SESSION_SECRET || "",
  TERMII_API_KEY: process.env.TERMII_API_KEY || "",
  TERMII_BASE_URL: process.env.TERMII_BASE_URL || "",
  TERMII_DEVICE_ID: process.env.TERMII_DEVICE_ID || "",
  TERMII_SENDER_ID: process.env.TERMII_SENDER_ID || "",
  TERMII_FROM: process.env.TERMII_FROM || "N-Alert",
  TERMII_SMS_TYPE: process.env.TERMII_SMS_TYPE || "plain",
  TERMII_CHANNEL: process.env.TERMII_CHANNEL || "dnd",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
  REDIS_URL: process.env.REDIS_URL || "",
  REDIS_USERNAME: process.env.REDIS_USERNAME || "",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  REDIS_HOST: process.env.REDIS_HOST || "",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "17481", 10),
  REDIS_TLS: process.env.REDIS_TLS || "true",
  JWT_SECRET: process.env.JWT_SECRET || "",
};
