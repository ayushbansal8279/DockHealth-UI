import React, { ForwardedRef } from "react"
import Cell from "../Cell/Cell"


export interface Props {
  children: React.ReactNode
}

function Column({ children }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <>
      <Cell ref={ref}>{children}</Cell>
    </>
  )
}


export default React.forwardRef(Column)