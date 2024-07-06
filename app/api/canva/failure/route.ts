import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error") || "Unknown error";
  return new NextResponse(`Authorization failed: ${error}`, { status: 400 });
}
