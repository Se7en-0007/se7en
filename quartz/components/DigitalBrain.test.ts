import { test } from "node:test"
import assert from "node:assert/strict"
import { h } from "preact"
import { FullSlug, FilePath } from "../util/path"
import { render } from "preact-render-to-string"
import { DigitalBrain, publicNotes } from "./DigitalBrain"
import { QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"

function note(slug: string, extra: Record<string, unknown> = {}): QuartzPluginData {
  return {
    slug: slug as FullSlug,
    filePath: `content/${slug}.md` as FilePath,
    frontmatter: { title: slug, tags: [] },
    ...extra,
  } as QuartzPluginData
}

test("homepage discovery excludes hidden and encrypted metadata", () => {
  const visible = note("visible")
  const files = [
    visible,
    note("index"),
    note("folder/index"),
    note("tags/topic"),
    note("hidden", { unlisted: true }),
    note("protected", { encrypted: true }),
    note("draft", { frontmatter: { title: "Secret", draft: true } }),
    note("password", { frontmatter: { title: "Secret", password: "test" } }),
    note("frontmatter-hidden", { frontmatter: { title: "Secret", unlisted: true } }),
  ]
  assert.deepEqual(publicNotes(files), [visible])
})

test("homepage renders real metadata with canonical folder/tag links and escapes titles", () => {
  const html = render(
    h(DigitalBrain, {
      fileData: note("index"),
      cfg: { locale: "en-US" },
      allFiles: [
        note("1.-standard-books/first", {
          frontmatter: { title: "<script>unsafe</script>", tags: ["history/modern"] },
          dates: { modified: new Date("2026-09-08T00:00:00Z") },
        }),
        note("secret", {
          encrypted: true,
          frontmatter: { title: "Secret title", tags: ["secret-tag"] },
        }),
      ],
    } as QuartzComponentProps),
  )
  assert.match(html, /href="\.\/1\.-standard-books\/"/)
  assert.match(html, /href="\.\/tags\/history\/modern"/)
  assert.match(html, /&lt;script>unsafe&lt;\/script>/)
  assert.match(html, /1 note</)
  assert.doesNotMatch(html, /Secret title|secret-tag/)
  assert.match(html, /datetime="2026-09-08T00:00:00.000Z"/)
})

test("note pages do not render the homepage", () => {
  assert.equal(render(h(DigitalBrain, { fileData: note("a-note") } as QuartzComponentProps)), "")
})
