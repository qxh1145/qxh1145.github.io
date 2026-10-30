// Default content for <FolderTabPortfolio />. Every export here is a prop default.

// Profile scalars.
export const profile = {
  name: "Quan Tran",
  localName: "Trần Anh Quân",
  handle: "@quntrn05",
  email: "trananhquan1104.work@gmail.com",
  role: "Fullstack Developer",
  years: "2025–2026",
  disciplines: ["Web apps", "Mobile", "Backend"],
  word: "Portfolio",
  tag: "#2026",
  subtitle: ["Hồ sơ", "lập trình"],
  notes: ["Tư duy sản phẩm", "Code sạch", "Học mỗi ngày"],
  blurb:
    "Final-year Software Engineering student at FPT University with 9 months at FPT Software. I have shipped 2 full-stack products, including a funded startup platform and a subscription service with payments, and I use AI to review code and build faster.",
  greeting: "Hi, I am",
  timeZone: "Asia/Ho_Chi_Minh",
  location: "Da Nang",
};

// Vietnamese labels shown next to section headings.
export const sectionLabels = {
  contents: "(Mục lục)",
  work: "Dự án",
  process: "Quy trình",
  words: "Nhận xét",
  contact: "Liên hệ",
};

// Contact-section availability note; `year` is the last year of `profile.years`.
export const availability = () =>
  "Open to fresher full-stack roles and freelance projects. Questions, ideas and coffee invitations all welcome.";

// kind picks the generated cover art: "page" | "render" | "poster" | "brand" | "sale"
export const categories = [
  { id: "fullstack", label: "Full-stack", local: "Sản phẩm", tone: "blue", kind: "page" },
  { id: "web", label: "Web apps", local: "Ứng dụng web", tone: "orange", kind: "brand" },
  { id: "automation", label: "Automation", local: "Tự động hoá", tone: "green", kind: "poster" },
];

// href (optional) adds a "Visit" button to the project's details view.
export const projects = [
  {
    title: "RESCOM survey exchange platform",
    local: "Nền tảng trao đổi khảo sát",
    category: "fullstack",
    year: "2026",
    client: "Own startup",
    role: "Sole developer",
    tools: ["Next.js", "NestJS", "PostgreSQL"],
    mark: "RES",
    summary:
      "Students earn points by answering research surveys and spend them to collect responses for their own.",
    href: "https://rescom.io.vn",
    body: [
      "Built the full stack alone: a 27-model PostgreSQL schema and 16 REST endpoints for authentication, Google OAuth, single-session enforcement, RBAC and admin user management.",
      "A points ledger that stays correct under concurrent requests, indexed queries with cursor-based pagination checked with EXPLAIN ANALYZE, and a CI/CD deploy to a VPS validated by 225 automated checks.",
      "Won the FPT University Startup Scholarship: 1 of 3 funded projects from 100 applicants.",
    ],
  },
  {
    title: "FUExams online exam platform",
    local: "Nền tảng thi trắc nghiệm",
    category: "fullstack",
    year: "2026",
    client: "Personal project",
    role: "Solo developer",
    tools: ["React", "Express.js", "MongoDB"],
    mark: "EXAM",
    summary: "Timed multiple-choice exams with paid subscription plans and an AI tutor.",
    href: "https://fuexams.vercel.app",
    body: [
      "Built and deployed alone: a dynamic question builder, 20+ REST endpoints over 6 MongoDB models, JWT authentication, single-session enforcement and RBAC for basic, premium and admin users.",
      "PayOS payments for 3 subscription plans, with webhooks that update order status and upgrade user roles automatically, plus a Google Gemini tutor that explains IT exam answers and keeps per-user chat history.",
    ],
  },
  {
    title: "Thanh Cong Energy corporate website",
    local: "Website doanh nghiệp",
    category: "web",
    year: "2026",
    client: "Thanh Cong Energy",
    role: "Full-stack developer (freelance)",
    tools: ["MongoDB", "Express.js", "React", "Node.js"],
    mark: "TCE",
    summary: "A MERN corporate website with public pages, REST APIs, SEO and an admin for posts.",
    body: [
      "Built in a 3-person team. I made the admin post module (create, edit, publish), so the client updates website content without a developer.",
      "Broke client requirements into prioritized tasks with acceptance criteria and tracked milestone risks, helping recover a project that was about a month behind schedule.",
    ],
  },
  {
    title: "Recruitment platform job-posting flow",
    local: "Nền tảng tuyển dụng",
    category: "web",
    year: "2026",
    client: "FPT Software",
    role: "Associate Software Engineer",
    tools: ["Angular"],
    mark: "JOBS",
    summary: "Rebuilt 4 responsive Angular screens in an internal recruitment platform.",
    body: [
      "Migrated the legacy interface into reusable components and fixed form validation across mobile, tablet and desktop.",
    ],
  },
  {
    title: "Warehouse legacy-to-cloud migration",
    local: "Tự động hoá kho hàng",
    category: "automation",
    year: "2026",
    client: "Japanese client, FPT Software",
    role: "Associate Software Engineer",
    tools: ["UiPath", "Excel"],
    mark: "RPA",
    summary: "Built 2 of the 9 core UiPath workflows for a warehouse system moving to the cloud.",
    body: [
      "Automated order import and export, invalid-order detection and Excel-based inventory handling.",
      "Created and ran 30+ unit test cases across all 9 workflows, covering standard and exception paths before release.",
    ],
  },
];

