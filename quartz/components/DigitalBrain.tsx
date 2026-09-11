import { QuartzComponent, QuartzComponentProps } from "./types"
import { FullSlug, FilePath, resolveRelative, slugifyFilePath, slugTag } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date as NoteDate } from "./Date"

const subjects = [
  {
    folder: "1. Standard Books",
    title: "Standard Books",
    detail: "The foundations, distilled for revision.",
    mark: "01",
    image: "static/subject-books.jpg",
  },
  {
    folder: "2. Anthropology",
    title: "Anthropology",
    detail: "Human origins. Culture. Connections.",
    mark: "02",
    image: "static/subject-anthropology.jpg",
  },
  {
    folder: "3. Current Affairs",
    title: "Current Affairs",
    detail: "Making sense of a changing world.",
    mark: "03",
    image: "static/subject-current-affairs.jpg",
  },
  {
    folder: "4. Class Notes",
    title: "Class Notes",
    detail: "From the classroom to lasting knowledge.",
    mark: "04",
    image: "static/subject-class-notes.jpg",
  },
]

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
  return (
    <div class="digital-brain">
      <div class="brain-topline">
        <span>PERSONAL KNOWLEDGE SPACE</span>
        <span class="brain-status">Always growing</span>
      </div>
      <section class="brain-hero" aria-labelledby="brain-title">
        <img
          class="brain-mountains"
          src={href("static/se7en-sanchi-hero.jpg" as FullSlug)}
          alt="The Great Stupa at Sanchi at sunrise"
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
                <div class="brain-card-image">
                  <img src={href(subject.image as FullSlug)} alt="" loading="lazy" />
                  <span class="brain-number">{subject.mark}</span>
                </div>
                <div class="brain-card-copy">
                  <h3>{subject.title}</h3>
                  <p>{subject.detail}</p>
                  <div class="brain-card-bottom">
                    <span>
                      {count} {count === 1 ? "note" : "notes"}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>
      <div class="brain-stats" aria-label="Library statistics">
        {[
          [notes.length, "Notes collected"],
          [tagCounts.size, "Tags to explore"],
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
              <span class="brain-link-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.8 3.2 18.6 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.1 12.8l-4.8-1.5c-1.1-.3-1.1-1.1.2-1.6L20.3 2.5c.9-.3 1.7.2 1.5.7Z" />
                </svg>
                Join the Telegram community
              </span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/Se7en-0007/se7en" target="_blank" rel="noopener noreferrer">
              <span class="brain-link-label">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.3-.3-4.7-1.1-4.7-5A3.9 3.9 0 0 1 6.8 8.6a3.6 3.6 0 0 1 .1-2.8s.8-.3 2.8 1.1a9.5 9.5 0 0 1 5.1 0c2-1.4 2.8-1.1 2.8-1.1a3.6 3.6 0 0 1 .1 2.8 3.9 3.9 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 2v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                </svg>
                Notes on GitHub
              </span>
              <span aria-hidden="true">↗</span>
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
