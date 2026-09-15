import {
  emptyPyqFilters,
  indexPyqs,
  searchPyqs,
  type PyqData,
  type PyqQuestion,
} from "../../util/pyq"

let bankPromise: Promise<PyqData> | undefined
const activeRoots = new WeakSet<HTMLElement>()
const fields = ["stage", "paper", "year", "subject", "topic", "sort"] as const

function setupPyqs() {
  const root = document.querySelector<HTMLElement>(".pyq-library")
  if (!root || activeRoots.has(root)) return
  activeRoots.add(root)
  const controller = new AbortController()
  const signal = controller.signal
  let timer: ReturnType<typeof setTimeout> | undefined
  window.addCleanup(() => {
    controller.abort()
    clearTimeout(timer)
    activeRoots.delete(root)
  })
  const form = root.querySelector<HTMLFormElement>(".pyq-form")!
  const query = form.querySelector<HTMLInputElement>("#pyq-query")!
  const results = root.querySelector<HTMLElement>(".pyq-results")!
  const status = root.querySelector<HTMLElement>(".pyq-status")!
  const more = root.querySelector<HTMLButtonElement>(".pyq-more")!
  const select = (name: string) => form.querySelector<HTMLSelectElement>(`select[name="${name}"]`)!
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
    const node = document.createElement(tag)
    if (text !== undefined) node.textContent = text
    if (cls) node.className = cls
    return node
  }
  const load = () => {
    if (!bankPromise)
      bankPromise = fetch(root.dataset.pyqSrc!)
        .then((response) => {
          if (!response.ok) throw new Error("Question bank unavailable")
          return response.json()
        })
        .then((data: PyqData) => {
          if (data.version !== 1 || !Array.isArray(data.questions) || !Array.isArray(data.topics))
            throw new Error("Invalid question bank")
          return data
        })
        .catch((error) => {
          bankPromise = undefined
          throw error
        })
    return bankPromise
  }
  form
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>(
      "input, select, button",
    )
    .forEach((control) => (control.disabled = true))
  load()
    .then((data) => {
      if (signal.aborted) return
      const index = indexPyqs(data)
      const topicById = new Map(data.topics.map((topic) => [topic.id, topic]))
      const filters = { ...emptyPyqFilters }
      const params = new URLSearchParams(location.search)
      query.value = (params.get("q") ?? "").slice(0, 240)
      const fill = (name: string, values: { value: string; label: string }[]) => {
        const control = select(name)
        const previous = control.value
        control.replaceChildren(control.options[0])
        for (const value of values) {
          const option = el("option", value.label)
          option.value = value.value
          control.append(option)
        }
        control.value = values.some((item) => item.value === previous) ? previous : ""
      }
      const simple = (values: string[]) => values.map((value) => ({ value, label: value }))
      fill("subject", simple([...new Set(data.questions.flatMap((q) => q.subjects))].sort()))
      fill(
        "topic",
        data.topics
          .filter((t) => data.questions.some((q) => q.topics.includes(t.id)))
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((t) => ({ value: t.id, label: t.label })),
      )
      const dependentFilters = () => {
        const scope = data.questions.filter(
          (q) => !select("stage").value || q.stage === select("stage").value,
        )
        fill("paper", simple([...new Set(scope.map((q) => q.paper))].sort()))
        fill(
          "year",
          simple([...new Set(scope.map((q) => q.year))].sort((a, b) => b - a).map(String)),
        )
      }
      select("stage").value = params.get("stage") ?? ""
      dependentFilters()
      for (const field of fields) {
        const control = select(field)
        const value = params.get(field)
        if (value && [...control.options].some((o) => o.value === value)) control.value = value
      }
      let matches: PyqQuestion[] = []
      let visible = 0
      const pageSize = 24
      const renderCard = (q: PyqQuestion) => {
        const card = el("article", undefined, "pyq-card")
        card.id = q.id
        const meta = el("div", undefined, "pyq-card-meta")
        meta.append(
          el("span", String(q.year), "pyq-year"),
          el("span", `${q.stage} · ${q.paper === "GS" ? "GS" : q.paper}`),
        )
        if (q.kind) meta.append(el("span", q.kind))
        if (q.marks) meta.append(el("span", `${q.marks} marks`))
        card.append(meta, el("p", q.text, "pyq-question"))
        if (q.options?.length) {
          const options = el("ol", undefined, "pyq-options")
          options.type = "A"
          for (const option of q.options) options.append(el("li", option))
          card.append(options)
        }
        const topics = el("div", undefined, "pyq-topics")
        topics.setAttribute("aria-label", "Related topics")
        for (const id of q.topics) {
          const topic = topicById.get(id)
          if (!topic) continue
          const button = el("button", topic.label)
          button.type = "button"
          button.dataset.topic = id
          button.setAttribute("aria-label", `Find questions about ${topic.label}`)
          topics.append(button)
        }
        if (q.topics.length) card.append(topics)
        const details = el("details", undefined, "pyq-source")
        details.append(el("summary", "Source & answer"))
        const source = data.sources.find((s) => s.id === q.stage.toLowerCase())!
        details.append(
          el(
            "p",
            `${source.name} · ${q.sourcePages.length === 1 ? "page" : "pages"} ${q.sourcePages.join(", ")}.`,
          ),
        )
        details.append(
          el(
            "p",
            `Source microtheme${q.microthemes.length > 1 ? "s" : ""}: ${q.microthemes.join("; ") || q.subject}.`,
          ),
        )
        if (q.stage === "Prelims")
          details.append(
            el(
              "p",
              q.answer
                ? `Answer in compilation: ${q.answer}. Not independently verified against UPSC.`
                : "No answer key is supplied for this question.",
            ),
          )
        if (q.flags?.some((f) => !f.startsWith("No answer"))) {
          const warning = el(
            "p",
            q.flags.filter((f) => !f.startsWith("No answer")).join(" "),
            "pyq-source-warning",
          )
          card.append(warning)
        }
        card.append(details)
        return card
      }
      const append = () => {
        const next = matches.slice(visible, visible + pageSize)
        const fragment = document.createDocumentFragment()
        next.forEach((q) => fragment.append(renderCard(q)))
        results.append(fragment)
        visible += next.length
        more.hidden = visible >= matches.length
        more.textContent = `Show ${Math.min(pageSize, matches.length - visible)} more questions`
        const pre = matches.filter((q) => q.stage === "Prelims").length
        status.textContent = `${matches.length.toLocaleString()} matching questions · ${pre.toLocaleString()} Prelims · ${(matches.length - pre).toLocaleString()} Mains${matches.length ? ` · Showing ${visible.toLocaleString()}` : ""}`
      }
      const render = (updateUrl = true) => {
        filters.query = query.value.trim()
        for (const field of fields) filters[field] = select(field).value
        matches = searchPyqs(index, filters)
        visible = 0
        results.replaceChildren()
        append()
        if (!matches.length)
          results.append(
            el(
              "p",
              "No questions match these filters. Try a broader topic or clear the year and paper filters.",
              "pyq-empty",
            ),
          )
        results.setAttribute("aria-busy", "false")
        if (updateUrl) {
          const url = new URL(location.href)
          url.search = ""
          if (filters.query) url.searchParams.set("q", filters.query)
          for (const field of fields)
            if (filters[field] && filters[field] !== emptyPyqFilters[field])
              url.searchParams.set(field, filters[field])
          history.replaceState(history.state, "", url)
        }
      }
      form
        .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>(
          "input, select, button",
        )
        .forEach((control) => (control.disabled = false))
      form.addEventListener(
        "submit",
        (event) => {
          event.preventDefault()
          clearTimeout(timer)
          render()
        },
        { signal },
      )
      query.addEventListener(
        "input",
        () => {
          clearTimeout(timer)
          timer = setTimeout(() => render(), 200)
        },
        { signal },
      )
      form.addEventListener(
        "change",
        (event) => {
          clearTimeout(timer)
          if (event.target === select("stage")) dependentFilters()
          render()
        },
        { signal },
      )
      form.addEventListener(
        "reset",
        (event) => {
          event.preventDefault()
          clearTimeout(timer)
          query.value = ""
          for (const field of fields) select(field).value = emptyPyqFilters[field]
          dependentFilters()
          render()
          query.focus()
        },
        { signal },
      )
      results.addEventListener(
        "click",
        (event) => {
          const button = (event.target as Element).closest<HTMLButtonElement>("button[data-topic]")
          if (!button) return
          clearTimeout(timer)
          query.value = ""
          select("topic").value = button.dataset.topic!
          render()
          form.scrollIntoView({ block: "start", behavior: "smooth" })
        },
        { signal },
      )
      more.addEventListener("click", append, { signal })
      render(false)
    })
    .catch(() => {
      if (signal.aborted) return
      status.textContent =
        "The question bank couldn’t load. Please check your connection and retry."
      results.setAttribute("aria-busy", "false")
      const retry = el("button", "Retry loading questions")
      retry.type = "button"
      retry.addEventListener(
        "click",
        () => {
          controller.abort()
          activeRoots.delete(root)
          retry.remove()
          setupPyqs()
        },
        { once: true },
      )
      results.replaceChildren(retry)
    })
}
document.addEventListener("nav", setupPyqs)
