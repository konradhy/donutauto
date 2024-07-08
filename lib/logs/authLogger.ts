import logger from "./logger";

export const logAuthEvent = (
  event: string,
  userId: string,
  details?: object,
  ip?: string,
  userAgent?: string,
  category?: string,
) => {
  logger.info(`Auth Event: ${event}`, { userId, ...details });
};

export const logAuthError = (
  error: string,
  userId: string,
  details?: object,
  ip?: string,
  userAgent?: string,
  category?: string,
) => {
  logger.error(`Auth Error: ${error}`, { userId, ...details });
};
