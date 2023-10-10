import { FunctionComponent } from "react"


export type Segment = {
  register?: Record<string, unknown>
  metadata: {
    id: string
    level: number
    parent: Segment["metadata"] | null
    collapsed: boolean
    children: string[]
  }
  controller?: {
    collapse?(): void
    delete?(): void
  }
}

export type Node = {
  id: string
  type: FunctionComponent<any & Segment>
  collapsed: boolean
  children: Node[]
  data: Record<string, unknown>
}

export type FlatNode = {
  id: string
  type: FunctionComponent<Segment>
  index?: number
  level: number
  parent: FlatNode | null
  collapsed: boolean
  data: Record<string, unknown>
  children: string[]
}
