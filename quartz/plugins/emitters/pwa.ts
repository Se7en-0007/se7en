import fs from "fs"
import { join } from "path"
import { FilePath } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"

const appScope = (baseUrl?: string) => {
  if (!baseUrl) return "/"
  const pathname = new URL(`https://${baseUrl}`).pathname.replace(/\/$/, "")
  return `${pathname || ""}/`
}

export const Pwa: QuartzEmitterPlugin = () => ({
  name: "Pwa",
  async *emit({ argv, cfg }) {
    const scope = appScope(cfg.configuration.baseUrl)
    const manifestPath = join(argv.output, "manifest.webmanifest") as FilePath
    const serviceWorkerPath = join(argv.output, "sw.js") as FilePath
    const manifest = {
      name: "SE7EN Digital Knowledge Base",
      short_name: "SE7EN",
      description: "A focused digital library for learning, connecting and revisiting knowledge.",
      id: scope,
      start_url: scope,
      scope,
      display: "standalone",
      background_color: "#f8f6f0",
      theme_color: "#242331",
      icons: [
        {
          src: `${scope}static/icon-192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: `${scope}static/icon-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    }
    const serviceWorker = `
const CACHE_NAME = "se7en-library-v1"
const APP_ROOT = ${JSON.stringify(scope)}
const PRECACHE = [APP_ROOT, APP_ROOT + "manifest.webmanifest", APP_ROOT + "static/icon-192.png", APP_ROOT + "static/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_ROOT)) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        }
        return response
      })
      .catch(async () => (await caches.match(event.request)) || (await caches.match(APP_ROOT))),
  )
})
`

    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
    await fs.promises.writeFile(serviceWorkerPath, serviceWorker.trimStart())
    yield manifestPath
    yield serviceWorkerPath
  },
  async *partialEmit() {},
})
