import { readFile } from "fs/promises";
import { join } from "path";

interface CodeBlock {
  language: string;
  content: string;
}

interface TableRow {
  [key: string]: string;
}

interface SpecsSection {
  id: string;
  number: string;
  title: string;
  content?: string;
  code?: CodeBlock;
  code2?: CodeBlock;
  list?: string[];
  footer?: string;
  conclusion?: string;
  table?: TableRow[];
}

export interface SpecsData {
  title: string;
  sections: SpecsSection[];
}

export async function getSpecs(): Promise<SpecsData> {
  try {
    const filePath = join(process.cwd(), "src/data/specs.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading specs:", error);
    throw error;
  }
}
