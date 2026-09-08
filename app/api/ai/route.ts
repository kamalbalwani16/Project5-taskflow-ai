import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
];

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tasks } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "Tasks are required." },
        { status: 400 }
      );
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Please add at least one task." },
        { status: 400 }
      );
    }

    const taskSummary = tasks
      .map(
        (task: {
          title: string;
          description?: string | null;
          status: string;
          priority: string;
          dueDate?: string | null;
        }) =>
          "Title: " +
          task.title +
          "\nDescription: " +
          (task.description || "None") +
          "\nStatus: " +
          task.status +
          "\nPriority: " +
          task.priority +
          "\nDue Date: " +
          (task.dueDate || "No due date") +
          "\n"
      )
      .join("\n");

    const prompt =
      "You are an AI productivity assistant for a task management application called TaskFlow AI.\n\n" +
      "Analyze the following tasks and give useful productivity advice.\n\n" +
      "TASKS:\n" +
      taskSummary +
      "\n" +
      "Return the response in this exact structure:\n\n" +
      "1. Priority Recommendation\n" +
      "Identify the most important tasks and briefly explain why.\n\n" +
      "2. Productivity Summary\n" +
      "Give a short summary of the current workload.\n\n" +
      "3. Suggested Plan\n" +
      "Give an ordered plan for completing the tasks.\n\n" +
      "4. Productivity Tips\n" +
      "Give 2-3 practical productivity tips based on these tasks.\n\n" +
      "Keep the answer concise, clear, and practical.";

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    let lastError: unknown = null;

    for (const modelName of GEMINI_MODELS) {
      try {
        console.log("Trying Gemini model:", modelName);

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log("Gemini model succeeded:", modelName);

        return NextResponse.json({
          result: text,
          model: modelName,
        });
      } catch (error) {
        lastError = error;

        console.error(
          "Gemini model failed:",
          modelName,
          error
        );

        console.log(
          "Switching to next Gemini fallback model..."
        );
      }
    }

    console.error(
      "All Gemini fallback models failed:",
      lastError
    );

    return NextResponse.json(
      {
        error:
          "All Gemini AI models are currently unavailable. Please try again later.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("AI analysis failed:", error);

    return NextResponse.json(
      { error: "Failed to generate AI analysis." },
      { status: 500 }
    );
  }
}