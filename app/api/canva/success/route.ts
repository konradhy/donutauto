import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Authorization successful!", { status: 200 });
}
