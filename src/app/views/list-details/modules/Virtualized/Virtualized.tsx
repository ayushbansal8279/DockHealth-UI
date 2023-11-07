import React, { useCallback, useMemo } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Virtuoso } from "react-virtuoso"
import { FlatNode, Node } from "./types";
import VSegment from "./VSegment"
import { useDispatch } from "react-redux";
import { reorderTasksInGroup } from "actions/list-details-actions";
import StandardTaskItem from "components/task/StandardTaskItem/StandardTaskItem";

export interface Props {
  nodes?: Node[]
  context?: any
}

function Virtualized({ nodes = [], context, ...props }: Props) {
  const dispatch = useDispatch()

  const flatNodes = useMemo(() => walk(nodes), [nodes])
  const handleDragEnd = useCallback((drop: DropResult) => {
    console.log("handleDragEnd" ,drop)
    const { source, destination, draggableId} = drop
    dispatch(reorderTasksInGroup({ destination, source }))
  }, [])

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <Droppable
        mode="virtual"
        droppableId={nodes[0].id}
        renderClone={(provided, snapshot, rubric) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Placeholder id={rubric.draggableId}/>
          </div>
        )}
      >
        {(provided) => (
          <Virtuoso
            // @ts-ignore
            scrollerRef={provided.innerRef}
            style={{ height: "100%" }}
            data={flatNodes}
            context={context}
            components={{
              Item: VSegment
            }}
            {...props}
          />
        )}
      </Droppable>
    </DragDropContext>
  )
}

const walk = (nodes: Node[], parent: FlatNode | null = null, level: number = 0, index: number = 0): FlatNode[] => {
  const state = {
    index
  }
  return nodes.flatMap((node) => {
    const { id, phantom, type, collapsed, data } = node
    const flattened: FlatNode = {
      id,
      type,
      index: phantom ? null : state.index,
      level,
      parent,
      collapsed,
      data,
      children: node.children
        .map(({ id }) => id)
    }
    if (!phantom) {
      state.index = state.index + 1
    }

    return [
      flattened,
      ...walk(!collapsed ? node.children : [], flattened, level + 1, state.index)
    ]
  })
}

const Placeholder = ({ id }: any) => {
  return (
    // @ts-ignore
    <StandardTaskItem taskIdentifier={id}/>
  )
}

export default Virtualized
