import React, { useEffect, useState } from "react";
import Virtualized from "views/list-details/modules/Virtualized/Virtualized"
import { generateFakeData } from "views/list-details/modules/Virtualized/utilities"
import Item from "views/list-details/modules/List/Item/Item";
import Group from "views/list-details/modules/List/Group/Group";
import Header from "views/list-details/modules/List/Header/Header";
import { getGroupsByListId } from "../../app/api/task-group-list-api";
import { getTasksForTaskListByTaskGroup } from "../../app/api/list-details-api";
import { Node } from "views/list-details/modules/Virtualized/types";
import { uniqueId } from "lodash";
import LayoutHeader from "components/template/LayoutHeader/LayoutHeader";
import HorizontallyScrolledViewLayout
  from "components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout";
import { useDispatch, useSelector } from "react-redux";
import { taskIdentifiersSelector } from "../../app/selectors/person-details-selectors";
import * as ListDetailsActions from "actions/list-details-actions";
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector
} from "../../app/selectors/task-list-selectors";
import { useParams } from "react-router-dom";
import { initializeTaskListState } from "actions/task-list-actions";
import { TaskStatus } from "helpers/task-helpers";
import { useCallback } from "react/react.shared-subset";


const data = generateFakeData(50, [Group, Header, Item, Item])
const definition = {
  "id": {
    name: "ID",
    order: 0
  },
  "name": {
    name: "Name",
    order: 1
  },
  "details-1": {
    name: "Details 1",
    order: 2
  },
  "details-2": {
    name: "Details 2",
    order: 3
  },
  "details-3": {
    name: "Details 3",
    order: 4
  },
  "due-date": {
    name: "Due Date",
    order: 5
  },
  "start-date": {
    name: "Start Date",
    order: 6
  },
  "creator": {
    name: "Creator",
    order: 7,
    value: (value: any) => `${value["first-name"]} ${value["last-name"]}`
  }
};


interface GroupRaw {
  defaultOpen: boolean
  groupName: string
  groupType: null
  metricName: string
  metricValue: number
  taskGroupIdentifier: string
}

interface TaskListRaw {
  taskFilterOptions: {
    assignedBy: unknown
    assignedTo: unknown
    completedBy: unknown
    createdBy: unknown
    customFields: unknown
    labels: unknown
    optionsOrder: unknown
    organizations: unknown
    patients: unknown
    priorityOptions: unknown
    taskCompletedDateOptions: unknown
    taskCreatedDateOptions: unknown
    taskDueDateOptions: unknown
    taskLists: unknown
    taskStatusOptions: unknown
    workflowStatusOptions: unknown
  }
  taskGroups: {
    groupIdentifier: string
    groupName: string
    hasMore: boolean
    moreTasksIndex: number
    patients: unknown[]
    tasks: TaskRaw[]
  }[]
}

interface TaskRaw {
  active: boolean
  dependencyTasksCompletedCount: number
  dependencyTasksCount: number
  description: string
  duplicated: boolean
  edited: boolean
  hasEscalations: boolean
  hasRecurringSchedule: boolean
  intentType: string
  organization: unknown
  read: boolean
  sharedWithUsers: unknown[]
  status: string
  subTasksCompletedCount: number
  subTasksCount: number
  subtasks: number
  taskDependencies: number
  taskGroups: unknown[]
  taskId: number
  taskIdentifier: string
  taskLinks: unknown[]
  taskList: unknown[]
  taskOutcomes: unknown[]
  tokenizedDescription: string
  type: string
  updatedDateTime: string
  assignedToUsers: unknown[]
  attachments: unknown[]
  comments: unknown[]
  createdDateTime: string
  creator: unknown
  hasMentions: boolean
  identifier: string
  itemType: string
  labels: unknown[]
  name: string
  parentTaskGroupIdentifier: string
  priority: string
  reminderType: string
  taskListIdentifier: string
  taskMentions: unknown[]
  taskMetaData: unknown[]
  tasks: TaskRaw[]
  tasksCompletedCount: string
  tasksCount: string

}

const definition2 = {
  "id": {
    name: "ID",
    order: 0
  },
  "name": {
    name: "Name",
    order: 1
  },
  "description": {
    name: "Description",
    order: 2
  }
}

