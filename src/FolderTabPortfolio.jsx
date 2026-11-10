import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { content, localize } from "./data.js";
import {
  Arrow,
  PalmFronds,
  PalmLeaf,
  PortraitIllustration,
  ProjectArt,
  Signature,
  StepArt,
  StrokeText,
  ThemeIcon,
  TONES,
  hashString,
  pad2,
} from "./graphics.jsx";
import "./FolderTabPortfolio.css";

// Default brand colours; override any of them with the `colors` prop.
const DEFAULT_COLORS = {
  blue: "#3a6cf4",
  green: "#3cc84a",
  orange: "#ff6a3d",
  yellow: "#f3e7a6",
};

// Every sheet in page order, by section id; nav labels and page names come from the `ui` text.
const SHEETS = ["cover", "contents", "about", "work", "process", "words", "contact"];

// Cover-deck folder slots (left/width in %, top in px, tab position) for the first six categories.
// Folders in a row overlap by less than their side padding and the second row starts below the
// first row's captions, so no title is covered.
const DECK_SLOTS = [
  { left: 0, width: 29.5, top: 8, tab: 0.16 },
  { left: 28, width: 34, top: 0, tab: 0.7 },
  { left: 60.5, width: 39.5, top: 14, tab: 0.12 },
  { left: 3, width: 31, top: 140, tab: 0.06 },
  { left: 32.5, width: 33, top: 132, tab: 0.5 },
  { left: 64, width: 36, top: 146, tab: 0.3 },
];

// localStorage key for the visitor's language choice.
const LANG_KEY = "ftp-lang";

// Combining marks drawn above a letter or beside its top (tone marks, circumflex, breve, horn), not the dot below.
const MARKS_ABOVE = /[\u0300-\u0309\u031B]/;

// The saved language choice, else Vietnamese for Vietnamese browsers and English for everyone else.
function initialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "vi") return saved;
  } catch {
    // Storage can be blocked; fall back to the browser language.
  }
  return typeof navigator !== "undefined" && /^vi\b/i.test(navigator.language || "") ? "vi" : "en";
}

// Whether the host page or the system asks for a dark theme.
function prefersDark() {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.classList.contains("dark") ||
    (typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

// useLayoutEffect in the browser, useEffect when rendered without a DOM.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Short uppercase mark printed on a project's generated art.
function projectMark(project) {
  return (project.mark || project.title.split(/\s+/)[0] || "").toUpperCase().slice(0, 6);
}

// Short project name for the live-demo links.
function shortTitle(project) {
  return project.short || project.title.split(/\s+/)[0];
}

// A coloured folder body with a tab on its top edge at `tabAt` (0 = left, 1 = right).
function Folder({
  tone,
  tab,
  tabAt = 0.1,
  glass,
  as: Tag = "div",
  className,
  bodyClass,
  style,
  children,
  ...rest
}) {
  const flush = tabAt <= 0 ? "left" : tabAt >= 1 ? "right" : undefined;
  return (
    <Tag
      {...rest}
      className={"ftp-folder" + (className ? " " + className : "")}
      data-tone={tone}
      data-glass={glass ? "true" : undefined}
      data-flush={flush}
      style={{ ...style, "--tx": Math.min(1, Math.max(0, tabAt)) }}
    >
      {tab != null && (
        <span className="ftp-tabshape ftp-ftab" data-tone={tone} data-flush={flush}>
          {tab}
        </span>
      )}
      <div className={"ftp-fbody" + (bodyClass ? " " + bodyClass : "")}>{children}</div>
    </Tag>
  );
}

// Folder-tab tablist with roving tabindex and arrow / Home / End keyboard navigation.
function FolderTabs({ items, active, onChange, label, idBase }) {
  const tabRefs = useRef([]);
  const handleKeyDown = (event, index) => {
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    onChange(items[next].id);
    tabRefs.current[next]?.focus();
  };
  return (
    <div className="ftp-tabbar" role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={idBase + "-tab-" + item.id}
            aria-selected={selected}
            aria-controls={idBase + "-panel"}
            tabIndex={selected ? 0 : -1}
            className="ftp-tabshape ftp-tabbtn"
            data-tone={selected ? item.tone : "ghost"}
            data-on={selected ? "true" : "false"}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.label}
            {item.count != null && <span className="ftp-tchip">{pad2(item.count)}</span>}
          </button>
        );
      })}
    </div>
  );
}

