import React, { useMemo } from "react";
import Virtualized, { Node } from "views/list-details/modules/Virtualized";
import Group from "views/list-details/modules/List/Group/Group";
import Item from "views/list-details/modules/List/Item/Item";
import { useSelector } from "react-redux";

export interface Props {
  tasksToMap: any[]
  groupedTasks: any[]
}

function VirtualTaskList({ tasksToMap, groupedTasks }: Props) {
  // @ts-ignore
  const tasksMap = useSelector(state => state.listDetails.tasksMap)

  // const nodes: Node[] = useMemo(() => {
  //   return groupedTasks
  //     ?.map((taskGroup: any) => {
  //       return {
  //         id: taskGroup.groupIdentifier,
  //         type: Group,
  //         collapsed: false,
  //         data: { name: taskGroup.groupName },
  //         children: taskGroup.tasks?.map((taskIdentifier: string) => {
  //           const task = tasksMap[taskIdentifier]
  //           console.log("task", task);
  //           return {
  //             id: taskIdentifier,
  //             type: Item,
  //             collapsed: false,
  //             children: []
  //           }
  //         })
  //       }
  //     })
  // }, [groupedTasks, tasksMap])

  const nodes: Node[] = useMemo(() => {
    console.log("RERENDER!", { groupedTasks, tasksMap })
    return groupedTasks.map(group => convert(
      group.groupIdentifier,
      Group,
      { name: group.groupName },
      group.tasks.map((taskIdentifier: string) => {
        const task = tasksMap[taskIdentifier]
        const children = task.itemType === "TASK"
          ? task.subtasks
          : task.tasks
        return convert(
          taskIdentifier,
          Item,
          {},
          children.map((child: any) => {
            return convert(child.taskIdentifier, Item, {}, [])
          })
        )
      })
    ))
  }, [groupedTasks, tasksMap])

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Virtualized
        nodes={nodes}
      />
    </div>
  )
}

// @ts-ignore
const convert = (id, type, data, children): Node => {
  return {
    id,
    type,
    collapsed: false,
    data,
    children
  }
}

export default VirtualTaskList