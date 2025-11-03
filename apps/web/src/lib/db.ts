import { readFile } from "fs/promises";
import { join } from "path";

interface Button {
  label: string;
  url: string;
  variant?: string;
}

interface Hero {
  title: string;
  subtitle: string;
  buttons: Button[];
}

interface Vision {
  title: string;
  text: string;
}

interface WhyItMattersItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface WhyItMatters {
  title: string;
  items: WhyItMattersItem[];
}

interface Governance {
  title: string;
  text: string;
  button: Button;
}

interface Overview {
  title: string;
  text: string;
  specs: string[];
  button: Button;
}

interface RoadmapPhase {
  version: string;
  description: string;
}

interface Roadmap {
  title: string;
  phases: RoadmapPhase[];
}

interface Link {
  label: string;
  url: string;
}

interface Footer {
  text: string;
  subtext: string;
  links: Link[];
}

export interface ContentData {
  hero: Hero;
  vision: Vision;
  whyItMatters: WhyItMatters;
  governance: Governance;
  overview: Overview;
  roadmap: Roadmap;
  footer: Footer;
}

export async function getContent(): Promise<ContentData> {
  try {
    const filePath = join(process.cwd(), "src/data/content.json");
    const fileContents = await readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading content:", error);
    throw error;
  }
}
