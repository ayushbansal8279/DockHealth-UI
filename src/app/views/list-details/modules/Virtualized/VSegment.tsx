import React, { ReactNode } from "react"
import { ItemProps } from "react-virtuoso"
import { FlatNode, Segment } from "./types";


export interface Props {
  item: FlatNode
  children?: ReactNode
  context?: Record<string, unknown>
}

function VSegment({
  item: node,
  context,
  children: wtf,
  ...register
}: Props & ItemProps<unknown>) {
  const { type: Component, data } = node
  const segment = toSegment(node, register)
  return (
    <Component
      {...data}
      {...context}
      {...segment}
    />
  )
}

const toSegment = (node: FlatNode, register?: Record<string, unknown>): Segment => {
  const { id, level, parent, collapsed, children} = node
  return {
    register,
    metadata: {
      id,
      level,
      parent: parent !== null
        ? toSegment(parent).metadata
        : null,
      collapsed,
      children
    },
    controller: {
      delete() {

      }
    }
  }
}


export default VSegment
