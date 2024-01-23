import React, { ForwardedRef, forwardRef } from "react"
import { Segment } from "../../Virtualized/types"
import * as Sc from "./styled"
import Cell from "../Cell/Cell"


export interface Props extends Segment {
  text: string
  definition: any
}

function Header({ metadata, register, definition }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Sc.Header
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
    >
      {Object.entries(definition).map(([field, descriptor]: any[]) => (
        <Cell
          key={`${metadata.id}/${field}`}
          order={descriptor.order}
        >
          {descriptor.name}
        </Cell>
      ))}
    </Sc.Header>
  )
}


export default forwardRef(Header)