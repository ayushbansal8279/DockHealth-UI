import React, { ForwardedRef, forwardRef } from "react"
import { Segment } from "../../Virtualized/types"
import * as Sc from "./styled"
import Cell from "../Cell/Cell"
import StandardTaskItem from "components/task/StandardTaskItem/StandardTaskItem";


export interface Props extends Segment {
  text: string
  definition: any
}

function Item({ metadata, register, definition, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  // console.log(metadata);
  return (
    <Sc.Item
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
    >
      <StandardTaskItem taskIdentifier={metadata.id as any}/>
      {/* {Object.entries(record).map(([field, value]) => { */}
      {/*   const descriptor = definition[field]; */}
      {/*   if (descriptor) { */}
      {/*     const getter = descriptor.value ?? (() => value) */}
      {/*     return ( */}
      {/*       <Cell */}
      {/*         id={`${metadata.id}/${field}`} */}
      {/*         key={`${metadata.id}/${field}`} */}
      {/*         order={descriptor.order} */}
      {/*       > */}
      {/*         {getter(value)} */}
      {/*       </Cell> */}
      {/*     ) */}
      {/*   } */}
      {/* })} */}
    </Sc.Item>
  )
}


export default forwardRef(Item)