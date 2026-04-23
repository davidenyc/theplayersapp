import { NextResponse } from "next/server";

import { highlights } from "@/lib/mock/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: highlights });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, data: body }, { status: 201 });
}
