import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { courseId, studyType } = await req.json();

  console.log("Received courseId:", courseId);

  if (studyType == "ALL") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));

    //GET ALL THE OTHER STUDY TYPE RECORDS
    const contentList = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE?.courseId, courseId));

    const result = {
      notes: notes,
      flashcard: contentList?.find((item) => item.type == "Flashcard"),
      quiz: contentList?.find((item) => item.type == "Quiz"),
      QuestionsAnswers: contentList?.find(
        (item) => item.type == "Question/Answer"
      ),
    };
    console.log("Content List:", contentList);

    return NextResponse.json(result);
  } else if (studyType == "notes") {
    const notes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE?.courseId, courseId));
    return NextResponse.json(notes);
  } else {
    console.log("Querying for course ID:", courseId);
    console.log("Study type received:", studyType);

    // Get all matching records first
    const allResults = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.type, studyType));

    console.log("Found matching records:", allResults.length);

    // Explicitly filter for the exact courseId match in JavaScript
    const exactMatch = allResults.find((item) => item.courseId === courseId);

    if (exactMatch) {
      console.log("Found exact match with courseId:", exactMatch.courseId);
      return NextResponse.json(exactMatch);
    }

    // If no exact matches, log this and return an appropriate response
    console.log("No exact courseId match found for:", courseId);
    return NextResponse.json({
      error: "No content found for this course and study type",
    });
  }
}
