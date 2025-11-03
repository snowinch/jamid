import { readFile } from "fs/promises";
import { join } from "path";

interface Question {
  id: string;
  number: string;
  title: string;
  question: string;
  whyItMatters?: string;
  section?: string;
  points?: string[];
}

interface Contribute {
  title: string;
  intro: string;
  ways: string[];
  cta: {
    text: string;
    button: {
      label: string;
      url: string;
    };
  };
}

export interface OpenQuestionsData {
  title: string;
  subtitle: string;
  intro: string;
  questions: Question[];
  contribute: Contribute;
}

export async function getOpenQuestions(): Promise<OpenQuestionsData> {
  try {
    const filePath = join(process.cwd(), "src/data/open-questions.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading open questions:", error);
    throw error;
  }
}
