import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json();

  // Fetch user credits
  const userResult = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, email));

  if (userResult.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let remainingCredits = userResult[0].credits;

  // Deduct one credit if the user has enough credits
  if (remainingCredits > 0) {
    remainingCredits -= 1;
    await db
      .update(USER_TABLE)
      .set({ credits: remainingCredits })
      .where(eq(USER_TABLE.email, email));
  }

  return NextResponse.json({ remainingCredits });
}
