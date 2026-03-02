import { NextResponse } from "next/server";
import crypto from "crypto";

export function middleware(req) {
  // 🔐 Generate a random nonce for scripts
  const nonce = crypto.randomBytes(16).toString("base64");

  // 🛡️ CSP header
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    img-src 'self' data: blob: https://northernpatches.com https://www.northernpatches.com;
    connect-src 'self' https://northernpatches.com https://www.northernpatches.com ws: wss:;
    media-src 'self' blob: data: https://northernpatches.com https://www.northernpatches.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
  `.replace(/\n/g, " ").trim();

  // Add nonce to headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: "/:path*",
};
