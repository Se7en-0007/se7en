import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"
import { DigitalBrain, BrainHomeNav } from "./quartz/components/DigitalBrain"

const config = await loadQuartzConfig()
export const layout = await loadQuartzLayout()

// Extend the YAML-resolved content layout; leave native page bodies intact.
const contentLayout = layout.byPageType.content ?? layout.defaults
contentLayout.beforeBody = [...(contentLayout.beforeBody ?? []), DigitalBrain]
contentLayout.right = [BrainHomeNav, ...(contentLayout.right ?? [])]
layout.byPageType.content = contentLayout

// v5 creates its dispatcher inside loadQuartzConfig, before TS overrides run.
// Replace that instance so both rendering and resource collection use this layout.
config.plugins.emitters = config.plugins.emitters.map((emitter) =>
  emitter.name === "PageTypeDispatcher" ? PageTypeDispatcher(layout) : emitter,
)
export default config
