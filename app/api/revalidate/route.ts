import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function POST() {
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