// One-page folder-tab portfolio: cover, contents, about, work, process, testimonials and contact.
// Defaults come from data.js and follow the language switch. A prop replaces its default as given:
// props are not translated, and a `ui` prop must be complete.
export default function FolderTabPortfolio(props) {
  const [lang, setLang] = useState(initialLang);
  const defaults = useMemo(() => localize(content, lang), [lang]);
  const {
    name = defaults.profile.name,
    shortName = defaults.profile.shortName,
    localName = defaults.profile.localName,
    signature,
    years = defaults.profile.years,
    role = defaults.profile.role,
    disciplines = defaults.profile.disciplines,
    word = defaults.profile.word,
    tag = defaults.profile.tag,
    subtitle = defaults.profile.subtitle,
    notes = defaults.profile.notes,
    lead = defaults.profile.lead,
    blurb = defaults.profile.blurb,
    greeting = defaults.profile.greeting,
    photo = defaults.profile.photo,
    highlights = defaults.highlights,
    timeline = defaults.timeline,
    categories = defaults.categories,
    projects = defaults.projects,
    chapters = defaults.chapters,
    steps = defaults.steps,
    words = defaults.words,
    email = defaults.profile.email,
    contacts = defaults.contacts,
    timeZone = defaults.profile.timeZone,
    location = defaults.profile.location,
    availability = defaults.profile.availability,
    ui = defaults.ui,
    colors,
    ligatures = true,
    defaultTheme = "system",
    onThemeChange,
    height = "100svh",
    className,
  } = props;
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef(null);
  const sheetRefs = useRef({});
  const navLinkRefs = useRef({});
  const navLinksRef = useRef(null);
  const returnFocusRef = useRef(null);
  const closeButtonRef = useRef(null);
  const photoRef = useRef(null);
  const palette = useMemo(() => ({ ...DEFAULT_COLORS, ...colors }), [colors]);
  const firstName = shortName || name.split(/\s+/)[0] || name;
  const signatureText = signature ?? firstName;
  // The name as written in the current language, for labels and credits.
  const displayName = lang === "vi" && localName ? localName : name;
  const [theme, setTheme] = useState(() =>
    defaultTheme === "dark" || (defaultTheme === "system" && prefersDark()) ? "dark" : "light",
  );
  const [activeSection, setActiveSection] = useState("cover");
  const [openChapter, setOpenChapter] = useState(0);
  const [workFilter, setWorkFilter] = useState("all");
  const [stepIndex, setStepIndex] = useState(0);
  const [openProject, setOpenProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });
  const [clock, setClock] = useState(null);
  const categoryById = useMemo(() => {
    const byId = {};
    for (const category of categories) byId[category.id] = category;
    return byId;
  }, [categories]);
  const toneOf = (categoryId) => categoryById[categoryId]?.tone ?? "blue";
  const kindOf = (categoryId) => categoryById[categoryId]?.kind ?? "poster";
  const countIn = (categoryId) => projects.filter((project) => project.category === categoryId).length;
  const sheets = useMemo(
    () =>
      SHEETS.filter((id) =>
        id === "contents"
          ? chapters.length > 0
          : id === "work"
            ? projects.length > 0
            : id === "process"
              ? steps.length > 0
              : id === "words"
                ? words.length > 0
                : true,
      ),
    [chapters.length, projects.length, steps.length, words.length],
  );
  const pageNumber = (id) => sheets.indexOf(id) + 1;
  const visibleProjects = useMemo(
    () =>
      projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => workFilter === "all" || project.category === workFilter),
    [projects, workFilter],
  );

  useEffect(() => {
    if (defaultTheme !== "system") return;
    setTheme(prefersDark() ? "dark" : "light");
  }, [defaultTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      onThemeChange?.(next);
      return next;
    });
  }, [onThemeChange]);
  const otherLang = lang === "en" ? "vi" : "en";
  const toggleLang = () => {
    setLang(otherLang);
    setToast(null);
    try {
      localStorage.setItem(LANG_KEY, otherLang);
    } catch {
      // Storage can be blocked; the choice then lasts for this visit only.
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (ui.docTitle) document.title = ui.docTitle;
  }, [lang, ui.docTitle]);

  const showToast = useCallback((text) => setToast({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const copyEmail = useCallback(() => {
    const copied = () => showToast(ui.copied(email));
    const fallback = () => {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        copied();
      } catch {
        showToast(email);
      }
      textarea.remove();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(email).then(copied, fallback);
    else fallback();
  }, [email, showToast, ui]);
  const scrollToSheet = useCallback((id) => {
    const sheet = sheetRefs.current[id];
    if (!sheet) return;
    const reduceMotion =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    sheet.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, []);
  const openCategory = (categoryId) => {
    setWorkFilter(categoryId);
    scrollToSheet("work");
  };

  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.dataset.sheet);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of sheets) {
      const element = sheetRefs.current[id];
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sheets]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll(".ftp-rv"));
    if (typeof IntersectionObserver !== "function") {
      for (const target of targets) target.dataset.in = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.in = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [sheets]);

  useIsomorphicLayoutEffect(() => {
    const link = navLinkRefs.current[activeSection];
    if (!link) return;
    setIndicator({ x: link.offsetLeft, width: link.offsetWidth });
    const strip = navLinksRef.current;
    if (strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: link.offsetLeft - strip.clientWidth / 2 + link.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeSection, sheets, lang]);

  useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const time = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        }).format(now);
        const hour = Number(
          new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone }).format(now),
        );
        setClock({ time, day: hour >= 7 && hour < 19 });
      } catch {
        setClock(null);
      }
    };
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, [timeZone]);

  // The card is passed in: Safari does not focus a button on click, so activeElement would be the page.
  const openProjectDetails = (index, opener) => {
    returnFocusRef.current = opener;
    setOpenProject(index);
  };
  const closeProject = useCallback(() => {
    setOpenProject(null);
    returnFocusRef.current?.focus?.();
  }, []);
  const stepProject = useCallback(
    (delta) => {
      setOpenProject((current) => {
        if (current == null || !visibleProjects.length) return current;
        const position = visibleProjects.findIndex((entry) => entry.index === current);
        return visibleProjects[(position + delta + visibleProjects.length) % visibleProjects.length]
          .index;
      });
    },
    [visibleProjects],
  );

  // The dialog takes focus when it opens. Paging leaves focus where it is, since Prev/Next stay mounted;
  // focus that was on a link of the replaced text goes back to Close.
  useEffect(() => {
    if (openProject == null) return;
    const dialog = closeButtonRef.current?.closest('[role="dialog"]');
    if (dialog && !dialog.contains(document.activeElement)) closeButtonRef.current.focus();
  }, [openProject]);

  useEffect(() => {
    if (openProject == null) return;
    const handleKey = (event) => {
      if (event.key === "Escape") closeProject();
      else if (event.key === "ArrowRight") stepProject(1);
      else if (event.key === "ArrowLeft") stepProject(-1);
      else if (event.key === "Tab") {
        // Keep Tab inside the dialog, as aria-modal promises.
        const dialog = closeButtonRef.current?.closest('[role="dialog"]');
        const focusable = dialog ? [...dialog.querySelectorAll("a[href], button")] : [];
        if (!focusable.length) return;
        const edge = focusable[event.shiftKey ? 0 : focusable.length - 1];
        if (document.activeElement === edge || !dialog.contains(document.activeElement)) {
          event.preventDefault();
          focusable[event.shiftKey ? focusable.length - 1 : 0].focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openProject, closeProject, stepProject]);

  const handlePhotoMove = (event) => {
    const frame = photoRef.current;
    if (!frame || event.pointerType !== "mouse") return;
    const rect = frame.getBoundingClientRect();
    const dx = (event.clientX - rect.left) / rect.width - 0.5;
    const dy = (event.clientY - rect.top) / rect.height - 0.5;
    frame.style.setProperty("--ry", (dx * 10).toFixed(2) + "deg");
    frame.style.setProperty("--rx", (-dy * 10).toFixed(2) + "deg");
  };
  const handlePhotoLeave = () => {
    photoRef.current?.style.setProperty("--ry", "0deg");
    photoRef.current?.style.setProperty("--rx", "0deg");
  };
  const rootStyle = {
    minHeight: height,
    "--ftp-blue": palette.blue,
    "--ftp-green": palette.green,
    "--ftp-orange": palette.orange,
    "--ftp-yellow": palette.yellow,
  };
  const sheetProps = (id) => ({
    id: uid + "-" + id,
    "data-sheet": id,
    ref: (element) => {
      sheetRefs.current[id] = element;
    },
    "aria-labelledby": uid + "-" + id + "-h",
  });
  const renderMeta = (id, bar) => (
    <div className={"ftp-meta" + (bar ? " ftp-meta-bar" : "")} aria-hidden="true">
      <span>{years}</span>
      {disciplines.slice(0, 3).map((discipline) => (
        <span key={discipline}>{discipline}</span>
      ))}
      <span data-on="true">{ui.pages[id]}</span>
      <span>{pad2(pageNumber(id)) + " / " + pad2(sheets.length)}</span>
    </div>
  );
  const renderHead = (id, label, heading, { local, withSig, kicker } = {}) => (
    // A heading with marks above its letters needs room over the cap line, or the marks run into the tag.
    <div className="ftp-head" data-marks={MARKS_ABOVE.test(heading.normalize("NFD")) ? "true" : undefined}>
      <span className="ftp-plus" style={{ left: -18, top: -6 }} />
      <span className="ftp-plus" style={{ right: -18, top: -6 }} />
      <StrokeText
        text={label}
        className="ftp-head-tag"
        weight={9}
        outline={1.6}
        color="var(--ftp-faint)"
        decorative
      />
      <div className="ftp-head-row">
        <h2 id={uid + "-" + id + "-h"} style={{ minWidth: 0, flex: "1 1 auto" }}>
          <StrokeText
            text={heading}
            className="ftp-head-word"
            weight={10}
            outline={2.2}
            color="var(--ftp-blue)"
            ligatures={ligatures}
          />
        </h2>
        {local && <span className="ftp-head-local">{local}</span>}
      </div>
      {withSig && <Signature text={signatureText} className="ftp-head-sig" delay={500} />}
      {kicker && (
        <p className="ftp-kicker" style={{ marginTop: 14 }}>
          {kicker}
        </p>
      )}
    </div>
  );
  const deckCategories = categories.slice(0, DECK_SLOTS.length);
  const activeProject = openProject != null ? projects[openProject] : null;
  const filterTabs = [
    { id: "all", label: ui.all, tone: "blue", count: projects.length },
    ...categories
      .filter((category) => countIn(category.id) > 0)
      .map((category) => ({
        id: category.id,
        label: category.label,
        tone: category.tone,
        count: countIn(category.id),
      })),
  ];
  const filterTone = workFilter === "all" ? "blue" : toneOf(workFilter);
  const quickLinks = categories.slice(0, 3);
  const liveProjects = projects.filter((project) => project.href).slice(0, 3);
  const toneAt = (index) => TONES[index % TONES.length];
  const endYear = years.split(/[–-]/).pop();
  // Where the email may wrap: before its last "@", if it has one.
  const emailAt = email.lastIndexOf("@");
  const currentStep = Math.min(stepIndex, steps.length - 1);
  const step = steps[currentStep];

  return (
    <div
      ref={rootRef}
      className={"ftp-root" + (className ? " " + className : "")}
      data-theme={theme}
      lang={lang}
      style={rootStyle}
    >
      <header className="ftp-mast">
        <div className="ftp-mast-strip" />
        <div className="ftp-mast-row">
          <div className="ftp-mast-tab">
            <StrokeText
              text={word}
              weight={17}
              tracking={20}
              color="#ffffff"
              ligatures={ligatures}
              label={word + ", " + displayName}
            />
          </div>
          <div className="ftp-mast-notes">
            {notes.map((note, index) => (
              <Fragment key={note + index}>
                {index > 0 && <i aria-hidden="true" />}
                <span>{note}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </header>

      <div className="ftp-navwrap">
        <nav className="ftp-nav" aria-label={ui.labels.pages}>
          <span className="ftp-count" aria-hidden="true">
            {pad2(pageNumber(activeSection))}
            <small>/{pad2(sheets.length)}</small>
          </span>
          <div className="ftp-links" ref={navLinksRef}>
            <span
              className="ftp-ind"
              style={{
                transform: "translateX(" + indicator.x + "px)",
                width: indicator.width,
                opacity: indicator.width ? 1 : 0,
              }}
            />
            {sheets.map((id) => (
              <button
                key={id}
                type="button"
                ref={(element) => {
                  navLinkRefs.current[id] = element;
                }}
                className="ftp-link"
                aria-current={activeSection === id ? "true" : undefined}
                onClick={() => scrollToSheet(id)}
              >
                {ui.nav[id]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="ftp-icon ftp-lang"
            onClick={toggleLang}
            aria-label={otherLang.toUpperCase() + ": " + ui.labels.switchLanguage}
            lang={otherLang}
          >
            {otherLang.toUpperCase()}
          </button>
          <button
            type="button"
            className="ftp-icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? ui.labels.toLight : ui.labels.toDark}
          >
            <ThemeIcon dark={theme === "dark"} />
          </button>
        </nav>
      </div>

      <main className="ftp-wrap ftp-sheets">
        <section className="ftp-sheet ftp-cover" {...sheetProps("cover")}>
          {renderMeta("cover", true)}
          <div className="ftp-cover-top">
            <PalmFronds className="ftp-palm" />
            <span className="ftp-plus" style={{ left: -14, top: 8 }} />
            <span className="ftp-plus" style={{ right: -14, top: 8 }} />
            <StrokeText
              text={tag}
              className="ftp-cover-tag"
              weight={8}
              outline={1.4}
              color="var(--ftp-quiet)"
              decorative
            />
            <h1 id={uid + "-cover-h"} style={{ position: "relative" }}>
              <StrokeText
                text={word}
                className="ftp-cover-word"
                weight={9}
                outline={1.9}
                tracking={22}
                color="var(--ftp-blue)"
                ligatures={ligatures}
                delay={150}
                label={word + " — " + displayName}
              />
            </h1>
          </div>
          <div className="ftp-cover-mid">
            <div className="ftp-sub">
              {subtitle.map((part, index) => (
                <Fragment key={index}>
                  {index > 0 && " "}
                  {index % 2 ? <b>{part}</b> : <span>{part}</span>}
                </Fragment>
              ))}
              <Signature text={signatureText} className="ftp-sub-sig" delay={900} />
            </div>
            <div>
              <button type="button" className="ftp-pill" onClick={() => scrollToSheet("about")}>
                <span>
                  {localName ? localName + " · " : ""}
                  <span style={{ whiteSpace: "nowrap" }}>{role}</span>
                </span>
                <span className="ftp-pill-arrow">
                  <Arrow dir="down" />
                </span>
              </button>
              {liveProjects.length > 0 && (
                <div className="ftp-demos" role="group" aria-labelledby={uid + "-demos"}>
                  <span id={uid + "-demos"}>{ui.liveDemos}</span>
                  {liveProjects.map((project, index) => (
                    <a
                      key={shortTitle(project) + index}
                      className="ftp-demo"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shortTitle(project)} <Arrow dir="ne" size={12} />
                    </a>
                  ))}
                </div>
              )}
              <p className="ftp-blurb">{lead || blurb}</p>
              <div className="ftp-qlinks">
                {quickLinks.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="ftp-qlink"
                    onClick={() => openCategory(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {deckCategories.length > 0 && (
            <div
              className="ftp-deck"
              style={{
                "--dh": deckCategories.length > 3 ? "394px" : undefined,
                "--dhm": 78 * deckCategories.length + 72 + "px",
              }}
            >
              {deckCategories.map((category, index) => {
                const slot = DECK_SLOTS[index];
                return (
                  <Folder
                    key={category.id}
                    as="button"
                    tone={category.tone}
                    tabAt={slot.tab}
                    className="ftp-dfold ftp-dfold-btn"
                    data-front={index === deckCategories.length - 1 ? "true" : undefined}
                    style={{
                      "--l": slot.left,
                      "--w": slot.width,
                      "--t": slot.top + "px",
                      "--z": slot.top,
                      "--mt": index * 78 + "px",
                      "--mz": index,
                    }}
                    tab={
                      <>
                        {category.label}
                        <span className="ftp-tchip">{pad2(countIn(category.id))}</span>
                        <Arrow size={11} />
                      </>
                    }
                    onClick={() => openCategory(category.id)}
                    aria-label={category.label + ", " + ui.projectCount(countIn(category.id))}
                  >
                    <span className="ftp-dl">
                      <span className="ftp-dl-local">{category.label}</span>
                      <span className="ftp-dl-n">{pad2(index + 1)}</span>
                    </span>
                    <span className="ftp-dl-en">{ui.projectCount(countIn(category.id))}</span>
                    {index === 2 && deckCategories.length <= 3 && (
                      <span className="ftp-dl-years">{years}</span>
                    )}
                  </Folder>
                );
              })}
            </div>
          )}
        </section>

        {chapters.length > 0 && (
          <section className="ftp-sheet ftp-rv" {...sheetProps("contents")}>
            {renderMeta("contents")}
            {renderHead("contents", "(" + pad2(chapters.length) + ")", ui.headings.contents, {
              local: ui.sectionCount(chapters.length),
              kicker: ui.kickers.contents,
            })}
            <div className="ftp-band-list">
              {chapters.map((chapter, index) => {
                const open = openChapter === index;
                const tabAt = [0.62, 0.08, 0.84, 0.3, 0.7, 0.18][index % 6];
                return (
                  <Folder
                    key={chapter.title + index}
                    tone={open ? "blue" : "sheet"}
                    tabAt={tabAt}
                    className="ftp-band"
                    data-open={open ? "true" : "false"}
                    tab={<Arrow size={12} />}
                  >
                    <button
                      type="button"
                      className="ftp-band-head"
                      aria-expanded={open}
                      aria-controls={uid + "-ch-" + index}
                      onClick={() => setOpenChapter(open ? -1 : index)}
                    >
                      <span className="ftp-band-n">{pad2(index + 1)}</span>
                      <span style={{ minWidth: 0 }}>
                        <span className="ftp-band-t" style={{ display: "block" }}>
                          {chapter.title}
                        </span>
                      </span>
                      {open && chapter.points && chapter.points.length > 0 && (
                        <ul className="ftp-band-pts">
                          {chapter.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </button>
                    <div className="ftp-band-fold" id={uid + "-ch-" + index} aria-hidden={!open}>
                      <div>
                        {chapter.target && sheets.includes(chapter.target) && (
                          <div className="ftp-band-go">
                            <button
                              type="button"
                              className="ftp-go"
                              tabIndex={open ? 0 : -1}
                              onClick={() => scrollToSheet(chapter.target)}
                            >
                              {ui.goTo(chapter.title)} <Arrow size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Folder>
                );
              })}
            </div>
          </section>
        )}

        <section className="ftp-sheet ftp-rv" {...sheetProps("about")}>
          {renderMeta("about")}
          {renderHead("about", "#" + firstName, ui.headings.about, { withSig: true })}
          <div className="ftp-about">
            <div
              className="ftp-photo"
              ref={photoRef}
              onPointerMove={handlePhotoMove}
              onPointerLeave={handlePhotoLeave}
            >
              <Folder
                tone="blue"
                tabAt={0.08}
                tab={location ? ui.basedIn(location) : name}
                bodyClass="ftp-photo-body"
              >
                <div className="ftp-photo-frame">
                  {typeof photo === "string" ? (
                    <img
                      src={photo}
                      alt={displayName}
                      width={300}
                      height={360}
                      loading="lazy"
                      style={{ maxWidth: "none" }}
                    />
                  ) : (
                    (photo ?? (
                      <PortraitIllustration label={ui.photoOf(displayName)} seed={hashString(name)} />
                    ))
                  )}
                </div>
                <div className="ftp-photo-glass" style={{ color: "var(--ftp-blue)" }}>
                  <PalmLeaf size={28} />
                  <StrokeText text={endYear || years} weight={9} color="var(--ftp-ink)" decorative />
                </div>
              </Folder>
            </div>
            <div>
              <p className="ftp-hi">
                <span style={{ color: "var(--ftp-blue)" }}>
                  <PalmLeaf size={34} />
                </span>
                <span>
                  {greeting} <b>{localName || name}</b>!
                  {localName && lang === "en" ? (
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: ".5em",
                        marginLeft: 12,
                        color: "var(--ftp-muted)",
                      }}
                    >
                      {name}
                    </span>
                  ) : null}
                </span>
              </p>
              <p className="ftp-kicker" style={{ marginTop: 12, maxWidth: 560 }}>
                {blurb}
              </p>
              {highlights.length > 0 && (
                <div className="ftp-cols">
                  {highlights.map((highlight, index) => (
                    <div key={highlight.label + index}>
                      <span
                        className="ftp-badge"
                        data-tone={highlight.tone ?? (index % 2 ? "blue" : "green")}
                      >
                        {highlight.label}
                      </span>
                      <ul>
                        {highlight.lines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {timeline.length > 0 && (
                <div className="ftp-tl">
                  <span className="ftp-badge" data-tone="blue">
                    {ui.workExperience}
                  </span>
                  <ol className="ftp-tl-track" style={{ "--n": timeline.length }}>
                    {timeline.map((job, index) => (
                      <li
                        key={job.from + index}
                        className="ftp-tl-item"
                        data-on={index === timeline.length - 1 ? "true" : "false"}
                      >
                        <span className="ftp-tl-date" style={{ display: "block" }}>
                          {job.from}–{job.to}
                        </span>
                        <span className="ftp-tl-dot" />
                        <span style={{ display: "block" }}>
                          <span className="ftp-tl-title" style={{ display: "block" }}>
                            {job.title}
                          </span>
                          {job.place && <span className="ftp-tl-place">{job.place}</span>}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {contacts.length > 0 && (
                <div className="ftp-contacts">
                  {contacts.map((contact, index) => {
                    const content = (
                      <>
                        <i data-tone={TONES[index % 3]}>{contact.label.slice(0, 1)}</i>
                        {contact.value}
                      </>
                    );
                    return contact.href ? (
                      <a
                        key={contact.label}
                        className="ftp-contact"
                        href={contact.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={contact.label + ": " + contact.value}
                      >
                        {content}
                      </a>
                    ) : (
                      <span key={contact.label} className="ftp-contact">
                        {content}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="ftp-sheet ftp-rv" {...sheetProps("work")}>
            {renderMeta("work")}
            {renderHead("work", "(" + pad2(projects.length) + ")", ui.headings.work, {
              local: ui.projectCount(projects.length),
              kicker: ui.kickers.work,
            })}
            <div className="ftp-filter">
              <FolderTabs
                items={filterTabs}
                active={workFilter}
                onChange={setWorkFilter}
                label={ui.labels.filter}
                idBase={uid + "-wf"}
              />
              <div className="ftp-bar" style={{ "--c": palette[filterTone] }} />
            </div>
            <div
              key={workFilter}
              className="ftp-grid"
              role="tabpanel"
              id={uid + "-wf-panel"}
              aria-labelledby={uid + "-wf-tab-" + workFilter}
            >
              {visibleProjects.map(({ project, index }, position) => (
                // The card is a button, so its live-demo link sits beside it, not inside it.
                <div key={project.title + index} className="ftp-cardwrap" style={{ "--i": position }}>
                  <Folder
                    as="button"
                    tone={toneOf(project.category)}
                    tabAt={Math.min(0.85, (position * 0.37) % 1)}
                    className="ftp-card"
                    tab={
                      <>
                        {categoryById[project.category]?.label ?? project.category}
                        <span className="ftp-tchip">{pad2(index + 1)}</span>
                      </>
                    }
                    onClick={(event) => openProjectDetails(index, event.currentTarget)}
                    aria-haspopup="dialog"
                    aria-label={project.title + ", " + project.year + ". " + ui.openDetails}
                  >
                    <span className="ftp-card-art" style={{ display: "block" }}>
                      {project.image ? (
                        <img
                          src={project.image}
                          alt=""
                          width={320}
                          height={220}
                          loading="lazy"
                          style={{ maxWidth: "none" }}
                        />
                      ) : (
                        <ProjectArt
                          kind={kindOf(project.category)}
                          seed={hashString(projectMark(project))}
                          mark={projectMark(project)}
                          colors={palette}
                        />
                      )}
                    </span>
                    <span className="ftp-card-cap">
                      <span>
                        <span className="ftp-card-t" style={{ display: "block" }}>
                          {project.title}
                        </span>
                        {project.tools && project.tools.length > 0 && (
                          <span className="ftp-card-l" style={{ display: "block" }}>
                            {project.tools.slice(0, 3).join(" · ")}
                          </span>
                        )}
                      </span>
                      <span className="ftp-card-y">{project.year}</span>
                    </span>
                  </Folder>
                  {project.href && (
                    <a
                      className="ftp-card-live"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={ui.liveDemoOf(shortTitle(project))}
                    >
                      {ui.liveDemo} <Arrow dir="ne" size={11} />
                    </a>
                  )}
                </div>
              ))}
              {!visibleProjects.length && <p className="ftp-empty">{ui.emptyFolder}</p>}
            </div>
          </section>
        )}

        {steps.length > 0 && (
          <section className="ftp-sheet ftp-rv" {...sheetProps("process")}>
            {renderMeta("process")}
            {renderHead("process", "(" + pad2(steps.length) + ")", ui.headings.process, {
              local: ui.stepCount(steps.length),
            })}
            <FolderTabs
              items={steps.map((item, index) => ({
                id: String(index),
                label: pad2(index + 1) + " " + item.title,
                tone: toneAt(index),
              }))}
              active={String(currentStep)}
              onChange={(id) => setStepIndex(Number(id))}
              label={ui.labels.steps}
              idBase={uid + "-ps"}
            />
            <div
              className="ftp-panel"
              data-tone={toneAt(currentStep)}
              role="tabpanel"
              id={uid + "-ps-panel"}
              aria-labelledby={uid + "-ps-tab-" + currentStep}
            >
              <div key={currentStep} className="ftp-step">
                <div>
                  <div className="ftp-step-n">{pad2(currentStep + 1)}</div>
                  <h3 className="ftp-step-t">{step.title}</h3>
                  <StepArt index={currentStep} />
                </div>
                <div>
                  <p className="ftp-step-b">{step.body}</p>
                  {step.outputs && step.outputs.length > 0 && (
                    <ul className="ftp-step-o">
                      {step.outputs.map((output) => (
                        <li key={output}>{output}</li>
                      ))}
                    </ul>
                  )}
                  <div className="ftp-dots" aria-hidden="true">
                    {steps.map((_, index) => (
                      <span key={index} data-on={index === currentStep ? "true" : "false"} />
                    ))}
                  </div>
                  <div className="ftp-btns" style={{ marginTop: 22 }}>
                    <button
                      type="button"
                      className="ftp-btn"
                      data-ghost="true"
                      onClick={() => setStepIndex((currentStep - 1 + steps.length) % steps.length)}
                      aria-label={ui.previousStep}
                    >
                      <Arrow dir="left" />
                    </button>
                    <button
                      type="button"
                      className="ftp-btn"
                      onClick={() => setStepIndex((currentStep + 1) % steps.length)}
                    >
                      {ui.nextStep} <Arrow />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {words.length > 0 && (
          <section className="ftp-sheet ftp-rv" {...sheetProps("words")}>
            {renderMeta("words")}
            {renderHead("words", "(" + pad2(words.length) + ")", ui.headings.words)}
            <div className="ftp-words">
              <span
                className="ftp-blob"
                style={{
                  left: "8%",
                  top: "18%",
                  width: 220,
                  height: 220,
                  background: palette.blue,
                  opacity: 0.85,
                }}
              />
              <span
                className="ftp-blob"
                style={{
                  left: "46%",
                  top: "40%",
                  width: 180,
                  height: 180,
                  background: palette.green,
                  opacity: 0.85,
                }}
              />
              <span
                className="ftp-blob"
                style={{
                  right: "6%",
                  top: "8%",
                  width: 150,
                  height: 150,
                  background: palette.orange,
                  opacity: 0.8,
                }}
              />
              {words.map((testimonial, index) => (
                <Folder
                  key={testimonial.name + index}
                  as="figure"
                  tone={testimonial.tone ?? TONES[index % 3]}
                  glass
                  tabAt={[0.1, 0.5, 0.86][index % 3]}
                  className="ftp-word"
                  style={{ "--rot": [-2, 1.5, -1][index % 3] + "deg" }}
                  tab={testimonial.name.split(/\s+/)[0]}
                >
                  <blockquote>{testimonial.quote}</blockquote>
                  <figcaption>
                    <b>{testimonial.name}</b>
                    {testimonial.role}
                  </figcaption>
                </Folder>
              ))}
            </div>
          </section>
        )}

        <section className="ftp-sheet ftp-rv" {...sheetProps("contact")}>
          {renderMeta("contact")}
          {renderHead("contact", ui.contactTag, ui.headings.contact, { local: location, withSig: true })}
          <div className="ftp-stack">
            <Folder
              tone="blue"
              tabAt={0.78}
              tab={
                <>
                  {ui.contactTabs.availability} <Arrow size={12} />
                </>
              }
            >
              <div className="ftp-talk">
                <StrokeText
                  text={ui.headings.talk}
                  weight={15}
                  tracking={22}
                  color="#ffffff"
                  label={ui.headings.talk.replace(/\s*:\)$/, "")}
                />
                <p>{availability}</p>
              </div>
            </Folder>
            <Folder
              tone="green"
              tabAt={0.56}
              tab={
                <>
                  {ui.contactTabs.email} <Arrow size={12} />
                </>
              }
            >
              <div className="ftp-mail">
                <a className="ftp-mail-a" href={"mailto:" + email} aria-label={email}>
                  {emailAt > 0 ? (
                    <>
                      {email.slice(0, emailAt)}
                      <wbr />
                      {email.slice(emailAt)}
                    </>
                  ) : (
                    email
                  )}
                </a>
                <div className="ftp-btns">
                  <button type="button" className="ftp-btn" onClick={copyEmail}>
                    {ui.copy}
                  </button>
                  {/* Gmail's compose page: a mailto link does nothing on a machine with no mail app set up. */}
                  <a
                    className="ftp-btn"
                    data-ghost="true"
                    href={"https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ui.emailMe} <Arrow dir="ne" />
                  </a>
                </div>
              </div>
            </Folder>
            {contacts.length > 0 && (
              <Folder
                tone="sheet"
                tabAt={0.3}
                tab={
                  <>
                    {ui.contactTabs.links} <Arrow size={12} />
                  </>
                }
                style={{ filter: "drop-shadow(0 -6px 14px rgba(27,34,52,.08))" }}
              >
                <div className="ftp-else">
                  {contacts.map((contact) => (
                    <a
                      key={contact.label}
                      href={contact.href || "#"}
                      target={contact.href ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      <span>
                        <small>{contact.label}</small>
                        {contact.value}
                      </span>
                      <Arrow dir="ne" />
                    </a>
                  ))}
                </div>
              </Folder>
            )}
          </div>
        </section>

        <footer className="ftp-foot">
          <span>
            {role}
            <small>
              © {endYear} {displayName}
            </small>
          </span>
          {clock && (
            <span className="ftp-clock">
              <i data-day={clock.day ? "true" : "false"} />
              {clock.time} · {location || timeZone.split("/").pop()?.replace(/_/g, " ")}
            </span>
          )}
          <button type="button" className="ftp-top" onClick={() => scrollToSheet("cover")}>
            {ui.backToCover} <Arrow dir="up" size={12} />
          </button>
          <span className="ftp-foot-n" aria-hidden="true">
            {pad2(pageNumber(activeSection))}
          </span>
        </footer>
      </main>

      {activeProject && (
        <div
          className="ftp-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeProject();
          }}
        >
          <Folder
            tone={toneOf(activeProject.category)}
            tabAt={0.04}
            className="ftp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={uid + "-dlg-t"}
            tab={
              <>
                {categoryById[activeProject.category]?.label ?? activeProject.category}
                <span className="ftp-tchip">{pad2((openProject ?? 0) + 1)}</span>
              </>
            }
          >
            <button
              type="button"
              ref={closeButtonRef}
              className="ftp-close"
              onClick={closeProject}
              aria-label={ui.closeDetails}
            >
              {ui.close} ✕
            </button>
            <div className="ftp-modal-grid">
              <div key={openProject} className="ftp-modal-art">
                {activeProject.image ? (
                  <img src={activeProject.image} alt="" width={320} height={220} style={{ maxWidth: "none" }} />
                ) : (
                  <ProjectArt
                    kind={kindOf(activeProject.category)}
                    seed={hashString(projectMark(activeProject))}
                    mark={projectMark(activeProject)}
                    colors={palette}
                  />
                )}
              </div>
              <div className="ftp-modal-info">
                <div
                  key={openProject}
                  className="ftp-modal-text"
                  style={{ animation: "ftp-in .5s cubic-bezier(.2,.8,.2,1) both" }}
                >
                  <h3 className="ftp-modal-t" id={uid + "-dlg-t"}>
                    {activeProject.title}
                  </h3>
                  <p className="ftp-modal-p">{activeProject.summary}</p>
                  {(activeProject.href || activeProject.repo || activeProject.note) && (
                    <div className="ftp-modal-links">
                      {(activeProject.href || activeProject.repo) && (
                        <div className="ftp-btns">
                          {activeProject.href && (
                            <a
                              className="ftp-btn"
                              href={activeProject.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {ui.liveDemo} <Arrow dir="ne" />
                            </a>
                          )}
                          {activeProject.repo && (
                            <a
                              className="ftp-btn"
                              data-ghost="true"
                              href={activeProject.repo}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {ui.code} <Arrow dir="ne" />
                            </a>
                          )}
                        </div>
                      )}
                      {activeProject.note && <p className="ftp-modal-note">{activeProject.note}</p>}
                    </div>
                  )}
                  {activeProject.body?.map((paragraph, index) => (
                    <p key={index} className="ftp-modal-p">
                      {paragraph}
                    </p>
                  ))}
                  <dl className="ftp-dl2">
                    <dt>{ui.details.year}</dt>
                    <dd>{activeProject.year}</dd>
                    {activeProject.madeFor && (
                      <>
                        <dt>{ui.details.madeFor}</dt>
                        <dd>{activeProject.madeFor}</dd>
                      </>
                    )}
                    {activeProject.role && (
                      <>
                        <dt>{ui.details.role}</dt>
                        <dd>{activeProject.role}</dd>
                      </>
                    )}
                    {activeProject.tools && activeProject.tools.length > 0 && (
                      <>
                        <dt>{ui.details.tools}</dt>
                        <dd>{activeProject.tools.join(" · ")}</dd>
                      </>
                    )}
                  </dl>
                </div>
                <div className="ftp-modal-nav">
                  <div className="ftp-btns">
                    <button
                      type="button"
                      className="ftp-btn"
                      data-ghost="true"
                      onClick={() => stepProject(-1)}
                      aria-label={ui.previousProject}
                    >
                      <Arrow dir="left" />
                    </button>
                    <button
                      type="button"
                      className="ftp-btn"
                      data-ghost="true"
                      onClick={() => stepProject(1)}
                      aria-label={ui.nextProject}
                    >
                      <Arrow />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Folder>
        </div>
      )}
      {toast && (
        <div key={toast.id} className="ftp-toast" role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}
