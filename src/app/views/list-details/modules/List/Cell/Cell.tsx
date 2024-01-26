import React, { ReactNode } from "react"
import * as Sc from "./styled"


export interface Props {
  id: unknown
  order: number
  children: ReactNode
}

function Cell({ id = "", order, children }: Props) {
  return (
    <Sc.Cell
      data-id={`Cell(${id})`}
      $order={order}
    >
      {children}
    </Sc.Cell>
  )
}


export default Cell