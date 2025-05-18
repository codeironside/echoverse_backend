import { Request, Response, NextFunction } from "express";
import logger from "@/core/logger";
import { IncomingHttpHeaders } from "http";

const isSensitiveHeader = (header: string): boolean =>
  ["authorization", "cookie", "x-api-key"].includes(header.toLowerCase());

const getHeaderValue = (header: string | string[] | undefined): string =>
  Array.isArray(header) ? header[0] : header || "";

interface SecureRequestLog {
  method: string;
  url: string;
  route: string;
  ip: string;
  timestamp: string;
  headers: Partial<IncomingHttpHeaders>;
  userAgent: string;
  referrer: string;
  protocol: string;
  httpVersion: string;
  bodySize: number;
  responseStatus: number;
  responseTime: number;
  isSecure: boolean;
  securityFlags: {
    potentialXSS: boolean;
    suspiciousUA: boolean;
    torExitNode: boolean;
    cloudProxy: boolean;
  };
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime();

  const logData: SecureRequestLog = {
    method: req.method,
    url: req.originalUrl,
    route: req.route?.path || "unknown-route",
    ip: getClientIP(req),
    timestamp: new Date().toISOString(),
    headers: sanitizeHeaders(req.headers),
    userAgent: getHeaderValue(req.headers["user-agent"]),
    referrer: getHeaderValue(req.headers.referer ?? req.headers.referrer),
    protocol: req.protocol,
    httpVersion: req.httpVersion,
    bodySize: req.headers["content-length"]
      ? parseInt(req.headers["content-length"])
      : 0,
    responseStatus: res.statusCode,
    responseTime: 0,
    isSecure: req.secure,
    securityFlags: {
      potentialXSS: detectPotentialXSS(req),
      suspiciousUA: detectSuspiciousUserAgent(req.headers["user-agent"]),
      torExitNode: false,
      cloudProxy: isCloudProxy(req),
    },
  };

  const originalSend = res.send;
  res.send = function (body?: any) {
    logData.responseTime = getResponseTime(startTime);
    logData.responseStatus = res.statusCode;
    if (typeof body === "string") {
      logData.securityFlags.potentialXSS ||= detectResponseXSS(body);
    }
    logRequestDetails(logData);
    return originalSend.call(this, body);
  };

  if (
    logData.securityFlags.potentialXSS ||
    logData.securityFlags.suspiciousUA
  ) {
    const logs = {
      message: "Potential security threat detected",
      securityFlags: logData.securityFlags,
      ip: logData.ip,
      method: logData.method,
      url: logData.url,
    };
    logger.warn(JSON.stringify(logs));
  }

  next();
}

function getClientIP(req: Request): string {
  const candidates = [
    req.headers["x-real-ip"],
    req.headers["x-forwarded-for"],
    req.headers["cf-connecting-ip"],
    req.headers["fastly-client-ip"],
    req.socket.remoteAddress,
  ];
  for (const h of candidates) {
    const val = getHeaderValue(h);
    if (val) return val.split(",")[0].trim();
  }
  return "unknown-ip";
}

function sanitizeHeaders(
  headers: IncomingHttpHeaders
): Partial<IncomingHttpHeaders> {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = isSensitiveHeader(key) ? "[REDACTED]" : value;
    return acc;
  }, {} as Partial<IncomingHttpHeaders>);
}

function detectPotentialXSS(req: Request): boolean {
  const patterns = [/<script>/i, /javascript:/i, /onerror=/i];
  const inQuery = Object.values(req.query).some(
    (v) => typeof v === "string" && patterns.some((p) => p.test(v))
  );
  const inBody =
    typeof req.body === "string" && patterns.some((p) => p.test(req.body));
  return inQuery || inBody;
}

function detectResponseXSS(body: string): boolean {
  const patterns = [/<script>/i, /javascript:/i, /onerror=/i];
  return patterns.some((p) => p.test(body));
}

function detectSuspiciousUserAgent(ua?: string): boolean {
  if (!ua) return false;
  const patterns = [/nmap/i, /sqlmap/i, /metasploit/i, /zap/i];
  return patterns.some((p) => p.test(ua));
}

function isCloudProxy(req: Request): boolean {
  return !!(
    req.headers["cf-ipcountry"] ||
    req.headers["x-vercel-id"] ||
    req.headers["x-amz-cf-id"]
  );
}

function getResponseTime(start: [number, number]): number {
  const diff = process.hrtime(start);
  return Math.round(diff[0] * 1e3 + diff[1] / 1e6);
}

function calculateThreatScore(
  flags: SecureRequestLog["securityFlags"]
): number {
  let score = 0;
  if (flags.potentialXSS) score += 30;
  if (flags.suspiciousUA) score += 25;
  if (flags.torExitNode) score += 20;
  if (flags.cloudProxy) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function generateSecurityRecommendations(
  flags: SecureRequestLog["securityFlags"]
): string[] {
  const recs: string[] = [];
  if (flags.potentialXSS) recs.push("Potential XSS attempt detected");
  if (flags.suspiciousUA) recs.push("Suspicious user agent detected");
  if (flags.torExitNode) recs.push("Request originated from Tor exit node");
  return recs;
}

function logRequestDetails(data: SecureRequestLog) {
  const logEntry = {
    message: `[${data.method}] ${data.url} (${data.responseStatus})`,
    meta: {
      ip: data.ip,
      responseTime: data.responseTime,
      threatScore: calculateThreatScore(data.securityFlags),
      securityAudit: {
        threatScore: calculateThreatScore(data.securityFlags),
        recommendations: generateSecurityRecommendations(data.securityFlags),
      },
    },
  };

  if (process.env.NODE_ENV === "development") {
    const fullLogs = {
      message: "Full request details",
      meta: logEntry.meta,
    };
    logger.http(JSON.stringify(fullLogs));
  } else {
    logger.http(JSON.stringify(logEntry));
  }
}
