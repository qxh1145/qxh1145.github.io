// Default content for <FolderTabPortfolio />, in English and Vietnamese.
// A value written as t(en, vi) follows the language switch; any other value is shared by both.
import portrait from "./assets/portrait.webp";
import rescomShot from "./assets/shots/rescom.webp";
import fuexamsShot from "./assets/shots/fuexams.webp";

const t = (en, vi) => ({ en, vi });

// Resolves every t(en, vi) value in a content tree to one language.
export function localize(value, lang) {
  if (Array.isArray(value)) return value.map((item) => localize(item, lang));
  if (value === null || typeof value !== "object") return value;
  const keys = Object.keys(value);
  // A missing translation shows the English text.
  if (keys.length === 2 && "en" in value && "vi" in value) return value[lang] ?? value.en;
  return Object.fromEntries(keys.map((key) => [key, localize(value[key], lang)]));
}

const profile = {
  name: "Tran Anh Quan",
  // Given name: drives the hand-drawn signature and the "#QUAN" tag in About.
  shortName: "Quan",
  localName: "Trần Anh Quân",
  // 5:6 portrait for the About photo frame; leave it out to get the drawn illustration.
  photo: portrait,
  email: "trananhquan1104.work@gmail.com",
  role: t("Full-stack Developer", "Lập trình viên full-stack"),
  years: "2025–2026",
  disciplines: t(["Web apps", "Backend", "Automation"], ["Ứng dụng web", "Backend", "Tự động hoá"]),
  word: "Portfolio",
  tag: "#2026",
  subtitle: t(["Code", "portfolio"], ["Hồ sơ", "lập trình"]),
  notes: t(
    ["Understand", "Build", "Measure"],
    ["Hiểu vấn đề", "Xây giải pháp", "Đo kết quả"],
  ),
  // Cover: the facts a recruiter should take away in one read.
  lead: t(
    "Final-year Software Engineering student at FPT University with experience at FPT Software. I have shipped 2 full-stack products, including a funded startup platform and a subscription service with payments, and I use AI to review code and build faster.",
    "Sinh viên năm cuối ngành Kỹ thuật phần mềm tại Đại học FPT, có kinh nghiệm làm việc tại FPT Software. Tôi đã đưa 2 sản phẩm full-stack vào vận hành, gồm một dự án khởi nghiệp được tài trợ và một dịch vụ có gói trả phí. Tôi dùng AI để review code và phát triển nhanh hơn.",
  ),
  // About: the owner's own words in both languages.
  blurb: t(
    "I start with the people who will use the software and work back to the technology. For me, design is about how a product behaves as much as how it looks, and the simplest version is usually the best one. I want to build software people can use without having to think about it.",
    "Tôi là developer, và khi làm phần mềm, tôi nghĩ đến trải nghiệm của người dùng trước rồi mới tính tới công nghệ. Với tôi, thiết kế gồm cả cách sản phẩm vận hành, nên tôi cố giữ mọi thứ đơn giản. Tôi muốn người dùng mở sản phẩm ra là biết cách dùng ngay.",
  ),
  greeting: t("Hi, I am", "Xin chào, tôi là"),
  availability: t(
    "Open to full-stack developer roles. Based in Da Nang, expected to graduate from FPT University in April 2027.",
    "Đang tìm vị trí lập trình viên full-stack. Sống tại Đà Nẵng, dự kiến tốt nghiệp Đại học FPT vào tháng 4/2027.",
  ),
  timeZone: "Asia/Ho_Chi_Minh",
  location: t("Da Nang", "Đà Nẵng"),
};

// kind picks the generated cover art: "page" | "render" | "poster" | "brand" | "sale"
const categories = [
  { id: "products", label: t("Products", "Sản phẩm"), tone: "blue", kind: "page" },
  { id: "web", label: t("Web apps", "Ứng dụng web"), tone: "orange", kind: "brand" },
  { id: "automation", label: t("Automation", "Tự động hoá"), tone: "green", kind: "poster" },
];

const soleDeveloper = t("Sole developer", "Lập trình viên duy nhất");

