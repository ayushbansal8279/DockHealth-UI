import React, { ForwardedRef, useEffect, useRef } from "react"
import cx from "./List.module.scss"
import { FixedSizeTree, TreeWalker } from "react-vtree"
import Item from "./Item/Item"
import Column from "./Column/Column"
import Icon from "../Icon/Icon";
// import { items } from "./data";
// const items2 = [
//   ...items,
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 2 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 3 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 4 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 5 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 6 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 7 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 8 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 9 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 10 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 11 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 12 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 13 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 14 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 15 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 16 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 17 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 18 })),
//   ...items.map((item: any) => ({ ...item, id: +item.id + 76 * 19 })),
// ]


const Context =
  React.createContext<any>(null)

type AnyProps =
  Record<string, any>

export type ListDefinition =
  Record<string, Record<string, string>>

export type ListRecord = {
  id: string
  children?: ListRecord[]
}

export type ListNodeData = {
  id: string,
  isOpenByDefault: boolean,
  level: number,
  props: {
    definition: ListDefinition,
    record: ListRecord
  }
}

export interface Props {
  children: React.ReactElement
  definition: Record<string, Record<string, string>>
  items: ListRecord[]
}

function List({ definition, items }: Props, ref: ForwardedRef<HTMLDivElement>) {
  function* walk(): ReturnType<TreeWalker<ListNodeData, void>> {
    for (const item of items) {
      yield toListNodeData(definition, item)
    }
    for (;;) {
      const node = yield
      const { level, props: { record: parent } } = node.data
      if (parent.children) {
        for (const child of parent.children) {
          yield toListNodeData(definition, child, level + 1)
        }
      }
    }
  }

  return (
    <div ref={ref} className={cx.List}>
      <Context.Provider value={null}>
        <FixedSizeTree
          treeWalker={walk}
          itemSize={44}
          height={640}
          width="100%"
          innerElementType={ListContent(definition)}
        >
          {ListNode}
        </FixedSizeTree>
      </Context.Provider>
    </div>
  )
}



const ListContent = (definition: ListDefinition) => ({ children, ...props }: AnyProps) => {
  return (
    <div {...props}>
      <div
        className={cx.ListHeader}
        style={{ width: `${Object.keys(definition).length * 180}px` }}
      >
        <div className={cx.ListGutter} />
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
}

const ListNode = ({ data: { props, level, leaf }, isOpen, setOpen, style, ...other }: AnyProps) => {
  const element = useRef<HTMLLIElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      element.current?.classList.add(cx.visible)
    })
  }, [])

  const handleClick = () => {
    setOpen(!isOpen)
  }

  const {
    position,
    left,
    top
  } = style
  return (
    <li
      ref={element}
      className={cx.ListNode + " " + cx["level-" + level]}
      style={{
        position,
        left,
        top,
        width: `${Object.keys(props.definition).length * 180}px`,
        marginLeft: `${level * 40}px`
    }}
    >
      <div
        className={cx.ListGutter + " " + cx["level-" + level]}
        onClick={handleClick}
      >
        {!leaf && (
          <Icon
            name="subitem"
          />
        )}
      </div>
      <Item
        {...props}
        level={level}
      />
    </li>
  )
}

const toListNodeData = (definition: ListDefinition, record: ListRecord, level: number = 0) => {
  return {
    data: {
      id: record.id.toString(),
      isOpenByDefault: true,
      level,
      leaf: !record.children || record.children.length === 0,
      props: {
        definition,
        record
      }
    }
  }
}


export default React.forwardRef(List)