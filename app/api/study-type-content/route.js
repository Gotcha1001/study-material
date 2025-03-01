import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { chapters, courseId, type } = await req.json();

  let PROMPT;

  if (type === "Flashcard") {
    PROMPT = `Generate the flashcard on topic: '${chapters}' in JSON format with front back content maximum 15, IGNORE THE FLUTTER EXAMPLE, generate the content based on the topic`;
  } else if (type === "Quiz") {
    PROMPT = `Generate Quiz on topic: '${chapters}' with Question and Options along with correct answers in JSON format, (Max 10), IGNORE THE FLUTTER EXAMPLE, generate the content based on the topic `;
  } else if (type === "Question/Answer" || type === "QuestionsAnswers") {
    PROMPT = `Generate questions and answers for the topic: ${chapters} in JSON format with Questions and Answers, content maximum 15 Questions and Answers, IGNORE THE FLUTTER EXAMPLE, generate the content based on the topic `;
  }

  //INSERT RECORD TO DB, UPDATE THE STATUS TO GENERATING
  const result = await db
    .insert(STUDY_TYPE_CONTENT_TABLE)
    .values({
      courseId: courseId,
      type: type,
    })
    .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

  //TRIGGER INNJEST function
  inngest.send({
    name: "studyType.content",
    data: {
      studyType: type,
      prompt: PROMPT,
      courseId: courseId,
      recordId: result[0].id,
    },
  });

  return NextResponse.json(result[0].id);
}
