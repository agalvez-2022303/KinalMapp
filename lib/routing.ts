import { floorPlans, type FloorPlanPOI } from "./kinal-data"

export interface RouteStep {
  floorPlanId: string
  x: number
  y: number
  label?: string
  type: "walk" | "stairs" | "arrival"
}

interface GraphNode {
  id: string
  floorPlanId: string
  x: number
  y: number
  label?: string
}

interface GraphEdge {
  from: string
  to: string
}

function buildGraph() {
  const nodes = new Map<string, GraphNode>()
  const adj = new Map<string, { to: string; weight: number }[]>()

  for (const fp of floorPlans) {
    for (const node of fp.nodes) {
      nodes.set(node.id, node)
      adj.set(node.id, [])
    }
    for (const poi of fp.pois) {
      nodes.set(poi.id, { id: poi.id, floorPlanId: fp.id, x: poi.x, y: poi.y, label: poi.label })
      adj.set(poi.id, [])
    }
  }

  for (const fp of floorPlans) {
    for (const edge of fp.edges) {
      const a = nodes.get(edge.from)
      const b = nodes.get(edge.to)
      if (!a || !b) continue
      const w = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
      adj.get(edge.from)!.push({ to: edge.to, weight: w })
      adj.get(edge.to)!.push({ to: edge.from, weight: w })
    }
  }

  const stairs = floorPlans.map(fp => fp.nodes.find(n => n.id.startsWith("stairs-")))
  for (let i = 0; i < stairs.length - 1; i++) {
    const a = stairs[i]
    const b = stairs[i + 1]
    if (a && b) {
      adj.get(a.id)!.push({ to: b.id, weight: 10 })
      adj.get(b.id)!.push({ to: a.id, weight: 10 })
    }
  }

  return { nodes, adj }
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

  const steps: RouteStep[] = []
  let lastFloor = nodes.get(path[0])!.floorPlanId
  for (let i = 0; i < path.length; i++) {
    const node = nodes.get(path[i])!
    const floorChanged = node.floorPlanId !== lastFloor
    if (floorChanged) {
      steps.push({
        type: "stairs",
        floorPlanId: node.floorPlanId,
        x: node.x,
        y: node.y,
        label: node.label || (node.floorPlanId === "pb" ? "Bajar a Planta Baja" : "Subir al Piso 2"),
      })
    }
    const isStairNode = node.id.startsWith("stairs-")
    const isArrival = i === path.length - 1
    steps.push({
      type: isArrival ? "arrival" : isStairNode && floorChanged ? "stairs" : "walk",
      floorPlanId: node.floorPlanId,
      x: node.x,
      y: node.y,
      label: node.label,
    })
    lastFloor = node.floorPlanId
  }

  const floorNames: Record<string, string> = {
    pb: "Planta Baja",
    p2: "Piso 2",
    p3: "Piso 3",
  }

  const cleanSteps: RouteStep[] = []
  for (let i = 0; i < steps.length; i++) {
    if (i === 0) {
      cleanSteps.push({
        ...steps[i],
        label: `Salir de: ${fromPOI.label}`,
      })
      continue
    }
    const prevStep = steps[i - 1]
    if (steps[i].type === "stairs" && prevStep.type === "stairs") continue
    if (steps[i].type === "walk" && prevStep.type === "stairs" && steps[i].label?.startsWith("Subir")) {
      cleanSteps.push({
        ...steps[i],
        label: `Subir a ${floorNames[steps[i].floorPlanId] || steps[i].floorPlanId}`,
      })
      continue
    }
    cleanSteps.push(steps[i])
  }

  return cleanSteps
}
