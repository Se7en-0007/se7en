import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { indexPyqs, searchPyqs, emptyPyqFilters, type PyqData } from "./pyq"
const data: PyqData = JSON.parse(
  fs.readFileSync(new URL("../static/pyqs/questions.json", import.meta.url), "utf8"),
)
const index = indexPyqs(data)
const search = (query: string, extra = {}) =>
  searchPyqs(index, { ...emptyPyqFilters, query, ...extra })

test("all supplied question records survive extraction with valid years and provenance", () => {
  assert.equal(data.questions.length, 3086)
  assert.equal(new Set(data.questions.map((q) => q.id)).size, data.questions.length)
  assert.equal(data.questions.filter((q) => q.stage === "Prelims").length, 1994)
  assert.equal(data.questions.filter((q) => q.kind === "Case study").length, 78)
  assert.equal(data.questions.filter((q) => q.paper === "Essay").length, 40)
  for (const q of data.questions) {
    assert.ok(q.text.trim().length > 10, q.id)
    assert.ok(
      q.year >= (q.stage === "Prelims" ? 2008 : 2013) &&
        q.year <= (q.stage === "Prelims" ? 2026 : 2025),
      q.id,
    )
    assert.ok(
      q.sourcePages.every((p) => p >= 1 && p <= (q.stage === "Prelims" ? 210 : 122)),
      q.id,
    )
    assert.doesNotMatch(
      q.text,
      /Copyright ©|Ground Floor, Apsara|MAINS MICROTHEMES|\[Microtheme\]/,
      q.id,
    )
    if (q.stage === "Prelims")
      assert.ok(q.options?.length === 4 || q.flags?.some((f) => f.includes("option")), q.id)
  }
})
test("a forest rights question is discoverable under overlapping topics and subjects", () => {
  const q = data.questions.find(
    (q) => q.topics.includes("forest-rights") && q.topics.includes("tribal-rights"),
  )!
  assert.ok(q)
  for (const subject of ["Polity", "Environment", "Society"]) {
    assert.ok(
      search("forest rights", { subject }).some((r) => r.id === q.id),
      subject,
    )
  }
  assert.ok(search("", { topic: "tribal-rights" }).some((r) => r.id === q.id))
})
test("topic searches cross exam stages and understand abbreviations", () => {
  const rights = search("fundamental rights")
  assert.ok(rights.some((q) => q.stage === "Prelims"))
  assert.ok(rights.some((q) => q.stage === "Mains"))
  const dpsp = search("DPSP")
  assert.ok(dpsp.some((q) => /Directive Principles/i.test(q.text)))
})
test("filters combine and invalid combinations cannot leak other years or papers", () => {
  const results = search("", { stage: "Mains", paper: "GS II", year: "2025" })
  assert.ok(results.length > 0)
  assert.ok(results.every((q) => q.stage === "Mains" && q.paper === "GS II" && q.year === 2025))
  assert.deepEqual(search("", { stage: "Prelims", paper: "GS II" }), [])
  assert.deepEqual(search("", { paper: "Essay", year: "2018" }), [])
})
test("typos are tolerated without turning unrelated phrases into matches", () => {
  assert.ok(search("fundmental rights").length > 0)
  assert.equal(search("zzzznotarealtopic zzzzmissingterm").length, 0)
  assert.equal(search("<script>zzzzmissingterm</script>").length, 0)
})
test("year sorting is numeric and keeps one result per question", () => {
  const old = search("", { sort: "oldest" })
  const recent = search("", { sort: "newest" })
  assert.equal(old[0].year, 2008)
  assert.equal(recent[0].year, 2026)
  assert.equal(new Set(recent.map((q) => q.id)).size, recent.length)
})
