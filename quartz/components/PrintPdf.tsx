import { QuartzComponent, QuartzComponentProps } from "./types"

export const PrintPdf: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (!fileData.slug || fileData.slug === "index") return null

  return (
    <div class="note-export-bar">
      <nav class="note-brand-links" aria-label="SE7EN links">
        <a href="https://se7en-0007.github.io/se7en/">Site</a>
        <a href="https://t.me/SE7ENxUPSC">Telegram</a>
      </nav>
      <button
        class="note-pdf-button"
        type="button"
        title='For a clean PDF, turn off "Headers and footers" in the print settings.'
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
          <path d="M5 20h14" />
        </svg>
        <span>Download PDF</span>
      </button>
    </div>
  )
}

PrintPdf.afterDOMLoaded = `
const setupPrintPdf = () => {
  document.querySelectorAll(".note-pdf-button").forEach((button) => {
    if (button.dataset.ready === "true") return
    button.dataset.ready = "true"
    const controller = new AbortController()

    const exportBar = button.closest(".note-export-bar")
    const brandLinks = exportBar?.querySelector(".note-brand-links")
    const tagList = document.querySelector(".page-header .tags")
    if (brandLinks && tagList) {
      const brandItem = document.createElement("li")
      brandItem.className = "note-brand-item"
      brandItem.append(brandLinks)
      tagList.append(brandItem)
    }

    button.addEventListener("click", () => {
      const oldTitle = document.title
      const heading = document.querySelector(".article-title")?.textContent?.trim()
      if (heading) document.title = heading + " - SE7EN"

      try {
        window.print()
      } finally {
        document.title = oldTitle
      }
    }, { signal: controller.signal })
    window.addCleanup?.(() => controller.abort())
  })
}

document.addEventListener("nav", setupPrintPdf)
setupPrintPdf()
`
