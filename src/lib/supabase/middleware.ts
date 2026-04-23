import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(req: NextRequest) {
  return NextResponse.next({
    request: req,
  });
}
