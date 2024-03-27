import React, { createContext, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniqueId } from 'lodash';
import Virtualized, { Node } from 'views/list-details/modules/Virtualized';
import VListGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VListGroup/VListGroup';
import VTask from 'views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask';
import VSubtask from 'views/list-details/VirtualTaskList/VirtualSegment/VSubtask/VSubtask';
import VAddGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VAddGroup/VAddGroup';
import VQuickAddTask from 'views/list-details/VirtualTaskList/VirtualSegment/VQuickAddTask/VQuickAddTask';
import VTaskHeader from 'views/list-details/VirtualTaskList/VirtualSegment/VTaskHeader/VTaskHeader';
import { DropResult } from 'react-beautiful-dnd';
import { reorderTasksInGroup } from 'actions/list-details-actions';

export interface Props {
  tasksToMap: any[];
  groupedTasks: any[];
}

export const CollapseContext = createContext({
  get: (id: string) => {},
  set: (id: string, value: boolean) => {},
  workflowIdentifierMap: [],
  handleAddWorkflowIdentifier: {},
  handleRemoveWorkflowIdentifier: {},
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
  // @ts-ignore
  const tasksMap = useSelector((state) => state.listDetails.tasksMap);
  // @ts-ignore
  const listGroups = useSelector((state) => state.listDetails.listGroups);
  const handleAddWorkflowIdentifier = (identifier) => {
    setWorkflowIdentifierMap([...workflowIdentifierMap, identifier]);
  };
  const handleRemoveWorkflowIdentifier = (identifier) => {
    const newArray = workflowIdentifierMap.filter(
      (item) => item !== identifier,
    );
    setWorkflowIdentifierMap(newArray);
  };
  // const nodes: Node[] = useMemo(() => {
  //   // @ts-ignore
  //   return listGroups
  //     .map((group) => {
  //       const groupTasks =
  //         groupedTasks.find(
  //           (groupedTask) =>
  //             groupedTask.groupIdentifier === group.taskGroupIdentifier,
  //         )?.tasks ?? [];
  //       return convert(
  //         group.taskGroupIdentifier,
  //         VListGroup,
  //         'ListGroup',
  //         !!collapseMap[group.taskGroupIdentifier],
  //         { name: group.groupName, taskGroupIdentifier: group.taskGroupIdentifier },
  //         [
  //           convert(
  //             uniqueId().toString(),
  //             VQuickAddTask,
  //             'QuickAddTask',
  //             false,
  //             {
  //               taskGroupIdentifier: group.taskGroupIdentifier,
  //             },
  //             [],
  //             true,
  //           ),
  //           convert(
  //             uniqueId().toString(),
  //             VTaskHeader,
  //             'TaskHeader',
  //             false,
  //             {},
  //             [],
  //             true,
  //           ),
  //         ].concat(
  //           ...groupTasks.map((taskIdentifier: string) => {
  //             const task = tasksMap[taskIdentifier];
  //             const children =
  //               task.itemType === 'TASK' ? task.subtasks : task.tasks;
  //             return convert(
  //               taskIdentifier,
  //               VTask,
  //               'Task',
  //               !!collapseMap[taskIdentifier],
  //               { task },
  //               children.map((child: any) => {
  //                 return convert(
  //                   child?.taskIdentifier ?? child,
  //                   task.itemType === 'TASK' ? VSubtask : VTask,
  //                   task.itemType === 'TASK' ? 'Subtask' : 'TaskOfBundle',
  //                   !!collapseMap[child?.taskIdentifier ?? child],
  //                   {
  //                   isTaskTemplate: true,
  //                     isLastChild:
  //                       children.indexOf(child) === children.length - 1,
  //                 },
  //                   !!tasksMap[child]?.subtasks.length
  //                     ? tasksMap[child].subtasks.map((subtask: any) => {
  //                         return convert(
  //                           subtask.taskIdentifier,
  //                           VSubtask,
  //                           'Subtask',
  //                           false,
  //                           { task: subtask },
  //                           [],
  //                         );
  //                       })
  //                     : [],
  //                 );
  //               }),
  //             );
  //           }),
  //         ),
  //         true,
  //       );
  //     })
  //     .concat(
  //       convert(
  //         uniqueId().toString(),
  //         VAddGroup,
  //         'AddGroup',
  //         false,
  //         {},
  //         [],
  //         true,
  //       ),
  //     );
  const nodes: Node[] = useMemo(() => {
    return [
      convert(
        uniqueId().toString(),
        VAddGroup,
        'AddGroup',
        false,
        {},
        [],
        true,
      ),
    ].concat(
      listGroups.map((group, index) => {
        const groupTasks = groupedTasks
          ? groupedTasks.find(
              (groupedTask) =>
                groupedTask.groupIdentifier === group.taskGroupIdentifier,
            )?.tasks ?? []
          : [];
        return convert(
          group.taskGroupIdentifier,
          VListGroup,
          'ListGroup',
          !!collapseMap[group.taskGroupIdentifier],
          {
            name: group.groupName,
            taskGroupIdentifier: group.taskGroupIdentifier,
            bgColor: !!(index % 2 === 0),
          },
          [
            convert(
              uniqueId().toString(),
              VQuickAddTask,
              'QuickAddTask',
              false,
              {
                taskGroupIdentifier: group.taskGroupIdentifier,
                bgColor: !!(index % 2 === 0),
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
                bgColor: !!(index % 2 === 0),
              },
              [],
              true,
            ),
          ].concat(
            ...groupTasks.map((taskIdentifier: string, groupTaskIndex) => {
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
                  bgColor: !!(index % 2 === 0),
                  isLastTaskOfGroup: groupTaskIndex === groupTasks.length - 1,
                },
                children.map((child: any) => {
                  return convert(
                    child?.taskIdentifier ?? child,
                    task.itemType === 'TASK' ? VSubtask : VTask,
                    task.itemType === 'TASK' ? 'Subtask' : 'TaskOfBundle',
                    !!collapseMap[child?.taskIdentifier ?? child],
                    {
                      isTaskTemplate: true,
                      isLastChild:
                        children.indexOf(child) === children.length - 1,
                      bgColor: !!(index % 2 === 0),
                    },
                    !!tasksMap[child]?.subtasks.length
                      ? tasksMap[child].subtasks.map((subtask: any) => {
                          return convert(
                            subtask.taskIdentifier,
                            VSubtask,
                            'Subtask',
                            false,
                            { task: subtask, bgColor: !!(index % 2 === 0) },
                            [],
                          );
                        })
                      : [],
                  );
                }),
              );
            }),
          ),
          true,
        );
      }),
    );
  }, [groupedTasks, tasksMap, collapseMap, listGroups]);

  const dispatch = useDispatch();
  const handleDragEnd = ({ draggableId, destination, source }: DropResult) => {
    const xs = nodes[0]?.children
      .map((task) => task.id)
      .filter((id) => id.length > 3);
    const xs2 = xs.slice();
    xs2.splice(xs.indexOf(draggableId), 1);
    xs2.splice(destination?.index!, 0, draggableId);
    // console.log('handleDragEnd', destination, source, xs, xs2);
    dispatch(reorderTasksInGroup({ destination, source }));
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    get: (id: string) => {
      return collapseMap[id];
    },
    set: (id: string, value: boolean) => {
      collapseDispatch([id, value]);
    },
    workflowIdentifierMap: workflowIdentifierMap,
    handleAddWorkflowIdentifier: handleAddWorkflowIdentifier,
    handleRemoveWorkflowIdentifier: handleRemoveWorkflowIdentifier,
  };

  return (
    <div
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

export default VirtualTaskList;