// Optional per project: image (cover screenshot, replaces the generated art), href (live demo),
// repo (source code), note (one line under the links), short (name on the cover's demo buttons).
const projects = [
  {
    title: t("RESCOM survey exchange platform", "Nền tảng trao đổi khảo sát RESCOM"),
    short: "RESCOM",
    category: "products",
    year: t("2026–now", "2026–nay"),
    madeFor: t(
      "Own project, funded by the FPT University Startup Scholarship",
      "Dự án cá nhân, được FPT University Startup Scholarship tài trợ",
    ),
    role: soleDeveloper,
    tools: ["Next.js", "NestJS", "PostgreSQL"],
    mark: "RES",
    image: rescomShot,
    href: "https://rescom.io.vn",
    note: t("Sign-in needed to see inside.", "Cần đăng nhập để xem bên trong."),
    summary: t(
      "Students answer each other's research surveys to earn points, then spend the points to collect responses for their own. Live, with 200+ real users.",
      "Sinh viên trả lời khảo sát nghiên cứu của nhau để nhận điểm, rồi dùng điểm để thu câu trả lời cho khảo sát của mình. Đang hoạt động với hơn 200 người dùng thật.",
    ),
    body: t(
      [
        "In some university courses it is hard to collect enough survey responses, and no platform let both sides benefit while the survey's author watches the progress. RESCOM is built for that.",
        "I am the sole developer. I designed a 27-model PostgreSQL schema and implemented 16 REST endpoints for authentication, Google OAuth, single-session enforcement, RBAC and admin user management.",
        "The points ledger handles concurrent requests without duplicate transactions or overbooking. Queries use indexes and cursor-based pagination, verified with EXPLAIN ANALYZE.",
        "After launch the site faced request floods, signup spam and mass junk accounts. I added firewall rules and rate limits on account creation per IP and device ID. Sign-up had no OTP at first and now needs an email OTP. Redeemed vouchers were not tracked at first, and now they are.",
        "Releases go to a VPS through a CI/CD pipeline and pass 225 automated checks across 23 unit and architecture suites and 4 end-to-end suites. Every API endpoint is documented.",
        "Awarded the FPT University Startup Scholarship, 1 of 3 funded projects out of 100 applicants. The project mentor recommended me to SURF 2026, the startup and venture investment festival in Da Nang.",
      ],
      [
        "Ở một số môn học, sinh viên rất khó thu đủ câu trả lời khảo sát, và chưa có nền tảng nào giúp cả hai bên cùng có lợi, đồng thời cho người đăng khảo sát theo dõi tiến độ. RESCOM ra đời để giải quyết việc đó.",
        "Tôi phát triển dự án này một mình. Tôi thiết kế schema PostgreSQL gồm 27 model và viết 16 REST endpoint cho phần xác thực, Google OAuth, giới hạn một phiên đăng nhập, RBAC và quản lý người dùng dành cho admin.",
        "Sổ điểm thưởng xử lý được các request đồng thời mà không sinh giao dịch trùng hay overbooking. Các truy vấn dùng index và phân trang theo cursor, đã kiểm chứng bằng EXPLAIN ANALYZE.",
        "Sau khi ra mắt, trang gặp các đợt request dồn dập, spam đăng ký và tài khoản rác được tạo hàng loạt. Tôi thêm cấu hình firewall và giới hạn tốc độ tạo tài khoản theo IP và device ID. Ban đầu đăng ký không cần OTP và voucher đã đổi không được ghi lại; giờ đăng ký phải xác thực OTP qua email và mọi voucher đã đổi đều được theo dõi.",
        "Mỗi bản phát hành được triển khai lên VPS qua pipeline CI/CD và phải vượt qua 225 bài kiểm tra tự động, gồm 23 bộ unit và architecture test cùng 4 bộ test end-to-end. Mọi API endpoint đều có tài liệu.",
        "Dự án được trao FPT University Startup Scholarship, là 1 trong 3 dự án được tài trợ trong số 100 hồ sơ. Cố vấn của dự án đã giới thiệu tôi tới SURF 2026, ngày hội khởi nghiệp và đầu tư mạo hiểm tại Đà Nẵng.",
      ],
    ),
  },
  {
    title: t("FUExams online exam platform", "Nền tảng thi trắc nghiệm trực tuyến FUExams"),
    short: "FUExams",
    category: "products",
    year: "2025–2026",
    madeFor: t("Personal project", "Dự án cá nhân"),
    role: soleDeveloper,
    tools: ["React", "Express.js", "MongoDB", "PayOS", "Gemini API"],
    mark: "EXAM",
    image: fuexamsShot,
    href: "https://fuexams.vercel.app",
    repo: "https://github.com/qxh1145/fuexams",
    note: t("Desktop only for now.", "Hiện chỉ dùng được trên máy tính."),
    summary: t(
      "A timed multiple-choice exam platform with paid plans and an AI tutor. I built and deployed it on my own.",
      "Nền tảng thi trắc nghiệm có tính giờ, có gói trả phí và trợ giảng AI. Tôi tự xây dựng và triển khai.",
    ),
    body: t(
      [
        "A dynamic question builder and 20+ REST endpoints over 6 MongoDB data models. JWT authentication, single-session enforcement and RBAC separate basic, premium and admin users.",
        "Payments run through the PayOS gateway for 3 subscription plans. The app creates the payment link, and webhook callbacks update the order status and upgrade the user's role automatically. Admins get dashboards for orders and users.",
        "The AI tutor uses the Google Gemini API to explain IT exam answers and keeps a chat history for each user.",
      ],
      [
        "Có trình tạo câu hỏi động và hơn 20 REST endpoint trên 6 data model MongoDB. Xác thực JWT, giới hạn một phiên đăng nhập và RBAC tách ba nhóm người dùng: basic, premium và admin.",
        "Thanh toán đi qua cổng PayOS cho 3 gói đăng ký. Ứng dụng tạo link thanh toán, còn webhook callback cập nhật trạng thái đơn và tự động nâng cấp vai trò người dùng. Admin có dashboard quản lý đơn hàng và người dùng.",
        "Trợ giảng AI dùng Google Gemini API để giải thích đáp án đề thi IT và lưu lịch sử chat theo từng người dùng.",
      ],
    ),
  },
  {
    title: t("Thanh Cong Energy corporate website", "Website doanh nghiệp Thanh Cong Energy"),
    category: "web",
    year: "2026",
    madeFor: t(
      "Thanh Cong Energy (formerly Vinapom), freelance client",
      "Thanh Cong Energy (trước là Vinapom), khách hàng freelance",
    ),
    role: t("Full-stack developer in a team of 3", "Lập trình viên full-stack trong nhóm 3 người"),
    tools: ["MongoDB", "Express.js", "React", "Node.js"],
    mark: "TCE",
    summary: t(
      "The company's corporate website on the MERN stack: public pages, REST APIs and SEO.",
      "Website giới thiệu doanh nghiệp, làm bằng MERN stack: các trang công khai, REST API và SEO.",
    ),
    body: t(
      [
        "I built the admin post module (create, edit, publish), so the client updates the site content without a developer.",
        "I broke the client's requirements into prioritized tasks with acceptance criteria and tracked milestone risks. That helped recover a project that was about a month behind schedule.",
      ],
      [
        "Tôi làm module quản lý bài viết cho admin (tạo, sửa, xuất bản), nhờ đó khách hàng tự cập nhật nội dung mà không cần lập trình viên.",
        "Tôi chia yêu cầu của khách thành các task có thứ tự ưu tiên và tiêu chí nghiệm thu, đồng thời theo dõi rủi ro từng mốc. Việc này giúp kéo lại tiến độ của một dự án đang trễ khoảng một tháng.",
      ],
    ),
  },
  {
    title: t(
      "Job-posting screens for a recruitment platform",
      "Màn hình đăng tin cho nền tảng tuyển dụng",
    ),
    category: "web",
    year: "2025–2026",
    madeFor: t("FPT Software, internal platform", "FPT Software, nền tảng nội bộ"),
    role: "Associate Software Engineer",
    tools: ["Angular"],
    mark: "JOBS",
    summary: t(
      "Rebuilt 4 responsive Angular screens in the job-posting flow of an internal recruitment platform.",
      "Làm lại 4 màn hình Angular responsive trong luồng đăng tin của một nền tảng tuyển dụng nội bộ.",
    ),
    body: t(
      [
        "I moved the legacy interface into reusable components and fixed form validation across the mobile, tablet and desktop layouts.",
      ],
      [
        "Tôi chuyển giao diện cũ thành các component dùng lại được và sửa phần kiểm tra dữ liệu form trên cả ba bố cục mobile, tablet và desktop.",
      ],
    ),
  },
  {
    title: t(
      "UiPath workflows for a warehouse migration",
      "Workflow UiPath cho dự án chuyển đổi hệ thống kho",
    ),
    category: "automation",
    year: "2025–2026",
    madeFor: t("FPT Software, for a Japanese client", "FPT Software, làm cho khách hàng Nhật"),
    role: "Associate Software Engineer",
    tools: ["UiPath", "Excel"],
    mark: "RPA",
    summary: t(
      "2 of the 9 core UiPath workflows in a Japanese client's move from a legacy warehouse system to the cloud.",
      "2 trong 9 workflow UiPath cốt lõi của dự án chuyển hệ thống kho cũ lên cloud cho một khách hàng Nhật.",
    ),
    body: t(
      [
        "My workflows automate order import and export, invalid-order detection and Excel-based inventory data handling.",
        "I also wrote and ran 30+ unit test cases across all 9 workflows, covering standard and exception paths before release.",
      ],
      [
        "Các workflow của tôi tự động hoá việc nhập và xuất đơn hàng, phát hiện đơn không hợp lệ và xử lý dữ liệu tồn kho trên Excel.",
        "Tôi cũng viết và chạy hơn 30 unit test case cho cả 9 workflow, bao gồm luồng chuẩn và luồng ngoại lệ, trước khi phát hành.",
      ],
    ),
  },
];

