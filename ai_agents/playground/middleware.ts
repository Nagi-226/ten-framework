import { type NextRequest, NextResponse } from "next/server";

const { NEXT_PUBLIC_AGENT_SERVER_URL, NEXT_PUBLIC_TEN_DEV_SERVER_URL } = process.env;

const AGENT_SERVER_URL = NEXT_PUBLIC_AGENT_SERVER_URL || process.env.AGENT_SERVER_URL || "http://localhost:8080";
const TEN_DEV_SERVER_URL = NEXT_PUBLIC_TEN_DEV_SERVER_URL || process.env.TEN_DEV_SERVER_URL || "http://localhost:49483";

console.log("[Middleware] AGENT_SERVER_URL:", AGENT_SERVER_URL);
console.log("[Middleware] TEN_DEV_SERVER_URL:", TEN_DEV_SERVER_URL);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  if (pathname.startsWith(`/api/agents/`)) {
    // Proxy all agents API requests
    url.href = `${AGENT_SERVER_URL}${pathname.replace("/api/agents/", "/")}`;
    console.log(`[Middleware] Rewriting /api/agents/ to ${url.href}`);

    return NextResponse.rewrite(url);
  } else if (pathname.startsWith(`/api/vector/`)) {
    // Proxy all documents requests
    url.href = `${AGENT_SERVER_URL}${pathname.replace("/api/vector/", "/vector/")}`;
    console.log(`[Middleware] Rewriting /api/vector/ to ${url.href}`);

    return NextResponse.rewrite(url);
  } else if (pathname.startsWith(`/api/token/`)) {
    // Proxy all token requests
    url.href = `${AGENT_SERVER_URL}${pathname.replace("/api/token/", "/token/")}`;
    console.log(`[Middleware] Rewriting /api/token/ to ${url.href}`);

    return NextResponse.rewrite(url);
  } else if (pathname.startsWith("/api/dev/")) {
    if (pathname.startsWith("/api/dev/v1/addons/default-properties")) {
      url.href = `${AGENT_SERVER_URL}/dev-tmp/addons/default-properties`;
      console.log(`[Middleware] Rewriting to ${url.href}`);
      return NextResponse.rewrite(url);
    }

    url.href = `${TEN_DEV_SERVER_URL}${pathname.replace("/api/dev/", "/api/designer/")}`;
    console.log(`[Middleware] Rewriting /api/dev/ to ${url.href}`);

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
