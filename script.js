class Node {
  constructor(row, col, distanceFromStart) {
    this.row = row
    this.col = col
    this.distanceFromStart = distanceFromStart
    this.directions = [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ]
  }

  getPositionString() {
    return `${this.row}, ${this.col}`
  }

  getNeighbors(row, col) {
    let neighbors = []
    for (const direction of this.directions) {
      let [directionRow, directionCol] = direction
      let neighborRow = row + directionRow
      let neighborCol = col + directionCol
      if (
        neighborRow > 0 &&
        neighborCol > 0 &&
        neighborRow < 8 &&
        neighborCol < 8
      ) {
        neighbors.push([neighborRow, neighborCol])
      }
    }
    return neighbors
  }
}

function knightMoves(targetRow, targetCol) {
  const queue = []
  const visited = new Set()
  const edges = []
  const vertices = []
  const startNode = new Node(0, 0, 0)
  const endNode = new Node(targetRow, targetCol, 0)
  queue.push(startNode)
  while (queue.length > 0) {
    // Remove node
    // In practice we should use a real Queue class so that we can dequeue in O(1) instead of O(n)
    const node = queue.shift()
    const { row, col, distanceFromStart } = node
    // Process node
    if (row == targetRow && col == targetCol) {
      let graph = new Graph(vertices, edges)
      let shortestPath = graph.getShortestPath(
        startNode.getPositionString(),
        endNode.getPositionString()
      )
      return { shortestPath, distanceFromStart }
    }
    visited.add(node.getPositionString())
    vertices.push(node.getPositionString())
    // Add neighbors
    for (const neighbor of node.getNeighbors(row, col)) {
      const [neighborRow, neighborCol] = neighbor
      const neighborNode = new Node(
        neighborRow,
        neighborCol,
        distanceFromStart + 1
      )
      edges.push([node.getPositionString(), neighborNode.getPositionString()])
      if (visited.has(neighborNode.getPositionString())) continue
      queue.push(neighborNode)
    }
  }
}

class Graph {
  constructor(vertices, edges) {
    this.vertices = vertices
    this.edges = edges
  }

  getAdjacetNodes(node) {
    let adjacentNodes = []
    for (const edge of this.edges) {
      const nodeIndex = edge.indexOf(node)
      if (nodeIndex == -1) continue
      const adjacentNode = nodeIndex == 0 ? edge[1] : edge[0]
      adjacentNodes.push(adjacentNode)
    }
    return adjacentNodes
  }

  isConnected(node1, node2) {
    return this.edges.some((edge) => {
      return edge.indexOf(node1) > -1 && edge.indexOf(node2) > -1
    })
  }

  getShortestPath(startNode, endNode) {
    let shortestPath = []
    let start = startNode
    for (const edge of this.edges) {
      if (edge.includes(start)) {
        if (this.isConnected(start, endNode)) {
          shortestPath.push(start)
          shortestPath.push(endNode)
          return shortestPath
        }
        shortestPath.push(start)
        start = edge[1]
      }
    }
    return shortestPath
  }
}
