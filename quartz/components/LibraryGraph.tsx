import { QuartzComponent, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { publicNotes } from "./DigitalBrain"

type TreeNode = {
  key: string
  label: string
  depth: number
  href?: FullSlug
  children: TreeNode[]
  x?: number
  y?: number
}

const byNumber = (a: TreeNode, b: TreeNode) =>
  a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" })

function libraryTree(allFiles: QuartzComponentProps["allFiles"]) {
  const root: TreeNode = { key: "SE7EN", label: "SE7EN", depth: 0, children: [] }
  for (const note of publicNotes(allFiles)) {
    const raw = (note.filePath ?? "").replace(/^content\//, "").replace(/\.md$/, "")
    const parts = raw.split("/").filter(Boolean)
    if (parts.length === 0) continue
    let parent = root
    parts.forEach((part, index) => {
      const isNote = index === parts.length - 1
      const key = parts.slice(0, index + 1).join("/")
      let child = parent.children.find((item) => item.key === key)
      if (!child) {
        child = {
          key,
          label: isNote ? (note.frontmatter?.title ?? part) : part,
          depth: index + 1,
          href: isNote ? note.slug : undefined,
          children: [],
        }
        parent.children.push(child)
      }
      parent = child
    })
  }

  const sort = (node: TreeNode) => {
    node.children.sort(byNumber)
    node.children.forEach(sort)
  }
  sort(root)
  return root
}

function layoutTree(root: TreeNode) {
  const nodes: TreeNode[] = []
  const edges: Array<[TreeNode, TreeNode]> = []
  const maxDepth = Math.max(1, ...walk(root).map((node) => node.depth))
  const leaves = walk(root).filter((node) => node.children.length === 0)
  let leafIndex = 0

  const place = (node: TreeNode): number => {
    let angle: number
    if (node.children.length === 0) {
      angle = (leafIndex++ / Math.max(leaves.length, 1)) * Math.PI * 2 - Math.PI / 2
    } else {
      const childAngles = node.children.map(place)
      angle = childAngles.reduce((sum, value) => sum + value, 0) / childAngles.length
    }
    const radius = node.depth === 0 ? 0 : 105 + ((node.depth - 1) / maxDepth) * 245
    node.x = 400 + Math.cos(angle) * radius
    node.y = 400 + Math.sin(angle) * radius
    nodes.push(node)
    node.children.forEach((child) => edges.push([node, child]))
    return angle
  }
  place(root)
  return { nodes, edges }
}

function walk(root: TreeNode): TreeNode[] {
  return [root, ...root.children.flatMap(walk)]
}

function GraphSvg({
  root,
  currentSlug,
  compact,
}: {
  root: TreeNode
  currentSlug: FullSlug
  compact: boolean
}) {
  const { nodes, edges } = layoutTree(root)
  return (
    <svg
      class={compact ? "library-graph-svg compact" : "library-graph-svg"}
      viewBox="0 0 800 800"
      role="img"
      aria-label="SE7EN library folder hierarchy"
    >
      <g class="library-graph-edges">
        {edges.map(([from, to]) => (
          <line data-from={from.key} data-to={to.key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
        ))}
      </g>
      <g class="library-graph-nodes">
        {nodes.map((node) => {
          const circle = (
            <>
              {node.href && (
                <circle class="library-node-hit" cx={node.x} cy={node.y} r="12">
                  <title>{node.label}</title>
                </circle>
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.depth === 0 ? 34 : node.children.length ? 8 : 3.2}
                class={`depth-${Math.min(node.depth, 4)}`}
              >
                <title>{node.label}</title>
              </circle>
              {(node.depth === 0 || (!compact && node.depth === 1)) && (
                <text
                  class={`depth-${Math.min(node.depth, 4)}`}
                  data-dy={node.depth === 0 ? 4 : 20}
                  x={node.x}
                  y={(node.y ?? 0) + (node.depth === 0 ? 4 : 20)}
                  text-anchor="middle"
                >
                  {node.depth === 0 ? "SE7EN" : node.label.replace(/^\d+\.\s*/, "")}
                </text>
              )}
            </>
          )
          const className = `library-graph-node${node.href ? " is-note" : ""}`
          return node.href ? (
            <a
              class={className}
              data-node-key={node.key}
              data-label={node.label}
              data-note="true"
              href={resolveRelative(currentSlug, node.href)}
            >
              {circle}
            </a>
          ) : (
            <g class={className} data-node-key={node.key} data-label={node.label}>
              {circle}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export const LibraryGraph: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  if (!fileData.slug) return null
  const root = libraryTree(allFiles)
  return (
    <section class="library-graph" aria-labelledby="library-graph-title">
      <div class="library-graph-heading">
        <h3 id="library-graph-title">Library map</h3>
        <button class="library-graph-open" type="button" aria-label="Open full library map">
          Expand
        </button>
      </div>
      <button
        class="library-graph-preview library-graph-open"
        type="button"
        aria-label="Open full library map"
      >
        <GraphSvg root={root} currentSlug={fileData.slug} compact />
      </button>
      <dialog class="library-graph-dialog">
        <div class="library-graph-dialog-head">
          <div>
            <strong>SE7EN Library Map</strong>
            <span>Folders, subfolders and notes</span>
          </div>
          <button class="library-graph-close" type="button" aria-label="Close library map">
            ×
          </button>
        </div>
        <GraphSvg root={root} currentSlug={fileData.slug} compact={false} />
        <div class="library-graph-tooltip" role="tooltip" aria-hidden="true" />
        <p>
          Drag any node to rearrange the map. Hover over a note to see its title; click to open it.
        </p>
      </dialog>
    </section>
  )
}

LibraryGraph.afterDOMLoaded = `
document.querySelectorAll(".library-graph").forEach((graph) => {
  if (graph.dataset.interactive === "true") return
  graph.dataset.interactive = "true"
  const dialog = graph.querySelector(".library-graph-dialog")
  const openers = graph.querySelectorAll(".library-graph-open")
  const closer = graph.querySelector(".library-graph-close")
  const svg = dialog?.querySelector(".library-graph-svg")
  const tooltip = dialog?.querySelector(".library-graph-tooltip")
  const nodes = svg?.querySelectorAll(".library-graph-node") ?? []
  const edges = svg?.querySelectorAll(".library-graph-edges line") ?? []
  const controller = new AbortController()
  const listenerOptions = { signal: controller.signal }
  let drag = null

  const pointInSvg = (event) => {
    const point = new DOMPoint(event.clientX, event.clientY)
    return point.matrixTransform(svg.getScreenCTM().inverse())
  }
  const hideTooltip = () => {
    if (!tooltip) return
    tooltip.classList.remove("visible")
    tooltip.setAttribute("aria-hidden", "true")
  }
  const positionTooltip = (event) => {
    if (!tooltip) return
    tooltip.style.left = event.clientX + 14 + "px"
    tooltip.style.top = event.clientY + 14 + "px"
  }
  const moveNode = (node, point) => {
    const key = node.dataset.nodeKey
    node.querySelectorAll("circle").forEach((circle) => {
      circle.setAttribute("cx", point.x)
      circle.setAttribute("cy", point.y)
    })
    const label = node.querySelector("text")
    if (label) {
      label.setAttribute("x", point.x)
      label.setAttribute("y", point.y + Number(label.dataset.dy ?? 0))
    }
    edges.forEach((edge) => {
      if (edge.dataset.from === key) {
        edge.setAttribute("x1", point.x)
        edge.setAttribute("y1", point.y)
      }
      if (edge.dataset.to === key) {
        edge.setAttribute("x2", point.x)
        edge.setAttribute("y2", point.y)
      }
    })
  }

  const open = () => dialog?.showModal()
  const close = () => {
    hideTooltip()
    dialog?.close()
  }
  openers.forEach((button) => button.addEventListener("click", open, listenerOptions))
  closer?.addEventListener("click", close, listenerOptions)
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) close()
  }, listenerOptions)

  nodes.forEach((node) => {
    node.addEventListener("pointerenter", (event) => {
      if (node.dataset.note !== "true" || drag || !tooltip) return
      tooltip.textContent = node.dataset.label ?? "Untitled note"
      tooltip.classList.add("visible")
      tooltip.setAttribute("aria-hidden", "false")
      positionTooltip(event)
    }, listenerOptions)
    node.addEventListener("pointerleave", () => {
      if (!drag) hideTooltip()
    }, listenerOptions)
    node.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return
      hideTooltip()
      drag = {
        node,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      }
      node.setPointerCapture(event.pointerId)
      node.classList.add("dragging")
    }, listenerOptions)
    node.addEventListener("pointermove", (event) => {
      if (!drag || drag.node !== node || drag.pointerId !== event.pointerId) {
        if (node.dataset.note === "true") positionTooltip(event)
        return
      }
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 3) {
        drag.moved = true
      }
      if (drag.moved) {
        event.preventDefault()
        moveNode(node, pointInSvg(event))
      }
    }, listenerOptions)
    const finishDrag = (event) => {
      if (!drag || drag.node !== node || drag.pointerId !== event.pointerId) return
      if (drag.moved) {
        node.dataset.justDragged = "true"
        setTimeout(() => delete node.dataset.justDragged, 0)
      }
      node.classList.remove("dragging")
      node.releasePointerCapture?.(event.pointerId)
      drag = null
    }
    node.addEventListener("pointerup", finishDrag, listenerOptions)
    node.addEventListener("pointercancel", finishDrag, listenerOptions)
    node.addEventListener("click", (event) => {
      if (node.dataset.justDragged === "true") {
        event.preventDefault()
        event.stopPropagation()
      }
    }, listenerOptions)
  })

  window.addCleanup?.(() => controller.abort())
})
`
