import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniqueId } from 'lodash';
import { TaskStatus } from 'helpers/task-helpers';
import Virtualized, { Node } from 'views/list-details/modules/Virtualized';
import VListGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VListGroup/VListGroup';
import VTask from 'views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask';
import VSubtask from 'views/list-details/VirtualTaskList/VirtualSegment/VSubtask/VSubtask';
import VAddGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VAddGroup/VAddGroup';
import VQuickAddTask from 'views/list-details/VirtualTaskList/VirtualSegment/VQuickAddTask/VQuickAddTask';
import VTaskHeader from 'views/list-details/VirtualTaskList/VirtualSegment/VTaskHeader/VTaskHeader';
// import { DropResult } from 'react-beautiful-dnd';
// import { reorderTasksInGroup } from 'actions/list-details-actions';
import { currentTaskListTasksStatusSelector } from 'selectors/task-list-selectors';
// import {
//   isShowCompletedTasks,
//   isShowIncompleteTasks,
// } from 'selectors/task-items-selectors';
import VLoadMoreTasks from './VirtualSegment/VLoadMoreTasks/VLoadMoreTasks';
import {
  useVirtualTaskListScrollContext,
  withVirtualTaskListScrollContext,
} from './VirtualTaskListScrollContext';

export interface Props {
  tasksToMap: any[];
  groupedTasks: any[];
}

export const CollapseContext = createContext({
  get: (id: string) => {},
  set: (id: string, value: boolean) => {},
  workflowIdentifierMap: [],
  handleAddWorkflowIdentifier: (identifier: any) => {},
  handleRemoveWorkflowIdentifier: (identifier: any) => {},
});

// @ts-ignore
const convert = (
  id,
  type,
  kind,
  collapsed,
  data,
  children,
  phantom = false,
  handlers = {},
): Node => {
  return {
    id,
    phantom,
    type,
    kind,
    collapsed,
    data,
    children,
    handlers,
  };
};

