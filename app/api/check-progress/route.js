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
        readyCount: 1,
        totalPossible: 4,
      });
    }

    // For existing courses, check actual status
    // Initialize status object with all items as "NotCreated" by default
    const status = {
      notes: "NotCreated",
      quiz: "NotCreated",
      qa: "NotCreated",
      flashcard: "NotCreated",
    };

    // Check notes status
    const notesResult = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

    if (notesResult && notesResult.length > 0) {
      status.notes = "Ready";
    }

    // FIX: Get ALL content records for this course to count correctly
    const allContentRecords = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));

    console.log(
      `Found ${allContentRecords.length} content records for course ${courseId}`
    );

    // Check each study type individually
    for (const record of allContentRecords) {
      const type = record.type;
      const recordStatus = record.status;

      console.log(`Found record of type ${type} with status ${recordStatus}`);

      // Map the database type to our status object property
      if (type === "Quiz") {
        status.quiz = recordStatus;
      } else if (type === "Question/Answer") {
        status.qa = recordStatus;
      } else if (type === "Flashcard") {
        status.flashcard = recordStatus;
      }
    }

    // Calculate ready count - ONLY count 'Ready' status items
    const readyCount = Object.values(status).filter(
      (val) => val === "Ready"
    ).length;

    // Count items that exist (not "NotCreated")
    const existingItems = Object.values(status).filter(
      (val) => val !== "NotCreated"
    ).length;

    console.log("Material status:", status);
    console.log(`Ready count: ${readyCount} / 4`);
    console.log(`Existing items: ${existingItems}`);

    return NextResponse.json({
      status,
      isNewCourse: false,
      readyCount,
      totalPossible: 4,
      existingItemsCount: existingItems, // Add this to track existing items
    });
  } catch (error) {
    console.error("Error checking progress:", error);
    return NextResponse.json(
      { error: "Failed to check progress" },
      { status: 500 }
    );
  }
}
