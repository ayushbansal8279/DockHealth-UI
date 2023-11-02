import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { uniqueId } from "lodash";
import Virtualized, { Node } from 'views/list-details/modules/Virtualized';
import VListGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VListGroup/VListGroup';
import VTask from "views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask";
import VSubtask from "views/list-details/VirtualTaskList/VirtualSegment/VSubtask/VSubtask";
import VAddGroup from "views/list-details/VirtualTaskList/VirtualSegment/VAddGroup/VAddGroup";
import VQuickAddTask from "views/list-details/VirtualTaskList/VirtualSegment/VQuickAddTask/VQuickAddTask";
import VTaskHeader from "views/list-details/VirtualTaskList/VirtualSegment/VTaskHeader/VTaskHeader";

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
      [
        convert(
          uniqueId().toString(),
          VQuickAddTask,
          {
            taskGroupIdentifier: group.groupIdentifier
          },
          []
        ),
        convert(
          uniqueId().toString(),
          VTaskHeader,
          {},
          []
        )
      ]
        .concat(...group.tasks.map((taskIdentifier: string) => {
        const task = tasksMap[taskIdentifier]
        const children = task.itemType === "TASK"
          ? task.subtasks
          : task.tasks
        return convert(
          taskIdentifier,
          VTask,
          { task },
          children.map((child: any) => {
            return convert(
              child?.taskIdentifier ?? child,
              task.itemType === "TASK"
                ? VSubtask
                : VTask,
              { isTaskTemplate: true },
              !!tasksMap[child]?.subtasks.length
                ? tasksMap[child].subtasks.map((subtask: any) => {
                  console.log("!!?:", child, subtask);
                  return convert(
                    subtask.taskIdentifier,
                    VSubtask,
                    { task: subtask },
                    []
                  );
                })
                : []
            );
          })
        )
      }))
    )).concat(
        convert(uniqueId().toString(), VAddGroup, {}, [])
    )
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