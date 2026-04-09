import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getOpsSessionValue, OPS_COOKIE_NAME } from "@/lib/server/ops-auth";

function isProtectedOpsPath(pathname: string) {
  return pathname === "/ops" || pathname.startsWith("/ops/");
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/internal/")) {
    const expectedToken = process.env.DELIVERY_QUEUE_TOKEN;

    if (!expectedToken) {
      return NextResponse.next();
    }

    const providedToken = request.headers.get("x-delivery-token");

    if (providedToken !== expectedToken) {
      return NextResponse.json(
        { message: "Unauthorized internal request." },
        { status: 401 },
      );
    }

    return NextResponse.next();
  }

  if (isProtectedOpsPath(pathname)) {
    const expectedToken = process.env.OPS_DASHBOARD_TOKEN;

    if (!expectedToken) {
      return NextResponse.next();
    }

    const cookieValue = request.cookies.get(OPS_COOKIE_NAME)?.value;
    const expectedSession = await getOpsSessionValue(expectedToken);

    if (cookieValue !== expectedSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/ops/login";
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops/:path*", "/api/internal/:path*"],
};