import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  STUDY_MATERIAL_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // First, check if this is a new course
    const courseResult = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    const courseStatus =
      courseResult && courseResult.length > 0
        ? courseResult[0].status
        : "Generating";

    // Check if any content exists for this course other than notes
    const contentExists = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    // For new courses with only notes and no other content yet,
    // we'll force the progress to reflect initial state
    const isNewCourse =
      courseStatus === "Generating" || contentExists.length === 0;

    if (isNewCourse) {
      console.log("New course detected, setting initial progress state");
      // For a new course, only notes should be Ready, everything else Pending
      return NextResponse.json({
        status: {
          notes: "Ready",
          quiz: "Pending",
          qa: "Pending",
          flashcard: "Pending",
        },
        isNewCourse: true,
      });
    }

    // For existing courses, check actual status
    // Initialize status object
    const status = {
      notes: "Pending",
      quiz: "Pending",
      qa: "Pending",
      flashcard: "Pending",
    };

    // Check notes status
    const notesResult = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    if (notesResult && notesResult.length > 0) {
      status.notes = "Ready";
    }

    // Check quiz status
    const quizResult = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
      .where(eq(STUDY_TYPE_CONTENT_TABLE.type, "Quiz"));

    if (
      quizResult &&
      quizResult.length > 0 &&
      quizResult[0].status === "Ready"
    ) {
      status.quiz = "Ready";
    }

    // Check Q&A status
    const qaResult = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
      .where(eq(STUDY_TYPE_CONTENT_TABLE.type, "Question/Answer"));

    if (qaResult && qaResult.length > 0 && qaResult[0].status === "Ready") {
      status.qa = "Ready";
    }

    // Check flashcard status
    const flashcardResult = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
      .where(eq(STUDY_TYPE_CONTENT_TABLE.type, "Flashcard"));

    if (
      flashcardResult &&
      flashcardResult.length > 0 &&
      flashcardResult[0].status === "Ready"
    ) {
      status.flashcard = "Ready";
    }

    console.log("Material status:", status);
    return NextResponse.json({ status, isNewCourse: false });
  } catch (error) {
    console.error("Error checking progress:", error);
    return NextResponse.json(
      { error: "Failed to check progress" },
      { status: 500 }
    );
  }
}
