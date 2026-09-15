import { QuartzComponent, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
// @ts-expect-error Quartz bundles inline scripts as strings.
import script from "./scripts/pyq.inline"
import style from "./styles/pyq.scss"

export const PyqSearch: QuartzComponent = ({ fileData }: QuartzComponentProps) => (
  <section
    class="pyq-library"
    data-pyq-src={resolveRelative(fileData.slug!, "static/pyqs/questions.json" as FullSlug)}
  >
    <header class="pyq-heading">
      <p class="pyq-kicker">SE7EN · QUESTION BANK</p>
      <h1>PYQs</h1>
      <p>
        Search a topic across Prelims and Mains. Questions can belong to more than one subject or
        topic.
      </p>
    </header>
    <form class="pyq-form" role="search" aria-label="Search previous year questions">
      <label for="pyq-query">Search PYQs</label>
      <div class="pyq-search-row">
        <input
          id="pyq-query"
          type="search"
          name="q"
          placeholder="Try fundamental rights, forests, inflation…"
          autocomplete="off"
          maxlength={240}
        />
        <button type="submit">Search</button>
      </div>
      <div class="pyq-filters">
        <label>
          Exam
          <select name="stage">
            <option value="">Prelims &amp; Mains</option>
            <option>Prelims</option>
            <option>Mains</option>
          </select>
        </label>
        <label>
          Paper
          <select name="paper">
            <option value="">All papers</option>
          </select>
        </label>
        <label>
          Year
          <select name="year">
            <option value="">All years</option>
          </select>
        </label>
        <label>
          Subject
          <select name="subject">
            <option value="">All subjects</option>
          </select>
        </label>
        <label>
          Topic
          <select name="topic">
            <option value="">All topics</option>
          </select>
        </label>
        <label>
          Order
          <select name="sort">
            <option value="relevance">Most relevant</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      <div class="pyq-form-footer">
        <button type="reset" class="pyq-reset">
          Clear filters
        </button>
        <span>Topic tags include overlaps across subjects.</span>
      </div>
    </form>
    <div class="pyq-status" role="status" aria-live="polite">
      Loading the question bank…
    </div>
    <div class="pyq-results" aria-label="Question results" aria-busy="true"></div>
    <button class="pyq-more" type="button" hidden>
      Show more questions
    </button>
    <noscript>
      <p>
        Enable JavaScript to search the question bank. The rest of the notes remain available
        through the Explorer.
      </p>
    </noscript>
  </section>
)
PyqSearch.afterDOMLoaded = script
PyqSearch.css = style

export const PyqHelp: QuartzComponent = () => (
  <aside class="pyq-help">
    <h3>Browse by topic</h3>
    <p>A question on forest rights can appear under Environment, Polity and Society.</p>
    <p>Select a topic chip on any result to explore that topic across years and papers.</p>
    <hr />
    <p>
      <strong>Prelims GS</strong>
      <br />
      2008–2026
    </p>
    <p>
      <strong>Mains GS I–IV</strong>
      <br />
      2013–2025
    </p>
    <p>
      <strong>Essay</strong>
      <br />
      2021–2025
    </p>
  </aside>
)
