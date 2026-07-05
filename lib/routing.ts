import { buildings, STAIR_LINKS, BUILDING_EXITS, type BuildingLevel, type FloorPlanPOI } from "./kinal-data"

export interface RouteStep {
  levelId: string
  x: number
  y: number
  label?: string
  type: "walk" | "stairs" | "arrival" | "exterior"
}

interface GraphNode {
  id: string
  levelId: string
  x: number
  y: number
  label?: string
}

function buildGraph() {
  const nodes = new Map<string, GraphNode>()
  const adj = new Map<string, { to: string; weight: number }[]>()

  // Add all nodes from all building levels
  for (const b of buildings) {
    for (const level of b.levels) {
      for (const node of level.nodes) {
        nodes.set(node.id, node)
        adj.set(node.id, [])
      }
      for (const poi of level.pois) {
        nodes.set(poi.id, { id: poi.id, levelId: level.id, x: poi.x, y: poi.y, label: poi.label })
        adj.set(poi.id, [])
      }
    }
  }

  // Add edges within each level
  for (const b of buildings) {
    for (const level of b.levels) {
      for (const edge of level.edges) {
        const a = nodes.get(edge.from)
        const b = nodes.get(edge.to)
        if (!a || !b) continue
        const w = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
        adj.get(edge.from)!.push({ to: edge.to, weight: w })
        adj.get(edge.to)!.push({ to: edge.from, weight: w })
      }
    }
  }

  // Connect stairs within the same building (between consecutive levels)
  for (const [buildingId, links] of Object.entries(STAIR_LINKS)) {
    for (const [stairA, stairB] of links) {
      const a = nodes.get(stairA)
      const b = nodes.get(stairB)
      if (a && b) {
        adj.get(stairA)!.push({ to: stairB, weight: 10 })
        adj.get(stairB)!.push({ to: stairA, weight: 10 })
      }
    }
  }

  // Connect building exits to exterior nodes
  for (const [exitNodeId, extNodeId] of Object.entries(BUILDING_EXITS)) {
    const exitNode = nodes.get(exitNodeId)
    const extNode = nodes.get(extNodeId)
    if (exitNode && extNode) {
      adj.get(exitNodeId)!.push({ to: extNodeId, weight: 5 })
      adj.get(extNodeId)!.push({ to: exitNodeId, weight: 5 })
    }
  }

  return { nodes, adj }
}

function getLevelName(levelId: string): string {
  const parts = levelId.split("-")
  const levelNum = parts[parts.length - 1]
  if (levelNum === "n1") return "Nivel 1"
  if (levelNum === "n2") return "Nivel 2"
  if (levelNum === "n3") return "Nivel 3"
  return levelId
}

export function calculateRoute(
  fromPOI: FloorPlanPOI,
  toPOI: FloorPlanPOI
): RouteStep[] {
  const { nodes, adj } = buildGraph()

  const startId = fromPOI.id
  const endId = toPOI.id

  if (!nodes.has(startId) || !nodes.has(endId)) {
    return []
  }

  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()
  const visited = new Set<string>()

  for (const id of nodes.keys()) {
    dist.set(id, Infinity)
    prev.set(id, null)
  }
  dist.set(startId, 0)

  while (visited.size < nodes.size) {
    let minDist = Infinity
    let current: string | null = null
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < minDist) {
        minDist = d
        current = id
      }
    }
    if (current === null || current === endId) break
    visited.add(current!)

    for (const edge of adj.get(current!) || []) {
      if (visited.has(edge.to)) continue
      const newDist = dist.get(current!)! + edge.weight
      if (newDist < dist.get(edge.to)!) {
        dist.set(edge.to, newDist)
        prev.set(edge.to, current!)
      }
    }
  }

  const path: string[] = []
  let cur: string | null = endId
  while (cur !== null) {
    path.unshift(cur)
    cur = prev.get(cur) ?? null
  }

  if (path.length < 2) return []

  // Convert path to RouteSteps
  const steps: RouteStep[] = []
  let lastLevel = nodes.get(path[0])!.levelId

  for (let i = 0; i < path.length; i++) {
    const node = nodes.get(path[i])!
    const levelChanged = node.levelId !== lastLevel
    const isExterior = node.levelId === "exterior"
    const isStairNode = node.id.startsWith("stairs-")
    const isExitNode = node.id.startsWith("exit-")
    const isArrival = i === path.length - 1

    if (levelChanged) {
      if (isExterior) {
        steps.push({
          type: "exterior",
          levelId: node.levelId,
          x: node.x,
          y: node.y,
          label: "Cruzar el campus",
        })
      } else if (isStairNode) {
        steps.push({
          type: "stairs",
          levelId: node.levelId,
          x: node.x,
          y: node.y,
          label: node.label || getLevelName(node.levelId),
        })
      }
    }

    steps.push({
      type: isArrival ? "arrival" : isExitNode ? "walk" : isStairNode && levelChanged ? "stairs" : isExterior ? "exterior" : "walk",
      levelId: node.levelId,
      x: node.x,
      y: node.y,
      label: node.label,
    })

    lastLevel = node.levelId
  }

  // Clean up duplicate/adjacent steps
  const cleanSteps: RouteStep[] = []
  for (let i = 0; i < steps.length; i++) {
    // Skip duplicate consecutive stairs
    if (i > 0 && steps[i].type === "stairs" && steps[i - 1].type === "stairs") continue
    // Skip consecutive exterior steps (keep only first)
    if (i > 0 && steps[i].type === "exterior" && steps[i - 1].type === "exterior") continue

    if (i === 0) {
      cleanSteps.push({ ...steps[i], label: `Salir de: ${fromPOI.label}` })
      continue
    }

    cleanSteps.push(steps[i])
  }

  // Add descriptive labels for key transitions
  for (let i = 0; i < cleanSteps.length; i++) {
    if (cleanSteps[i].type === "exterior" && !cleanSteps[i].label) {
      cleanSteps[i].label = "Atravesar el campus"
    }
    if (cleanSteps[i].type === "arrival") {
      cleanSteps[i].label = `Llegar a: ${toPOI.label}`
    }
  }

  return cleanSteps
}
