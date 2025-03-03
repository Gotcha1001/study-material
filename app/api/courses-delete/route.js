import { NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";
import { db } from "@/configs/db";

// Existing routes would be here...

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    // Validate required parameters
    if (!courseId) {
      return NextResponse.json(
        { error: "Missing required parameter: courseId" },
        { status: 400 }
      );
    }

    // First, verify the record exists
    const existingCourse = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    if (!existingCourse.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete in this order: chapter notes, study type content, then the course itself
    // This helps prevent foreign key constraint issues if they exist

    // 1. Delete chapter notes related to this course
    const deletedNotes = await db
      .delete(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId))
      .returning({ id: CHAPTER_NOTES_TABLE.id });

    // 2. Delete study type content (quiz, qa, flashcards) related to this course
    const deletedContent = await db
      .delete(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
      .returning({ id: STUDY_TYPE_CONTENT_TABLE.id });

    // 3. Finally, delete the course itself
    const deletedCourse = await db
      .delete(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))
      .returning({
        id: STUDY_MATERIAL_TABLE.id,
        courseId: STUDY_MATERIAL_TABLE.courseId,
        topic: STUDY_MATERIAL_TABLE.topic,
      });

    return NextResponse.json({
      success: true,
      message: "Course and all related content deleted successfully",
      deletedCourse: deletedCourse[0],
      summary: {
        notesDeleted: deletedNotes.length,
        contentItemsDeleted: deletedContent.length,
      },
    });
  } catch (error) {
    console.error("DELETE course error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
