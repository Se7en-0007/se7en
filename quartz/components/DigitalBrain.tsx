import { QuartzComponent, QuartzComponentProps } from "./types"
import {
  FullSlug,
  FilePath,
  resolveRelative,
  slugifyFilePath,
  slugTag,
  simplifySlug,
} from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date as NoteDate } from "./Date"

const subjects = [
  {
    folder: "1. Standard Books",
    title: "Standard Books",
    detail: "The foundations, distilled for revision.",
    mark: "01",
    icon: "book",
  },
  {
    folder: "2. Anthropology",
    title: "Anthropology",
    detail: "Human origins. Culture. Connections.",
    mark: "02",
    icon: "people",
  },
  {
    folder: "3. Current Affairs",
    title: "Current Affairs",
    detail: "Making sense of a changing world.",
    mark: "03",
    icon: "globe",
  },
  {
    folder: "4. Class Notes",
    title: "Class Notes",
    detail: "From the classroom to lasting knowledge.",
    mark: "04",
    icon: "notes",
  },
]

function Icon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    book: "M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1m0-14c3-2 6-2 9-1v14c-3-1-6-1-9 1V6",
    people:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-7a4 4 0 0 1 0 7",
    globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
    notes: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6v6h6M8 13h8m-8 4h6",
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
    </svg>
  )
}

// allFiles has already passed Quartz's publishing filters. Also omit discovery-hidden
// and protected pages, including their titles, tags and counts, from public widgets.
export function publicNotes(files: QuartzPluginData[]) {
  return files.filter(
    (file) =>
      file.slug &&
      file.slug !== "index" &&
      !file.slug.endsWith("/index") &&
      !file.slug.startsWith("tags/") &&
      file.slug !== "tags" &&
      file.unlisted !== true &&
      file.frontmatter?.unlisted !== true &&
      !file.frontmatter?.draft &&
      !file.frontmatter?.password &&
      !file.encrypted &&
      file.filePath?.endsWith(".md"),
  )
}

const modified = (file: QuartzPluginData) => file.dates?.modified ?? file.dates?.created

