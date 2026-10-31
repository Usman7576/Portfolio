// Static profile content. Safe to import from client components.

export const site = {
  name: "Muhammad Usman",
  title: "AI Engineer",
  pitch:
    "I build AI products that remove real friction: live speech translation for meetings, and an assistant that turns a job hunt from hours of tab-switching into a ranked shortlist.",
  location: "Faisalabad, Pakistan",
  email: "usmanbusiness7576@gmail.com",
  github: "https://github.com/Usman7576",
  linkedin: "https://www.linkedin.com/in/usman-ai-enthusiast",
  /** Path under /public. Null until an up-to-date PDF is added; /resume then shows the HTML version only. */
  resumePdf: null as string | null,
};

export const about = {
  short:
    "Final-semester Software Engineering student at FAST-NUCES. I work across the stack, from real-time media and APIs to LLM pipelines, and I start every project from a specific person and the problem slowing them down.",
  story: [
    "I'm a final-semester Software Engineering student at FAST-NUCES (Chiniot-Faisalabad campus). Most of what I know about engineering I learned by shipping things that had to work for someone other than me.",
    "My final year project, IntelliMeet, began with a simple observation: in a lot of Pakistani meetings one person thinks in Urdu and another follows English best, and someone always ends up lost. With a team of three we built a video meeting platform, and I worked on the translation pipeline that lets each listener hear the speaker in their own language, in under three seconds.",
    "JobPilot came from my own job search. Opening the same boards every day, skipping duplicates and rewriting cover letters took hours, and AI writing tools made it worse by inventing skills I don't have. So I built an assistant that does the searching and ranking, and only writes what the resume can back up.",
    "Alongside these I build AI-agent workflows with n8n, LangChain and LangGraph. I'm looking for an AI engineering role or internship where I can keep building tools people actually use.",
  ],
};

export type SkillGroup = { category: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    category: "AI and LLMs",
    skills: [
      "Gemini",
      "Groq",
      "LangChain",
      "LangGraph",
      "RAG with pgvector",
      "Azure AI Speech",
      "n8n agents",
    ],
  },
  {
    category: "Backend",
    skills: ["Python", "FastAPI", "Celery", "Node.js", "Express", "REST APIs", "WebSockets"],
  },
  {
    category: "Frontend",
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Data and real-time",
    skills: ["PostgreSQL", "MongoDB", "Redis", "LiveKit", "WebRTC", "Socket.IO"],
  },
  {
    category: "Tools",
    skills: ["Git", "GitHub Actions", "BeautifulSoup", "Web scraping"],
  },
];

export type TimelineEntry = { title: string; org: string; when: string; description: string };

export const timeline: TimelineEntry[] = [
  {
    title: "BS Software Engineering",
    org: "FAST-NUCES, Chiniot-Faisalabad",
    when: "Final semester",
    description:
      "Final year project: IntelliMeet, multilingual video conferencing with live speech translation.",
  },
  {
    title: "IntelliMeet (Final Year Project)",
    org: "Team of 3",
    when: "FYP",
    description:
      "Built the frontend and backend, LiveKit media, host controls and the speech-to-speech translation pipeline.",
  },
  {
    title: "JobPilot",
    org: "Solo project",
    when: "Personal",
    description: "Resume-driven job search, LLM match scoring and fact-checked application drafts.",
  },
  {
    title: "Head of Logistics",
    org: "YPDC Society",
    when: "Leadership",
    description: "Led logistics planning and coordination for society events.",
  },
  {
    title: "Member",
    org: "Software Engineering Society and Sukhan Society, FAST-NUCES",
    when: "Societies",
    description: "Technical events, plus literary and cultural activities.",
  },
];
