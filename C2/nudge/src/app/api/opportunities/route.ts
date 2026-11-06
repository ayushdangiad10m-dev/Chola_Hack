import { NextResponse } from "next/server";
import { SEED_OPPORTUNITIES } from "@/constants/seedData";

export async function GET() {
  return NextResponse.json({
    opportunities: SEED_OPPORTUNITIES,
    total: SEED_OPPORTUNITIES.length,
    status: "ok",
  });
}
