import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  //Get the info from the BODY
  const { courseId, topic, courseType, difficultyLevel, createdBy } =
    await req.json();

  const PROMPT = `Generate study material for '${topic}' for '${courseType}' and the level of difficulty will be '${difficultyLevel}'. 
    The response should be in JSON format and include:
    1. "courseTitle": A clear and concise title for the course.
    2. "courseSummary": A summary of the course.
    3. "chapters": A list of chapters with:
       - "chapterTitle": Title of the chapter.
       - "emoji": A relevant emoji representing the chapter.
       - "chapterSummary": A brief summary of the chapter.
       - "topics": A list of key topics covered in the chapter.`;

  //FIRST = Generate Course Layout using AI
  const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
  // parse the string result into json
  const aiResult = JSON.parse(aiResp.response.text());

  //TWO =  Save the result along with the Users Input
  const dbResult = await db
    .insert(STUDY_MATERIAL_TABLE)
    .values({
      courseId: courseId,
      courseType: courseType,
      createdBy: createdBy,
      topic: topic,
      difficultyLevel: difficultyLevel,
      courseLayout: aiResult,
    })
    .returning({ resp: STUDY_MATERIAL_TABLE });

  console.log("dbResult[0].resp:", dbResult[0].resp); // Check what's actually in this object
  //Trigger the Inngest function to generate chapter notes
  const result = await inngest.send({
    name: "notes.generate",
    data: {
      course: dbResult[0].resp,
    },
  });
  console.log(result);

  return NextResponse.json({ result: dbResult[0] });
}
