import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  imageUrl: varchar("imageUrl").notNull(),
  credits: integer("credits").default(10),
  isMember: boolean().default(false),
});

export const STUDY_MATERIAL_TABLE = pgTable("studyMaterial", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  status: varchar().default("Generating"),
});

export const CHAPTER_NOTES_TABLE = pgTable("chapterNotes", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: integer().notNull(),
  notes: text(),
});

export const STUDY_TYPE_CONTENT_TABLE = pgTable("studyTypeContent", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  content: json(),
  type: varchar().notNull(),
  status: varchar().default("Generating"),
});

// export const QUESTIONS_ANSWERS_TABLE = pgTable("questionsAnswers", {
//   id: serial().primaryKey(),
//   courseId: varchar().notNull(), // Links Q&A to a specific course
//   content: json().notNull(), // Stores Q&A content in JSON format
//   type: varchar().notNull().default("QA"), // Type identifier for structuring
//   status: varchar().default("Generating"), // Status: Generating or Ready
// });
