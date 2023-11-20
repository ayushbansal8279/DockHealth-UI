import { FunctionComponent } from "react"


export type Segment = {
  register?: Record<string, unknown>
  metadata: {
    id: string
    index: number
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
  phantom: boolean
  type: FunctionComponent<any & Segment>
  kind: string
  collapsed: boolean
  children: Node[]
  data: Record<string, unknown>
  handlers: Record<string, (...varargs: any[]) => void>
}

export type FlatNode = {
  id: string
  phantom: boolean
  type: FunctionComponent<Segment>
  kind: string
  index: number | null
  level: number
  parent: FlatNode | null
  collapsed: boolean
  data: Record<string, unknown>
  children: string[]
  handlers: Record<string, (...varargs: any[]) => void>
}