const f = (): Promise<Node[]> => {
  const listId = "b114c3c7-563b-41e6-9e65-77f3a1852789"
  return getGroupsByListId(listId)
    .then((groups: GroupRaw[]) => {
      const xs = groups.map(group => {
        return getTasksForTaskListByTaskGroup(listId, group.taskGroupIdentifier, "INCOMPLETE")
          .then((taskList: TaskListRaw) => {
            const xs: Node[] = taskList.taskGroups[0]?.tasks.map(task => {
              // console.log(task.subTasksCount);
              return {
                id: task.taskIdentifier,
                type: Item,
                collapsed: false,
                children: [],
                data: {
                  id: task.taskIdentifier,
                  name: task.name,
                  description: task.description,
                }
              }
            })

            return [
              {
                id: group.taskGroupIdentifier,
                type: Group,
                collapsed: false,
                children: xs,
                data: {
                  name: group.groupName,
                  count: group.metricValue
                }
              }
            ]
          })
      })

      return Promise.all(xs)
        .then(xs => xs.flat())
    })
}


export default function () {
  // console.log(data);

  const [data2, setData] = useState<Node[]>([])

  // useEffect(() => {
  //   f()
  //     .then(data => {
  //       // console.log(data)
  //       setData(data)
  //     })
  // }, [])

  // @ts-ignore
  const taskGroups = useSelector(state => state.listDetails.groupedTasks.taskGroups)
  // @ts-ignore
  const tasksMap = useSelector(state => state.listDetails.tasksMap)

  useEffect(() => {
    console.log("taskGroups", taskGroups, tasksMap)
    const nodes = taskGroups
      ?.map((taskGroup: any) => {
        return {
          id: taskGroup.groupIdentifier,
          type: Group,
          data: { name: taskGroup.groupName },
          children: taskGroup.tasks?.map((taskIdentifier: string) => {
            const task = tasksMap[taskIdentifier]
            if (task.itemType !== "TASK") {
              return false
            }
            // console.log("!", task)
            return {
              id: taskIdentifier,
              type: Item,
              children: task.subtasks?.map((subtask: any) => {
                return {
                  id: subtask.taskIdentifier,
                  type: Item,
                  children: []
                }
              }) ?? []
            }
          }).filter((x: any) => x)
        }
      })

    setData(nodes ?? [])
    console.log("!?!", nodes)
  }, [taskGroups, tasksMap])

  const dispatch = useDispatch();
  const currentTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const currentStatus = useSelector(currentTaskListTasksStatusSelector);
  const taskListIdentifier = "b114c3c7-563b-41e6-9e65-77f3a1852789"

  useEffect(() => {
    console.log("~taskListIdentifier", taskListIdentifier)
    if (taskListIdentifier) {
      dispatch(
        initializeTaskListState(
          taskListIdentifier,
          TaskStatus.INCOMPLETE,
        ),
      );
    }
  }, [dispatch, taskListIdentifier]);

  useEffect(() => {
    console.log("~currentTaskListIdentifier", currentTaskListIdentifier)
    if (currentTaskListIdentifier)
      dispatch(ListDetailsActions.initializeListDetailsTableState());
  }, [dispatch, currentTaskListIdentifier, currentStatus]);

  useEffect(() => {
    if (taskListIdentifier) {
      dispatch(ListDetailsActions.getListCustomFields(taskListIdentifier));
    }
  }, [dispatch, taskListIdentifier]);

  // const loadTasksForTaskGroup = useCallback(
  //   ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
  //     const payload = {
  //       taskGroupIdentifier,
  //       status: params.tabName || 'INCOMPLETE',
  //       startPosition,
  //       sort,
  //       viewMode,
  //       refresh,
  //     };
  //     dispatch(ListDetailsActions.getTasksForTaskGroups(payload));
  //   },
  //   [dispatch, params.tabName, sort],
  // );

  return (
    <>
      <HorizontallyScrolledViewLayout
        header={
          <LayoutHeader>
            <LayoutHeader.Title title="Tasks" />
            <LayoutHeader.Spacer />
          </LayoutHeader>
        }
      />
      <div
        style={{
          height: "100%",
        }}
      >
        <Virtualized
          nodes={data2}
          context={{ definition: definition2 }}
        />
      </div>
    </>
  )
}