import React, { ForwardedRef, useEffect, useRef } from "react";
import cx from "./Item.module.scss"
import Cell from "../Cell/Cell"
import { definition } from "views/TasksView/definition"
import useMergedRef from "views/TasksView/List/hooks/useMergedRef";

export interface Props {

}

function Item({ definition, record, level }: any, ref: ForwardedRef<HTMLLIElement>) {
  return (
    <>
      {Object.entries(record).map(([field, value]) => {
        const descriptor = definition[field];
        if (descriptor) {
          // const { order } = definition[field];
          return (
            <Cell
              key={`${record.id}/${field}`}
              // order={order}
            >
              {descriptor.value ? descriptor.value(value) : value}
            </Cell>
          );
        }
      })}
    </>
  )
}


export default React.forwardRef(Item)