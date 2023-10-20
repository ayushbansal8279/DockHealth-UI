import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Virtualized, { Node } from 'views/list-details/modules/Virtualized';
import VListGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VListGroup/VListGroup';
import VTask from "views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask";
import VSubtask from "views/list-details/VirtualTaskList/VirtualSegment/VSubtask/VSubtask";

export interface Props {
  tasksToMap: any[]
  groupedTasks: any[]
}

function VirtualTaskList({ tasksToMap, groupedTasks }: Props) {
  // @ts-ignore
  const tasksMap = useSelector(state => state.listDetails.tasksMap)
  const nodes: Node[] = useMemo(() => {
    return groupedTasks.map(group => convert(
      group.groupIdentifier,
      VListGroup,
      { name: group.groupName },
      group.tasks.map((taskIdentifier: string) => {
        const task = tasksMap[taskIdentifier]
        const children = task.itemType === "TASK"
          ? task.subtasks
          : task.tasks
        return convert(
          taskIdentifier,
          VTask,
          {},
          children.map((child: any) => {
            return convert(
              child.taskIdentifier,
              task.itemType === "TASK"
                ? VSubtask
                : VTask,
              {},
              []
            );
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