export const highlights = [
  {
    label: "Fullstack developer",
    tone: "green",
    lines: ["Shipped 2 full-stack products", "Next.js, NestJS & PostgreSQL", "MERN, payments & OAuth"],
  },
  {
    label: "9 months at FPT Software",
    tone: "blue",
    lines: ["Associate Software Engineer", "Angular & UiPath projects", "30+ unit test cases written"],
  },
  {
    label: "Startup scholarship",
    tone: "green",
    lines: ["RESCOM: 1 of 3 funded of 100", "GPA 3.5/4.0, FPT University", "TOEIC 915/990"],
  },
];

export const timeline = [
  { from: "2025.12", to: "2026.08", title: "Associate Software Engineer", place: "FPT Software" },
  { from: "2026.08", to: "2026.10", title: "Full-stack Developer (Freelance)", place: "Thanh Cong Energy" },
];

export const chapters = [
  { title: "Self-introduction", local: "Giới thiệu", points: ["Skills", "Experience", "Education", "Awards"], target: "about" },
  { title: "Selected projects", local: "Dự án", points: ["Full-stack", "Web apps", "Automation"], target: "work" },
  { title: "Working process", local: "Quy trình", points: ["Understand", "Plan", "Build", "Ship"], target: "process" },
  { title: "Future planning", local: "Định hướng", points: ["What I'm looking for", "How to reach me"], target: "contact" },
];

export const steps = [
  {
    title: "Understand",
    local: "Tìm hiểu",
    duration: "Day 1–2",
    body: "I start with the user, not the ticket: who reaches this screen, what they already tried, and the one job the feature has to do well.",
    outputs: ["User stories", "Code audit", "Acceptance criteria"],
  },
  {
    title: "Plan",
    local: "Lên kế hoạch",
    duration: "Day 3",
    body: "The job becomes a small technical plan: data model, API shape and the riskiest part first. Nothing gets coded until the trade-offs are written down.",
    outputs: ["Data model", "API contract", "Task breakdown"],
  },
  {
    title: "Build",
    local: "Xây dựng",
    duration: "Day 4–8",
    body: "Types and tests first, UI second, polish last. I build the hardest path first, because if that one works the easy ones usually do.",
    outputs: ["Feature branch", "Unit & e2e tests", "Code review"],
  },
  {
    title: "Ship",
    local: "Triển khai",
    duration: "Day 9–10",
    body: "CI/CD, documented APIs and automated checks before every release. I hand over code a teammate can change without calling me.",
    outputs: ["CI/CD pipeline", "API docs", "Release checks"],
  },
];

// Testimonials. Empty hides the "Words" section; add { quote, name, role, tone } entries to show it.
export const words = [];

export const contacts = [
  { label: "GitHub", value: "github.com/qxh1145", href: "https://github.com/qxh1145" },
  { label: "RESCOM", value: "rescom.io.vn", href: "https://rescom.io.vn" },
  { label: "FUExams", value: "fuexams.vercel.app", href: "https://fuexams.vercel.app" },
];
