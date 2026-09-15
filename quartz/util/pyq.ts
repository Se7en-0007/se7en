export interface PyqTopic {
  id: string
  label: string
  subjects: string[]
  aliases: string[]
}
export interface PyqQuestion {
  id: string
  stage: "Prelims" | "Mains"
  paper: string
  year: number
  text: string
  subject: string
  subjects: string[]
  microthemes: string[]
  topics: string[]
  sourcePages: number[]
  options?: string[]
  answer?: string | null
  marks?: number | null
  kind?: string
  flags?: string[]
}
export interface PyqData {
  version: number
  updated: string
  questions: PyqQuestion[]
  topics: PyqTopic[]
  sources: { id: string; name: string; years: string; papers: string; pages: number }[]
}
export interface PyqFilters {
  query: string
  stage: string
  paper: string
  year: string
  subject: string
  topic: string
  sort: string
}
export const normalizePyq = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
export const emptyPyqFilters: PyqFilters = {
  query: "",
  stage: "",
  paper: "",
  year: "",
  subject: "",
  topic: "",
  sort: "relevance",
}
const stop = new Set([
  "the",
  "a",
  "an",
  "of",
  "on",
  "in",
  "and",
  "for",
  "pyq",
  "pyqs",
  "questions",
  "question",
])
export function indexPyqs(data: PyqData) {
  const topics = new Map(data.topics.map((t) => [t.id, t]))
  return data.questions.map((question) => {
    const topicText = question.topics.flatMap((id) => topics.get(id)?.aliases ?? []).join(" ")
    const stem = normalizePyq(question.text)
    const context = normalizePyq(
      [...question.microthemes, ...question.subjects, topicText].join(" "),
    )
    const full = `${stem} ${context} ${normalizePyq(question.options?.join(" ") ?? "")}`
    return { question, stem, context, full, words: [...new Set(full.split(" "))] }
  })
}
// A single missed/extra character in a longer term may still match. Never fuzzy-match years or short acronyms.
function near(a: string, b: string): boolean {
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false
  let i = 0,
    j = 0,
    errors = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++
      j++
      continue
    }
    if (++errors > 1) return false
    if (a.length >= b.length) i++
    if (b.length >= a.length) j++
  }
  return errors + (a.length - i) + (b.length - j) <= 1
}
export function searchPyqs(index: ReturnType<typeof indexPyqs>, filters: PyqFilters) {
  const phrase = normalizePyq(filters.query)
  const terms = phrase.split(" ").filter((x) => x && !stop.has(x))
  return index
    .flatMap((entry) => {
      const q = entry.question
      if (
        (filters.stage && q.stage !== filters.stage) ||
        (filters.paper && q.paper !== filters.paper) ||
        (filters.year && q.year !== Number(filters.year)) ||
        (filters.subject && !q.subjects.includes(filters.subject)) ||
        (filters.topic && !q.topics.includes(filters.topic))
      )
        return []
      let score = 0
      for (const term of terms) {
        const exact = (text: string) =>
          text.split(" ").some((w) => w === term || (term.length >= 3 && w.startsWith(term)))
        if (exact(entry.stem)) score += 8
        else if (exact(entry.context)) score += 6
        else if (exact(entry.full)) score += 2
        else if (entry.words.some((w) => near(term, w))) score += 1
        else return []
      }
      if (phrase && entry.stem.includes(phrase)) score += 12
      return [{ question: q, score }]
    })
    .sort((a, b) => {
      if (filters.sort === "oldest")
        return a.question.year - b.question.year || a.question.id.localeCompare(b.question.id)
      if (filters.sort === "newest")
        return b.question.year - a.question.year || a.question.id.localeCompare(b.question.id)
      return (
        b.score - a.score ||
        b.question.year - a.question.year ||
        a.question.id.localeCompare(b.question.id)
      )
    })
    .map((r) => r.question)
}