function VirtualTaskList({ groupedTasks }: Props) {
  const [collapseMap, collapseDispatch] = useReducer(
    (map: Record<string, boolean>, [id, value]: [string, boolean]) => {
      map[id] = value;
      return { ...map };
    },
    {},
  );
  const [workflowIdentifierMap, setWorkflowIdentifierMap] = useState([]);

  const tasksMap = useSelector((state: any) => state.listDetails?.tasksMap);
  const listGroups = useSelector((state: any) => state.listDetails?.listGroups);
  const showCompletedWorkflowIdentifiers = useSelector(
    (state: any) => state?.taskItems?.showCompletedWorkflowIdentifiers,
  );
  const showIncompleteWorkflowIdentifiers = useSelector(
    (state: any) => state?.taskItems?.showIncompleteWorkflowIdentifiers,
  );
  const currentTaskListTasksStatus = useSelector(
    currentTaskListTasksStatusSelector,
  );

  const elementRef = useRef(null);
  const { updateVisibleWidth } = useVirtualTaskListScrollContext();

  useEffect(() => {
    const element = elementRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect.width) {
        updateVisibleWidth(entry.contentRect.width);
      }
    });

    if (element) {
      // Start observing the element's dimension
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, [elementRef.current]);

  const handleAddWorkflowIdentifier = (identifier: any) => {
    setWorkflowIdentifierMap([...workflowIdentifierMap, identifier]);
  };
  const handleRemoveWorkflowIdentifier = (identifier: any) => {
    const newArray = workflowIdentifierMap.filter(
      (item) => item !== identifier,
    );
    setWorkflowIdentifierMap(newArray);
  };

  const nodes: Node[] = useMemo(() => {
    return listGroups
      .map((group, index: number) => {
        const groupTasks =
          groupedTasks?.find(
            (groupedTask) =>
              groupedTask.groupIdentifier === group.taskGroupIdentifier,
          )?.tasks ?? [];

        const listTaskGroup = groupedTasks?.find(
          (groupedTask) =>
            groupedTask.groupIdentifier === group.taskGroupIdentifier,
        );

        const children = [
          convert(
            uniqueId().toString(),
            VQuickAddTask,
            'QuickAddTask',
            false,
            {
              taskGroupIdentifier: group.taskGroupIdentifier,
              bgColor: !(index % 2 === 0),
            },
            [],
            true,
          ),
          convert(
            uniqueId().toString(),
            VTaskHeader,
            'TaskHeader',
            false,
            {
              bgColor: !(index % 2 === 0),
              groupWithZeroTask: groupTasks?.length === 0,
              isLastGroupOfList: index === listGroups?.length - 1,
            },
            [],
            true,
          ),
          ...groupTasks.map(
            (taskIdentifier: string, groupTaskIndex: number) => {
              const task = tasksMap[taskIdentifier];
              const children =
                task.itemType === 'TASK' ? task.subtasks : task.tasks;
              return convert(
                taskIdentifier,
                VTask,
                'Task',
                !!collapseMap[taskIdentifier],
                {
                  task,
                  isNextVirtualTaskItemTypeBundle:
                    groupTaskIndex === groupTasks.length - 1
                      ? false
                      : tasksMap[groupTasks[groupTaskIndex + 1]]?.itemType ===
                        'BUNDLE',
                  bgColor: !(index % 2 === 0),
                  isLastTaskOfGroup: groupTaskIndex === groupTasks.length - 1,
                  isLastGroupOfList: index === listGroups?.length - 1,
                },
                children
                  .filter(
                    (child: any) =>
                      task.itemType === 'TASK' ||
                      currentTaskListTasksStatus === TaskStatus.ALL ||
                      tasksMap[child]?.status === currentTaskListTasksStatus ||
                      (currentTaskListTasksStatus === TaskStatus.INCOMPLETE &&
                        showCompletedWorkflowIdentifiers.includes(
                          task?.identifier,
                        )) ||
                      (currentTaskListTasksStatus === TaskStatus.COMPLETE &&
                        showIncompleteWorkflowIdentifiers.includes(
                          task?.identifier,
                        )),
                  )
                  .map((child: any, childIndex: number) => {
                    return convert(
                      child?.taskIdentifier ?? child,
                      task.itemType === 'TASK' ? VSubtask : VTask,
                      task.itemType === 'TASK' ? 'Subtask' : 'TaskOfBundle',
                      !!collapseMap[child?.taskIdentifier ?? child],
                      {
                        task: child,
                        isNextVirtualTaskItemTypeBundle:
                          children.indexOf(child) === children.length - 1
                            ? tasksMap[groupTasks[groupTaskIndex + 1]]
                                ?.itemType === 'BUNDLE'
                            : false,
                        isTaskTemplate: true,
                        isLastChild:
                          children.indexOf(child) === children.length - 1,
                        bgColor: !(index % 2 === 0),
                        isLastTaskOfGroup:
                          groupTaskIndex === groupTasks.length - 1 &&
                          childIndex === children.length - 1,
                        isLastSubtaskParentTask:
                          childIndex === children.length - 1,
                        isLastGroupOfList: index === listGroups?.length - 1,
                      },
                      !!tasksMap[child]?.subtasks.length
                        ? tasksMap[child].subtasks.map(
                            (subtask: any, subTaskIndex: number) => {
                              return convert(
                                subtask.taskIdentifier,
                                VSubtask,
                                'Subtask',
                                false,
                                {
                                  task: subtask,
                                  bgColor: !(index % 2 === 0),
                                  isLastTaskOfGroup:
                                    groupTaskIndex === groupTasks.length - 1 &&
                                    subTaskIndex ===
                                      tasksMap[child]?.subtasks.length - 1,
                                  isLastSubtaskParentTask:
                                    subTaskIndex ===
                                      tasksMap[child]?.subtasks.length - 1 &&
                                    childIndex === children.length - 1,
                                  isLastGroupOfList:
                                    index === listGroups?.length - 1,
                                  isNextVirtualTaskItemTypeBundle:
                                    subTaskIndex ===
                                      tasksMap[child]?.subtasks.length - 1 &&
                                    childIndex === children.length - 1
                                      ? tasksMap[groupTasks[groupTaskIndex + 1]]
                                          ?.itemType === 'BUNDLE'
                                      : false,
                                  isWorkflowSubTask: true,
                                },
                                [],
                              );
                            },
                          )
                        : [],
                    );
                  }),
              );
            },
          ),
        ];

        if (listTaskGroup?.hasMore) {
          children.push(
            convert(
              uniqueId().toString(),
              VLoadMoreTasks,
              'LoadMoreTasks',
              false,
              { listTaskGroup, bgColor: !(index % 2 === 0) },
              [],
            ),
          );
        }

        return convert(
          group.taskGroupIdentifier,
          VListGroup,
          'ListGroup',
          !!collapseMap[group.taskGroupIdentifier],
          {
            name: group.groupName,
            taskGroupIdentifier: group.taskGroupIdentifier,
            bgColor: !(index % 2 === 0),
            groupTaskCounts: group?.metricValue,
            tasksCount: groupTasks?.length,
            isLastGroupOfList: index === listGroups?.length - 1,
          },
          children,
          true,
        );
      })
      .concat(
        convert(
          uniqueId().toString(),
          VAddGroup,
          'AddGroup',
          false,
          {},
          [],
          true,
        ),
      );
  }, [
    listGroups,
    groupedTasks,
    collapseMap,
    tasksMap,
    currentTaskListTasksStatus,
    showCompletedWorkflowIdentifiers,
    showIncompleteWorkflowIdentifiers,
  ]);

  // const dispatch = useDispatch();
  // const handleDragEnd = ({ draggableId, destination, source }: DropResult) => {
  //   const xs = nodes[0]?.children
  //     .map((task) => task.id)
  //     .filter((id) => id.length > 3);
  //   const xs2 = xs.slice();
  //   xs2.splice(xs.indexOf(draggableId), 1);
  //   xs2.splice(destination?.index!, 0, draggableId);
  //   dispatch(reorderTasksInGroup({ destination, source }));
  // };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    get: (id: string) => {
      return collapseMap[id];
    },
    set: (id: string, value: boolean) => {
      collapseDispatch([id, value]);
    },
    workflowIdentifierMap,
    handleAddWorkflowIdentifier,
    handleRemoveWorkflowIdentifier,
  };

  return (
    <div
      ref={elementRef}
      style={{
        height: '100%',
      }}
    >
      <CollapseContext.Provider value={contextValue}>
        <Virtualized nodes={nodes} tasksMap={tasksMap} />
      </CollapseContext.Provider>
    </div>
  );
}

// @ts-ignore
export default withVirtualTaskListScrollContext(VirtualTaskList);
