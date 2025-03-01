import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const userData = await req.json();

    // Validate that we have user data
    if (!userData || !userData.email) {
      console.error("Missing required user data:", userData);
      return NextResponse.json(
        { error: "Missing required user data" },
        { status: 400 }
      );
    }

    // Send the correct structure to Inngest
    const result = await inngest.send({
      name: "user.create",
      data: {
        user: {
          fullName: userData.name,
          email: userData.email,
          primaryEmailAddress: { emailAddress: userData.email },
          imageUrl: userData.imageUrl,
        },
      },
    });

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("Error in create-user API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