export const DigitalBrain: QuartzComponent = ({
  fileData,
  allFiles,
  cfg,
}: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null
  const notes = publicNotes(allFiles)
  const href = (slug: FullSlug) => resolveRelative(fileData.slug!, slug)
  const tagCounts = new Map<string, number>()
  notes.forEach((note) =>
    new Set(note.frontmatter?.tags ?? []).forEach((tag) =>
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1),
    ),
  )
  const tags = [...tagCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const recent = [...notes]
    .sort(
      (a, b) =>
        (modified(b)?.getTime() ?? 0) - (modified(a)?.getTime() ?? 0) ||
        (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? ""),
    )
    .slice(0, 5)
  const links = notes.reduce(
    (sum, note) =>
      sum +
      (note.links?.filter((slug) =>
        notes.some((target) => target.slug && simplifySlug(target.slug) === slug),
      ).length ?? 0),
    0,
  )
  return (
    <div class="digital-brain">
      <div class="brain-topline">
        <span>PERSONAL KNOWLEDGE SPACE</span>
        <span class="brain-status">Always growing</span>
      </div>
      <section class="brain-hero" aria-labelledby="brain-title">
        <img
          class="brain-mountains"
          src={href("static/se7en-mountain-hero.jpg" as FullSlug)}
          alt=""
          width="1800"
          height="700"
          fetchPriority="high"
        />
        <div class="brain-hero-content">
          <span class="brain-eyebrow">SE7EN / DIGITAL BRAIN</span>
          <h1 id="brain-title">
            A place to connect
            <br />
            what I learn<span>.</span>
          </h1>
          <p>
            Notes, ideas &amp; connections.
            <br />
            One evolving journey of understanding.
          </p>
          <a class="brain-cta" href="#subjects">
            Explore the library <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span class="brain-hero-caption">LEARN · CONNECT · REVISIT</span>
      </section>
      <section class="brain-section" aria-labelledby="subjects">
        <div class="brain-section-heading">
          <h2 id="subjects">Explore the library</h2>
          <span>Four paths. One connected mind.</span>
        </div>
        <div class="brain-subjects">
          {subjects.map((subject) => {
            const folderSlug = slugifyFilePath(`${subject.folder}/index.md` as FilePath)
            const prefix = folderSlug.replace(/index$/, "")
            const count = notes.filter((note) => note.slug?.startsWith(prefix)).length
            return (
              <a class={`internal brain-subject subject-${subject.mark}`} href={href(folderSlug)}>
                <div class="brain-card-top">
                  <span class="brain-icon">
                    <Icon kind={subject.icon} />
                  </span>
                  <span class="brain-number">{subject.mark}</span>
                </div>
                <h3>{subject.title}</h3>
                <p>{subject.detail}</p>
                <div class="brain-card-bottom">
                  <span>
                    {count} {count === 1 ? "note" : "notes"}
                  </span>
                  <span aria-hidden="true">↗</span>
                </div>
              </a>
            )
          })}
        </div>
      </section>
      <div class="brain-stats" aria-label="Library statistics">
        {[
          [notes.length, "Notes collected"],
          [subjects.length, "Subject areas"],
          [tagCounts.size, "Tags to explore"],
          [links, "Note connections"],
        ].map(([value, label]) => (
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div class="brain-widgets">
        <section class="brain-panel brain-recent" aria-labelledby="recent-notes">
          <div class="brain-section-heading">
            <h2 id="recent-notes">Recently updated</h2>
            <span class="brain-dot" aria-hidden="true">
              ↗
            </span>
          </div>
          <ul>
            {recent.map((note) => (
              <li>
                <a class="internal" href={href(note.slug!)}>
                  {note.frontmatter?.title ?? note.slug}
                </a>
                <div class="brain-note-meta">
                  <span>
                    {subjects.find((subject) =>
                      note.slug?.startsWith(
                        slugifyFilePath(`${subject.folder}/index.md` as FilePath).replace(
                          /index$/,
                          "",
                        ),
                      ),
                    )?.title ?? "Notes"}
                  </span>
                  {modified(note) && <NoteDate date={modified(note)!} locale={cfg.locale} />}
                </div>
              </li>
            ))}
          </ul>
          {recent.length === 0 && <p>Your published notes will appear here.</p>}
        </section>
        <div class="brain-widget-stack">
          <section class="brain-panel" aria-labelledby="browse-tags">
            <h2 id="browse-tags">Follow a thread</h2>
            <div class="brain-tags">
              {tags.slice(0, 10).map(([tag, count]) => (
                <a class="internal tag-link" href={href(`tags/${slugTag(tag)}` as FullSlug)}>
                  {tag}
                  <span>{count}</span>
                </a>
              ))}
            </div>
            {tags.length === 0 && <p>Tags from your notes will appear here.</p>}
            {tags.length > 0 && (
              <a class="internal brain-text-link" href={href("tags/index" as FullSlug)}>
                Browse all tags <span aria-hidden="true">→</span>
              </a>
            )}
          </section>
          <section class="brain-panel brain-quick" aria-labelledby="quick-links">
            <h2 id="quick-links">Quick links</h2>
            <a href="https://t.me/SE7ENxUPSC" target="_blank" rel="noopener noreferrer">
              Join the Telegram community <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/Se7en-0007/se7en" target="_blank" rel="noopener noreferrer">
              Notes on GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href="#about-these-notes">
              About these notes <span aria-hidden="true">↓</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}

export const BrainHomeNav: QuartzComponent = ({ fileData }: QuartzComponentProps) =>
  fileData.slug === "index" ? (
    <nav class="brain-home-nav" aria-label="On this page">
      <h3>In this space</h3>
      <a href="#subjects">Explore the library</a>
      <a href="#recent-notes">Recently updated</a>
      <a href="#browse-tags">Follow a thread</a>
      <a href="#quick-links">Quick links</a>
      <a href="#about-these-notes">About these notes</a>
      <div class="brain-aside-note">
        <span>THE SE7EN APPROACH</span>
        <p>
          Collect with curiosity.
          <br />
          Connect with intention.
          <br />
          Return with perspective.
        </p>
      </div>
    </nav>
  ) : null
