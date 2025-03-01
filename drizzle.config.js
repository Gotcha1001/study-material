import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://jollysidecoder:2m9uIHTnLxzq@ep-late-voice-a5hdao7i-pooler.us-east-2.aws.neon.tech/AI-STUDY-GENERATOR?sslmode=require",
  },
});
