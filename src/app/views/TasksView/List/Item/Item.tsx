import React, { ForwardedRef, useEffect, useRef } from "react";
import cx from "./Item.module.scss"
import Cell from "../Cell/Cell"
import { definition } from "views/TasksView/definition"
import useMergedRef from "views/TasksView/List/hooks/useMergedRef";

function Item({ data: { isLeaf, name, nestingLevel, record }, isOpen, style, setOpen }: any, ref: ForwardedRef<HTMLLIElement>) {
  const [ element, merger ] = useMergedRef<HTMLLIElement>(null, ref);

  useEffect(() => {
    requestAnimationFrame(() => {
      element.current?.classList.add(cx.visible)
    })
  }, [])

  const {
    position,
    left,
    top
  } = style
  return (
    <li
      ref={merger}
      className={cx.Item}
      style={{ position, top, left }}
    >
      {Object.entries(record).map(([field, value]) => {
        const descriptor = (definition as any)[field];
        if (descriptor) {
          const { order } = (definition as any)[field];
          return (
            <Cell
              key={`${record.id}/${field}`}
              // order={order}
            >
              {value as any}
            </Cell>
          );
        }
      })}
    </li>
  )
}


export default React.forwardRef(Item)