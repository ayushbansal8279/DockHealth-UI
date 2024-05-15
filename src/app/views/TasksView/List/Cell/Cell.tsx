import React, { ForwardedRef } from "react"
import cx from "./Cell.module.scss"

export interface Props {
  children: React.ReactNode
}

function Cell({ children }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div
      ref={ref}
      className={cx.Cell}
    >
      {children}
    </div>
  )
}


export default React.forwardRef(Cell)