const highlights = [
  {
    label: t("Shipped products", "Sản phẩm đã ra mắt"),
    tone: "blue",
    lines: t(
      [
        "RESCOM: live, 200+ real users",
        "FUExams: live, paid plans through PayOS",
        "Both built as the sole developer",
      ],
      [
        "RESCOM: đang hoạt động, hơn 200 người dùng thật",
        "FUExams: đang hoạt động, có gói trả phí qua PayOS",
        "Cả hai do tôi phát triển một mình",
      ],
    ),
  },
  {
    label: t("Experience at FPT Software", "Kinh nghiệm tại FPT Software"),
    tone: "green",
    lines: t(
      [
        "Associate Software Engineer",
        "Angular screens and UiPath workflows",
        "30+ unit test cases before release",
      ],
      [
        "Associate Software Engineer",
        "Màn hình Angular và workflow UiPath",
        "Hơn 30 unit test case trước khi phát hành",
      ],
    ),
  },
  {
    label: t("Education and awards", "Học vấn và giải thưởng"),
    tone: "yellow",
    lines: t(
      [
        "B.S. Software Engineering, FPT University",
        "Expected graduation April 2027 · GPA 3.5/4.0",
        "TOEIC 915/990",
        "Startup Scholarship: 1 of 3 funded out of 100",
        "Codemosaic consolation prize, Oct 2025",
      ],
      [
        "Cử nhân Kỹ thuật phần mềm, Đại học FPT",
        "Dự kiến tốt nghiệp tháng 4/2027 · GPA 3.5/4.0",
        "TOEIC 915/990",
        "Startup Scholarship: 1 trong 3 dự án được tài trợ trong số 100 hồ sơ",
        "Giải Khuyến khích Codemosaic, 10/2025",
      ],
    ),
  },
  {
    label: t("Skills", "Kỹ năng"),
    tone: "orange",
    lines: [
      "JavaScript, TypeScript, Java, SQL",
      "React, Next.js, Angular, Tailwind CSS",
      "Node.js, Express.js, NestJS, REST APIs",
      "PostgreSQL, SQL Server, MongoDB",
      "Git, CI/CD, Postman, Jira",
    ],
  },
];

