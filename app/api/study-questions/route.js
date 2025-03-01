import { db } from "@/configs/db";
import { QUESTIONS_ANSWERS_TABLE } from "@/configs/schema";

import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { chapters, courseId } = await req.json();

  const PROMPT = `Generate Questions and Answers for the topic: '${chapters}' in JSON format with 15 questions and answers.`;

  // Insert a record into the DB and mark it as "Generating"
  const result = await db
    .insert(QUESTIONS_ANSWERS_TABLE)
    .values({ courseId: courseId })
    .returning({ id: QUESTIONS_ANSWERS_TABLE.id });

  // Trigger the AI Ingest Function
  inngest.send({
    name: "studyType.qaContent",
    data: {
      prompt: PROMPT,
      courseId: courseId,
      recordId: result[0].id,
    },
  });

  return NextResponse.json(result[0].id);
}
