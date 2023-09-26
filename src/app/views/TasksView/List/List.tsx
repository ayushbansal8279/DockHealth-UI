import React, { ForwardedRef } from "react"
import cx from "./List.module.scss"
import { FixedSizeTree } from "react-vtree"
import Item from "./Item/Item"
import Column from "./Column/Column"
import { definition } from "views/TasksView/definition"
import { items } from "./data";
const items2 = [
  ...items,
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 2 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 3 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 4 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 5 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 6 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 7 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 8 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 9 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 10 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 11 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 12 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 13 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 14 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 15 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 16 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 17 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 18 })),
  ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 19 })),
]


const Context = React.createContext<any>(null)

export interface Props {
  children: React.ReactElement
}

function List({ ...props }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} className={cx.List}>
      <Context.Provider value={null}>
        <FixedSizeTree
          treeWalker={treeWalker as any}
          itemSize={44}
          height={640}
          width="100%"
          innerElementType={ListContent}
        >
          {Item}
        </FixedSizeTree>
      </Context.Provider>
    </div>
  )
}

const ListContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => {
  return (
    <div {...props}>
      <div className={cx.ListHeader}>
        {Object.entries(definition).map(([field, descriptor]) => (
          <Column
            key={field}
            // id={field}
            // order={descriptor.order}
          >
            {descriptor.name}
          </Column>
        ))}
      </div>
      <ul className={cx.ListContent}>
        {children}
      </ul>
    </div>
  )
})

function* treeWalker() {
  for (const item of items2) {
    yield convert(item, 0);
  }
}

// @ts-ignore
const convert = (node, nestingLevel) => ({
  data: {
    id: node.id.toString(),
    name: node.name,
    isOpenByDefault: true,
    isLeaf: node.children === undefined || node.children.length === 0,
    nestingLevel,
    record: node
  },
  nestingLevel,
  node
})



export default React.forwardRef(List)