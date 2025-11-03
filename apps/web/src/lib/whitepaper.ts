import { readFile } from "fs/promises";
import { join } from "path";

interface WhitepaperSection {
  id: string;
  number: string;
  title: string;
  content?: string;
  list?: string[];
  footer?: string;
  specs?: Array<{ label: string; value: string }>;
  table?: Array<{ phase: string; description: string }>;
  type?: string;
}

export interface WhitepaperData {
  title: string;
  sections: WhitepaperSection[];
}

export async function getWhitepaper(): Promise<WhitepaperData> {
  try {
    const filePath = join(process.cwd(), "src/data/whitepaper.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading whitepaper:", error);
    throw error;
  }
}
