import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"
import { DigitalBrain, BrainHomeNav } from "./quartz/components/DigitalBrain"
import { LibraryGraph } from "./quartz/components/LibraryGraph"
import { PrintPdf } from "./quartz/components/PrintPdf"
import { InstallApp } from "./quartz/components/InstallApp"
import { Pwa } from "./quartz/plugins/emitters/pwa"
import { FolderPage } from "@quartz-community/folder-page"
import type { QuartzPluginData } from "@quartz-community/types"

const config = await loadQuartzConfig()
config.plugins.emitters.push(Pwa())

const byNumber = (a: QuartzPluginData, b: QuartzPluginData) => {
  const aTitle = a.frontmatter?.title ?? a.slug ?? ""
  const bTitle = b.frontmatter?.title ?? b.slug ?? ""

  return aTitle.localeCompare(bTitle, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

config.plugins.pageTypes = (config.plugins.pageTypes ?? []).map((pageType) =>
  pageType.name === "FolderPage" ? FolderPage({ sort: byNumber }) : pageType,
)

export const layout = await loadQuartzLayout()

// Extend the YAML-resolved content layout; leave native page bodies intact.
const contentLayout = layout.byPageType.content ?? layout.defaults
contentLayout.beforeBody = [...(contentLayout.beforeBody ?? []), DigitalBrain, PrintPdf]
contentLayout.afterBody = [...(contentLayout.afterBody ?? []), InstallApp]
contentLayout.right = [BrainHomeNav, ...(contentLayout.right ?? []), LibraryGraph]
layout.byPageType.content = contentLayout

// v5 creates its dispatcher inside loadQuartzConfig, before TS overrides run.
// Replace that instance so both rendering and resource collection use this layout.
config.plugins.emitters = config.plugins.emitters.map((emitter) =>
  emitter.name === "PageTypeDispatcher" ? PageTypeDispatcher(layout) : emitter,
)
export default config
