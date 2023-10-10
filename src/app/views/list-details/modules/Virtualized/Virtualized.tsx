import React from "react";
import { Virtuoso } from "react-virtuoso"
import { FlatNode, Node } from "./types";
import VSegment from "./VSegment"

export interface Props {
  nodes?: Node[]
  context?: any
}

function Virtualized({ nodes = [], context }: Props) {
  console.log("Virtualized", nodes);
  return (
    <Virtuoso
      style={{ height: "100%" }}
      data={walk(nodes)}
      context={context}
      components={{
        Item: VSegment
      }}
    />
  )
}

const walk = (nodes: Node[], parent: FlatNode | null = null, level: number = 0, index: number = 0): FlatNode[] => {
  return nodes.flatMap(node => {
    const { id, type, collapsed, data } = node
    const flattened: FlatNode = {
      id,
      type,
      level,
      parent,
      collapsed,
      data,
      children: node.children
        .map(({ id }) => id)
    }

    return [
      flattened,
      ...walk(!collapsed ? node.children : [], flattened, level + 1)
    ]
  })
}

export default Virtualized
