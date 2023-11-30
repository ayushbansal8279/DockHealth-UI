import React, { useCallback, useMemo } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Virtuoso } from "react-virtuoso"
import { FlatNode, Node } from "./types";
import VSegment from "./VSegment"
import { useDispatch } from "react-redux";
import { reassignTasksToAnotherGroup, reorderTasksInGroup } from "actions/list-details-actions";
import StandardTaskItem from "components/task/StandardTaskItem/StandardTaskItem";
import { reorderSubtasks } from "actions/task-actions";
import { reorderWorkflowTasks } from "actions/workflow-actions";

export interface Props {
  nodes?: Node[]
  tasksMap: Record<string, any>
  context?: any
}

function Virtualized({ nodes = [], tasksMap, context, ...props }: Props) {
  const dispatch = useDispatch()

  const flatNodes = useMemo(() => walk(nodes), [nodes])

  const handleDragEnd = useCallback((drop: DropResult) => {
    if (drop.destination && drop.source) {
      const destination = flatNodes.find(node => node.index === drop.destination?.index)!
      const source = flatNodes.find(node => node.index === drop.source?.index)!
      const destinationParentFirstChild = flatNodes.find(node =>
        node.id === destination.parent?.children[0]
      )
      const sourceParentFirstChild = flatNodes.find(node =>
        node.id === source.parent?.children[0]
      )
      const destinationOffsetIndex = (destination.index as number) - (destinationParentFirstChild?.index as number)
      const sourceOffsetIndex = (source.index as number) - (sourceParentFirstChild?.index as number)

      switch (source.kind) {
        case "Task": {
          if (destination?.parent?.id !== source?.parent?.id) {
            dispatch(
              reassignTasksToAnotherGroup({
                destination: {
                  index: destinationOffsetIndex,
                  droppableId: destination?.parent?.id
                },
                source: {
                  index: sourceOffsetIndex,
                  droppableId: source?.parent?.id
                }
              })
            )
          }
          dispatch(
            reorderTasksInGroup({
              destination: {
                index: destinationOffsetIndex,
                droppableId: destination?.parent?.id
              },
              source: {
                index: sourceOffsetIndex
              }
            })
          )
          break
        }
        case "Subtask": {
          dispatch(
            reorderSubtasks({
              source: { index: sourceOffsetIndex },
              destination: { index: destinationOffsetIndex },
              parentTask: tasksMap[source?.parent?.id!]
            })
          )
          break
        }
        case "TaskOfBundle": {
          dispatch(
            reorderWorkflowTasks({
              source: { index: sourceOffsetIndex },
              destination: { index: destinationOffsetIndex },
              workflow: tasksMap[destination.parent?.id!],
              completedTasksShown: true,
              incompleteTasksShown: true,
            })
          )
          break
        }
      }
    }
  }, [tasksMap, flatNodes])

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <Droppable
        mode="virtual"
        droppableId={"nodes[0].id"}
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

const walk = (nodes: Node[], parent: FlatNode | null = null, level: number = 0, state: { index: number } = { index: 0 }): FlatNode[] => {
  return nodes.flatMap((node, index) => {
    const { id, phantom, type, kind, collapsed, data, handlers } = node
    const flattened: FlatNode = {
      id,
      phantom,
      type,
      kind,
      index: phantom ? null : state.index,
      sameLevelIndex: index,
      level,
      parent,
      collapsed,
      data,
      children: node.children
        .filter(child => !child.phantom)
        .map(child => child.id),
      handlers
    }
    if (!phantom) {
      state.index = state.index + 1
    }

    return [
      flattened,
      ...walk(collapsed ? [] : node.children, flattened, level + 1, state)
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