const timeline = [
  { from: "2025.12", to: "2026.08", title: "Associate Software Engineer", place: "FPT Software" },
  {
    from: "2026.08",
    to: "2026.10",
    title: t("Full-stack Developer (freelance)", "Lập trình viên full-stack (freelance)"),
    place: "Thanh Cong Energy",
  },
];

// Contents: one entry per section. `points` must name things that section really has.
const chapters = [
  {
    title: t("About me", "Giới thiệu"),
    points: t(
      ["Experience", "Education", "Awards", "Skills"],
      ["Kinh nghiệm", "Học vấn", "Giải thưởng", "Kỹ năng"],
    ),
    target: "about",
  },
  {
    title: t("Projects", "Dự án"),
    points: t(["Products", "Web apps", "Automation"], ["Sản phẩm", "Ứng dụng web", "Tự động hoá"]),
    target: "work",
  },
  {
    title: t("Process", "Quy trình"),
    points: t(["Understand", "Plan", "Build", "Ship"], ["Tìm hiểu", "Lên kế hoạch", "Xây dựng", "Triển khai"]),
    target: "process",
  },
  {
    title: t("Contact", "Liên hệ"),
    points: t(["Availability", "Email", "Links"], ["Sẵn sàng nhận việc", "Email", "Liên kết"]),
    target: "contact",
  },
];

