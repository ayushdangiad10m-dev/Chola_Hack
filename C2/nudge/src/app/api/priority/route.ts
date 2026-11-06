import { NextResponse } from "next/server";
import { SEED_TASKS, SEED_USER_OPPORTUNITIES } from "@/constants/seedData";
import { calculatePriorityQueue } from "@/features/priority/engine";

export async function GET() {
  const queue = calculatePriorityQueue(SEED_TASKS, SEED_USER_OPPORTUNITIES);
  return NextResponse.json({
    queue,
    total: queue.length,
    status: "ok",
  });
}
