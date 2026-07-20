import rateLimit from "express-rate-limit";

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || "15", 10) * 60 * 1000;
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10);

export const apiLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