const steps = [
  {
    title: t("Understand", "Tìm hiểu"),
    body: t(
      "I start with who has the problem. RESCOM began with one: in some university courses it is hard to collect enough survey responses, and no platform let both sides benefit.",
      "Tôi bắt đầu bằng việc tìm hiểu ai đang gặp vấn đề. RESCOM xuất phát từ một vấn đề như vậy: ở một số môn học, sinh viên rất khó thu đủ câu trả lời khảo sát, và chưa có nền tảng nào giúp cả hai bên cùng có lợi.",
    ),
    outputs: t(["Who has the problem", "What they need first"], ["Ai đang gặp vấn đề", "Họ cần gì trước tiên"]),
  },
  {
    title: t("Plan", "Lên kế hoạch"),
    body: t(
      "I break the requirements into prioritized tasks with acceptance criteria and watch the milestone risks. On the Thanh Cong Energy website this helped recover a project that was about a month behind.",
      "Tôi chia yêu cầu thành các task có thứ tự ưu tiên và tiêu chí nghiệm thu, rồi theo dõi rủi ro từng mốc. Ở website Thanh Cong Energy, cách này giúp kéo lại tiến độ của một dự án đang trễ khoảng một tháng.",
    ),
    outputs: t(
      ["Prioritized tasks", "Acceptance criteria", "Milestone risks"],
      ["Task theo thứ tự ưu tiên", "Tiêu chí nghiệm thu", "Rủi ro từng mốc"],
    ),
  },
  {
    title: t("Build", "Xây dựng"),
    body: t(
      "I build across the stack, from the front end to the database. On RESCOM the code ships with tests: 23 unit and architecture suites and 4 end-to-end suites. At FPT Software I wrote 30+ unit test cases across 9 UiPath workflows, covering standard and exception paths.",
      "Tôi làm toàn bộ stack, từ front end tới cơ sở dữ liệu. Ở RESCOM, code đi kèm test: 23 bộ unit và architecture test, 4 bộ test end-to-end. Ở FPT Software, tôi viết hơn 30 unit test case cho 9 workflow UiPath, bao gồm luồng chuẩn và luồng ngoại lệ.",
    ),
    outputs: t(
      ["Working features", "Unit tests", "End-to-end tests"],
      ["Tính năng hoạt động được", "Unit test", "End-to-end test"],
    ),
  },
  {
    title: t("Ship", "Triển khai"),
    body: t(
      "RESCOM deploys to a VPS through a CI/CD pipeline, passes 225 automated checks before a release, and has every API endpoint documented. After launch I fix what real use exposes: sign-up now needs an email OTP, account creation is rate limited per IP and device ID, and redeemed vouchers are tracked.",
      "RESCOM được triển khai lên VPS qua pipeline CI/CD, phải vượt qua 225 bài kiểm tra tự động trước mỗi bản phát hành, và mọi API endpoint đều có tài liệu. Sau khi ra mắt, tôi xử lý những vấn đề lộ ra khi có người dùng thật: đăng ký giờ cần OTP qua email, việc tạo tài khoản bị giới hạn tốc độ theo IP và device ID, và mọi voucher đã đổi đều được theo dõi.",
    ),
    outputs: t(
      ["CI/CD pipeline", "API docs", "Fixes after launch"],
      ["Pipeline CI/CD", "Tài liệu API", "Sửa lỗi sau khi ra mắt"],
    ),
  },
];

// Testimonials. Empty hides the "Words" section; add { quote, name, role, tone } entries to show it.
const words = [];

// Live demos first: opening them is the main thing a visitor should do.
const contacts = [
  { label: "RESCOM", value: "rescom.io.vn", href: "https://rescom.io.vn" },
  { label: "FUExams", value: "fuexams.vercel.app", href: "https://fuexams.vercel.app" },
  { label: "GitHub", value: "github.com/qxh1145", href: "https://github.com/qxh1145" },
];

