import { db } from "@/configs/db";
import { inngest } from "./client";
import { eq } from "drizzle-orm";
import {
  CHAPTER_NOTES_TABLE,
  QUESTIONS_ANSWERS_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  USER_TABLE,
} from "@/configs/schema";
import {
  generateNotesAiModel,
  GenerateQAContentAiModel,
  GenerateQuestionsAnswersAiModel,
  GenerateQuizAiModel,
  generateStudyTypeContentAiModel,
} from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    console.log("Received event data:", JSON.stringify(event.data, null, 2));

    const result = await step.run(
      "Check User and create New User if not in DB",
      async () => {
        const userData = event.data?.user;

        // Handle case where user data is completely missing
        if (!userData) {
          console.error("No user data provided in event");
          return { error: "No user data provided in event" };
        }

        // Extract email with multiple fallbacks
        const userEmail =
          userData.primaryEmailAddress?.emailAddress || userData.email;

        if (!userEmail) {
          console.error("Missing email address in event data");
          return { error: "Missing email address in event data" };
        }

        // Check if user already exists
        const result = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, userEmail));

        if (result?.length == 0) {
          // Prepare user data with fallback values
          const userToInsert = {
            name: userData.fullName || userData.name || "New User",
            email: userEmail,
            imageUrl:
              userData.imageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent("User")}`,
            credits: 10,
            isMember: false,
          };

          console.log("Creating new user with data:", userToInsert);

          // Insert new user
          const userResp = await db
            .insert(USER_TABLE)
            .values(userToInsert)
            .returning({ id: USER_TABLE.id });

          return userResp;
        }

        return result;
      }
    );

    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async function (event) {
    // Remove step from parameters
    // Access step from the event object
    const step = event.step;

    console.log("Step object:", step);
    console.log("Step type:", typeof step);
    console.log("Step has run method:", step && typeof step.run === "function");

    console.log("Event data received⛑️📉:", event);

    const { course } = event.event.data;

    // Now use step from the event object
    const notesResult = await step.run("Generate Chapter Notes", async () => {
      const Chapters = course?.courseLayout?.chapters;
      let index = 0;

      // Use for...of for async iteration
      for (const chapter of Chapters) {
        const PROMPT =
          "Generate exam material detail content for each chapter, Make sure to include all topic points in the content, make sure to give content in HTML format(Do not Add HTML, Head, Body, title tag), Make sure the Titles are in a indigo color, The chapters : " +
          JSON.stringify(chapter);

        // Use AI model to generate notes
        const result = await generateNotesAiModel.sendMessage(PROMPT);
        const aiResp = result.response.text();

        // Insert into DB
        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: course?.courseId,
          notes: aiResp,
        });
        index = index + 1;
      }

      return "Completed";
    });

    // Update Status to 'Ready'
    const updateCourseStatusResult = await step.run(
      "Update Course Status to Ready",
      async () => {
        const result = await db
          .update(STUDY_MATERIAL_TABLE)
          .set({
            status: "Ready",
          })
          .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
        return "Success";
      }
    );

    return { notesResult, updateCourseStatusResult }; // Return both results for clarity
  }
);

export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },
  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;

    const AiResult = await step.run("Generating Content using AI", async () => {
      let result;

      try {
        // Make sure all the models are properly initialized before this function
        if (studyType === "Flashcard") {
          result = await generateStudyTypeContentAiModel.sendMessage(prompt);
        } else if (studyType === "Quiz") {
          result = await GenerateQuizAiModel.sendMessage(prompt);
        } else if (
          studyType === "QuestionsAnswers" ||
          studyType === "Question/Answer"
        ) {
          // Use the new model for Q&A generation
          result = await GenerateQuestionsAnswersAiModel.sendMessage(prompt);
        } else {
          // Default case to avoid undefined result
          throw new Error(`Unknown study type: ${studyType}`);
        }

        // Ensure result is defined before accessing its properties
        if (!result || !result.response) {
          throw new Error("AI model returned an invalid response");
        }

        const AIResult = JSON.parse(result.response.text());
        return AIResult;
      } catch (error) {
        console.error("Error generating content:", error);

        // Return a fallback response to prevent the function from failing completely
        return {
          error: true,
          message: `Failed to generate ${studyType} content: ${error.message}`,
          // Provide a minimal valid structure based on the study type
          ...(studyType === "Flashcard"
            ? { content: [] }
            : studyType === "Quiz"
            ? { questions: [] }
            : { questionsAnswers: [] }),
        };
      }
    });

    // Save the Result (even if it's an error response)
    const DbResult = await step.run("Save Result to DB", async () => {
      const result = await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          content: AiResult,
          status: AiResult.error ? "Error" : "Ready",
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

      return "Data Inserted";
    });

    return { AiResult, DbResult };
  }
);
