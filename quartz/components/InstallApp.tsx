import { QuartzComponent } from "./types"

export const InstallApp: QuartzComponent = () => {
  return (
    <section class="pwa-install" aria-label="Install SE7EN">
      <div>
        <strong>Keep SE7EN within reach</strong>
        <span>Install the library for a focused, app-like reading experience.</span>
      </div>
      <button class="pwa-install-button" type="button">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <path d="M9 18h6M12 6v7m0 0 3-3m-3 3-3-3" />
        </svg>
        <span>Install App</span>
      </button>
      <span class="pwa-install-status" role="status" aria-live="polite"></span>
    </section>
  )
}

InstallApp.afterDOMLoaded = `
let se7enInstallPrompt

const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true

const setupInstallButton = () => {
  document.querySelectorAll(".pwa-install-button").forEach((button) => {
    const panel = button.closest(".pwa-install")
    const status = panel?.querySelector(".pwa-install-status")

    if (isInstalled()) {
      panel?.classList.add("is-installed")
      return
    }

    if (button.dataset.ready === "true") return
    button.dataset.ready = "true"
    const controller = new AbortController()

    button.addEventListener("click", async () => {
      if (se7enInstallPrompt) {
        se7enInstallPrompt.prompt()
        const choice = await se7enInstallPrompt.userChoice
        if (status) status.textContent = choice.outcome === "accepted" ? "Installing…" : "Installation cancelled."
        se7enInstallPrompt = undefined
      } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        if (status) status.textContent = "Tap Share, then Add to Home Screen."
      } else {
        if (status) status.textContent = "Open your browser menu and choose Install app or Add to Home screen."
      }
    }, { signal: controller.signal })
    window.addCleanup?.(() => controller.abort())
  })
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault()
  se7enInstallPrompt = event
  setupInstallButton()
})

window.addEventListener("appinstalled", () => {
  se7enInstallPrompt = undefined
  document.querySelectorAll(".pwa-install").forEach((panel) => panel.classList.add("is-installed"))
})

if ("serviceWorker" in navigator) {
  const basePath = document.body.dataset.basepath || ""
  navigator.serviceWorker.register(basePath + "/sw.js")
}

document.addEventListener("nav", setupInstallButton)
setupInstallButton()
`
