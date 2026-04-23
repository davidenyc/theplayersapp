import { NextResponse } from "next/server";

import { getRoster } from "@/lib/mock/selectors";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: getRoster() });
}
