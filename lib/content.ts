// Data-access layer. Pages only import from here.
// Week 1–3: static data. Week 4: the function bodies switch to Prisma; signatures stay.

export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  /** The real-world problem, told from the user's side. */
  problem: string;
  /** What the project does about it. */
  solution: string;
  role: string;
  techStack: string[];
  highlights: string[];
  metrics: Metric[];
  challenges: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
};

export const site = {
  name: "Muhammad Usman",
  title: "AI Engineer",
  pitch:
    "I build AI products that remove real friction: live speech translation for meetings, and an assistant that turns a job hunt from hours of tab-switching into a ranked shortlist.",
  location: "Faisalabad, Pakistan",
  email: "usmanbusiness7576@gmail.com",
  github: "https://github.com/Usman7576",
  linkedin: "https://www.linkedin.com/in/usman-ai-enthusiast",
};

const projects: Project[] = [
  {
    slug: "intellimeet",
    title: "IntelliMeet",
    tagline: "Video meetings where every listener hears the speaker in their own language.",
    problem:
      "In Pakistani classrooms, companies and cross-border teams, one person speaks Urdu and another only follows English. Today that means hiring an interpreter, repeating everything twice, or someone quietly missing half the meeting. Existing tools offer captions at best, which force people to read instead of listen and still leave Urdu poorly supported.",
    solution:
      "IntelliMeet is a browser-based meeting platform with a server-side translation agent. Each participant picks the language they speak and the language they want to hear; the agent recognises each speaker once, translates into only the languages listeners actually asked for, and publishes synthesised speech as a separate audio track. A listener's client swaps the speaker's raw voice for the translated one, so people who don't need translation are unaffected.",
    role: "Final Year Project, team of 3. I built the frontend and backend (auth, meeting lifecycle, LiveKit integration, host controls) and the real-time speech translation pipeline.",
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "LiveKit",
      "Azure AI Speech",
      "Socket.IO",
    ],
    highlights: [
      "Speech-to-speech translation: Azure speech recognition → translation → neural TTS, delivered as live LiveKit audio tracks",
      "One recogniser per speaker, translating only into languages someone is listening in, so cost scales with real demand",
      "LiveKit SFU media: each participant uploads once, regardless of meeting size",
      "Server-enforced host controls: mute, remove, block from rejoining, end for everyone",
      "Short-lived, room-scoped join tokens with no admin rights, so a leaked token can't kick or mute anyone",
    ],
    metrics: [
      { label: "English → Urdu, speaker stops → listener hears", value: "1.8 s" },
      { label: "Urdu → English", value: "2.3 s" },
      { label: "Latency target from the requirements", value: "≤ 3 s" },
      { label: "Backend tests", value: "99" },
    ],
    challenges: [
      "First translated audio took 4.7 s. Switching to streaming synthesis and pre-opened connections cut it to 0.3–1.0 s.",
      "Azure stalled for 20–28 s when a speaker went quiet; a silence pump keeps the stream fed and removed the stall.",
      "Azure rejects the ur-PK locale for recognition; ur-IN recognises Pakistani Urdu correctly, with the ur-PK voice kept for output.",
      "Latency was measured with synthesised voices on one machine. Real microphones and networks still need testing.",
    ],
    githubUrl: "https://github.com/Usman7576/IntelliMeet",
    featured: true,
    order: 1,
  },
  {
    slug: "jobpilot",
    title: "JobPilot",
    tagline:
      "Upload a resume, get a ranked shortlist of jobs and honest, ready-to-review applications.",
    problem:
      "A fresh graduate looking for a job or internship spends hours a day opening the same boards, scrolling past duplicates and roles they don't qualify for, then rewriting a cover letter for each one. AI writing tools speed up the letters but invent skills and numbers the candidate doesn't have, which gets caught in interviews. And after twenty applications, nobody remembers who replied.",
    solution:
      "JobPilot reads the resume once and does the searching, sorting and drafting. It pulls fresh listings from several free job APIs, merges duplicates, ranks them by similarity to the resume, and has an LLM score the best matches with plain-language reasons and red flags. Emails and cover letters are written only from a fact sheet extracted from the resume, and any claim that isn't on it gets flagged. Nothing is sent without the user's click.",
    role: "Solo project: design, backend, frontend, deployment.",
    techStack: [
      "Python",
      "FastAPI",
      "Celery",
      "Redis",
      "PostgreSQL",
      "pgvector",
      "Next.js",
      "Gemini",
      "Groq",
    ],
    highlights: [
      "Searches Arbeitnow, Remotive, Jooble, Adzuna and SerpAPI by title and location, with duplicates merged and internships labelled paid or unpaid",
      "Two-stage matching: local embeddings rank everything, then an LLM scores the top 15 on skills, experience, seniority, domain and location",
      "Fact-grounded drafting: every number, skill or degree in a generated email is checked against the resume and flagged if unsupported",
      "Safe sending from the user's own Gmail: final preview, daily cap and a cancellable 30–120 s delay",
      "Kanban tracker from Saved to Offer, follow-up reminders, Gmail reply detection and a daily digest of new strong matches",
    ],
    metrics: [
      { label: "Job sources searched at once", value: "5" },
      { label: "Best matches AI-scored with reasons", value: "Top 15" },
      { label: "Emails sent without the user's click", value: "0" },
      { label: "Test coverage enforced in CI", value: "80%+" },
    ],
    challenges: [
      "LLMs inflate resumes. Drafting from a fact sheet plus a checker that flags unsupported claims keeps letters honest.",
      "Scoring every listing with an LLM blows the free tier, so cheap local embeddings filter first and only the top 15 reach the LLM.",
      "Resumes and OAuth tokens are sensitive: files and tokens are encrypted at rest, and logs never contain resume text.",
    ],
    githubUrl: "https://github.com/Usman7576/JobPilot",
    featured: true,
    order: 2,
  },
];

export async function getProjects(): Promise<Project[]> {
  return [...projects].sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return projects.find((p) => p.slug === slug);
}
