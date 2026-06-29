import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/Clients") {
    const url = request.nextUrl.clone();
    url.pathname = "/clients";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}