// Interface text: everything the page says that is not the owner's content.
const ui = {
  docTitle: t("Tran Anh Quan · Full-stack Developer", "Trần Anh Quân · Lập trình viên full-stack"),
  // Nav labels and meta-bar page names, by section id.
  nav: {
    cover: t("Cover", "Bìa"),
    contents: t("Contents", "Mục lục"),
    about: t("About", "Giới thiệu"),
    work: t("Projects", "Dự án"),
    process: t("Process", "Quy trình"),
    words: t("Words", "Nhận xét"),
    contact: t("Contact", "Liên hệ"),
  },
  pages: {
    cover: t("Cover page", "Trang bìa"),
    contents: t("Contents", "Mục lục"),
    about: t("About me", "Giới thiệu"),
    work: t("Projects", "Dự án"),
    process: t("Process", "Quy trình"),
    words: t("Kind words", "Nhận xét"),
    contact: t("Contact", "Liên hệ"),
  },
  // Stroke-drawn headings. The stroke font has A-Z, digits and Vietnamese diacritics.
  headings: {
    contents: t("Contents", "Mục lục"),
    about: t("About me", "Giới thiệu"),
    work: t("Projects", "Dự án"),
    process: t("Process", "Quy trình"),
    words: t("Kind words", "Nhận xét"),
    contact: t("Contact", "Liên hệ"),
    talk: t("Let's talk :)", "Trò chuyện nhé :)"),
  },
  // The small tag drawn over the Contact heading.
  contactTag: t("(hi)", "(chào)"),
  kickers: {
    contents: t(
      "What is on this page. Open a folder, then jump to that section.",
      "Nội dung trang này. Mở một mục rồi chuyển tới phần đó.",
    ),
    work: t(
      "Filter by type. Open a project for the details and its live demo.",
      "Lọc theo nhóm. Mở một dự án để xem chi tiết và demo.",
    ),
  },
  // Counts shown beside headings and on the deck folders.
  sectionCount: t((n) => n + (n === 1 ? " section" : " sections"), (n) => n + " phần"),
  projectCount: t((n) => n + (n === 1 ? " project" : " projects"), (n) => n + " dự án"),
  stepCount: t((n) => n + (n === 1 ? " step" : " steps"), (n) => n + " bước"),
  liveDemos: t("Live demos", "Demo trực tiếp"),
  liveDemo: t("Live demo", "Xem demo"),
  liveDemoOf: t((name) => "Live demo of " + name, (name) => "Xem demo " + name),
  code: t("Code", "Mã nguồn"),
  goTo: t((title) => "Go to " + title, (title) => "Tới phần " + title),
  basedIn: t((place) => "Based in " + place, (place) => "Sống tại " + place),
  workExperience: t("Work experience", "Kinh nghiệm làm việc"),
  all: t("All", "Tất cả"),
  emptyFolder: t("This folder is empty for now.", "Nhóm này hiện chưa có gì."),
  nextStep: t("Next step", "Bước tiếp theo"),
  previousStep: t("Previous step", "Bước trước"),
  contactTabs: {
    availability: t("Availability", "Sẵn sàng nhận việc"),
    email: "Email",
    links: t("Links", "Liên kết"),
  },
  copy: t("Copy", "Sao chép"),
  copied: t((text) => "Copied " + text, (text) => "Đã sao chép " + text),
  emailMe: t("Email me", "Gửi email"),
  backToCover: t("Back to cover", "Về đầu trang"),
  close: t("Close", "Đóng"),
  closeDetails: t("Close details", "Đóng chi tiết"),
  openDetails: t("Open details", "Mở chi tiết"),
  previousProject: t("Previous project", "Dự án trước"),
  nextProject: t("Next project", "Dự án tiếp theo"),
  details: {
    year: t("Year", "Năm"),
    madeFor: t("For", "Bối cảnh"),
    role: t("Role", "Vai trò"),
    tools: t("Tools", "Công nghệ"),
  },
  photoOf: t((name) => "Photo of " + name, (name) => "Ảnh của " + name),
  labels: {
    pages: t("Portfolio pages", "Các phần của trang"),
    filter: t("Filter projects by category", "Lọc dự án theo nhóm"),
    steps: t("Process steps", "Các bước quy trình"),
    toLight: t("Switch to light theme", "Chuyển sang giao diện sáng"),
    toDark: t("Switch to dark theme", "Chuyển sang giao diện tối"),
    // Named in the language it switches to, so a reader of that language can find it.
    switchLanguage: t("Chuyển sang tiếng Việt", "Switch to English"),
  },
};

export const content = {
  profile,
  categories,
  projects,
  highlights,
  timeline,
  chapters,
  steps,
  words,
  contacts,
  ui,
};
