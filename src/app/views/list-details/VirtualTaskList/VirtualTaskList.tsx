import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { uniqueId } from 'lodash';
import { TaskStatus } from 'helpers/task-helpers';
import { getTaskCount, getPatientCount } from 'components/tasklist/TasksGroup/helper';
import Virtualized, { Node } from 'views/list-details/modules/Virtualized';
import VListGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VListGroup/VListGroup';
import VTask from 'views/list-details/VirtualTaskList/VirtualSegment/VTask/VTask';
import VSubtask from 'views/list-details/VirtualTaskList/VirtualSegment/VSubtask/VSubtask';
import VAddGroup from 'views/list-details/VirtualTaskList/VirtualSegment/VAddGroup/VAddGroup';
import VQuickAddTask from 'views/list-details/VirtualTaskList/VirtualSegment/VQuickAddTask/VQuickAddTask';
import VTaskHeader from 'views/list-details/VirtualTaskList/VirtualSegment/VTaskHeader/VTaskHeader';
import {
  currentTaskListSelector,
} from 'selectors/task-list-selectors';
import VLoadMoreTasks from './VirtualSegment/VLoadMoreTasks/VLoadMoreTasks';
import {
  useVirtualTaskListScrollContext,
  withVirtualTaskListScrollContext,
} from './VirtualTaskListScrollContext';
import localStorageHelper from '@/app/helpers/local-storage-helper';
import { getTaskListWorkflowStatusStorageKey } from '@/app/helpers/tasklist-helpers';
import {
  currentListTasksStatusSelector,
  patientSelector,
} from '@/app/selectors/patient-details-selectors';
import VListSpacer from './VirtualSegment/VListSpacer/VListSpacer';
import { userPreferenceStatusSelector } from '@/app/selectors/user-preference-selectors';

export interface Props {
  groupedTasks: any[];
  showClearSortFiltersModal: any;
  origin: any;
  sort?: any;
  onSortChange?: (key: string, order: string) => void;
}

export const CollapseContext = createContext<{
  get: (id: string) => boolean;
  set: (id: string, value: boolean) => void;
  workflowIdentifierMap: any[];
  handleAddWorkflowIdentifier: (identifier: any) => void;
  handleRemoveWorkflowIdentifier: (identifier: any) => void;
}>({
  get: (id: string) => false,
  set: (id: string, value: boolean) => {},
  workflowIdentifierMap: [],
  handleAddWorkflowIdentifier: (identifier: any) => {},
  handleRemoveWorkflowIdentifier: (identifier: any) => {},
});

// Helper function to create nodes
const createNode = (
  id: string,
  type: any,
  kind: string,
  collapsed: boolean,
  data: any,
  children: Node[] = [],
  phantom: boolean = false,
  handlers: any = {},
): Node => ({
  id,
  phantom,
  type,
  kind,
  collapsed,
  data,
  children,
  handlers,
});

// Helper function to check if task should be shown based on status filters
const shouldShowTask = (
  task: any,
  child: any,
  tasksMap: Record<string, any>,
  isShowCompletedTasksEnabled: boolean,
  currentTaskListTasksStatus: string,
  showCompletedWorkflowIdentifiers: string[],
  showIncompleteWorkflowIdentifiers: string[],
): boolean => {
  if (task.itemType === 'TASK') return true;
  if (isShowCompletedTasksEnabled) return true;
  if (currentTaskListTasksStatus === TaskStatus.ALL) return true;
  if (tasksMap[child]?.status === currentTaskListTasksStatus) return true;
  if (
    currentTaskListTasksStatus === TaskStatus.INCOMPLETE &&
    showCompletedWorkflowIdentifiers.includes(task?.identifier)
  )
    return true;
  if (
    currentTaskListTasksStatus === TaskStatus.COMPLETE &&
    showIncompleteWorkflowIdentifiers.includes(task?.identifier)
  )
    return true;
  return false;
};

// Helper function to create subtask nodes
const createSubtaskNodes = (
  subtasks: any[],
  index: number,
  groupTaskIndex: number,
  groupTasksLength: number,
  childrenLength: number,
  childIndex: number,
  listGroupsLength: number,
  patientTaskIdentifiers: string[],
  tasksMap: Record<string, any>,
  origin: string,
): Node[] => {
  return subtasks.map((subtask: any, subTaskIndex: number) =>
    createNode(
      subtask.taskIdentifier,
      VSubtask,
      'Subtask',
      false,
      {
        itemType: subtask?.itemType,
        bgColor: !(index % 2 === 0),
        isLastTaskOfGroup:
          groupTaskIndex === groupTasksLength - 1 &&
          subTaskIndex === subtasks.length - 1,
        isLastSubtaskParentTask:
          subTaskIndex === subtasks.length - 1 &&
          childIndex === childrenLength - 1,
        isLastGroupOfList: index === listGroupsLength - 1,
        isNextVirtualTaskItemTypeBundle:
          subTaskIndex === subtasks.length - 1 &&
          childIndex === childrenLength - 1
            ? tasksMap[patientTaskIdentifiers[groupTaskIndex + 1]]?.itemType ===
              'BUNDLE'
            : false,
        isWorkflowSubTask: true,
        isFirstSubtaskOfWorkflowTask: subTaskIndex === 0,
        origin,
      },
      [],
    ),
  );
};

function VirtualTaskList({
  groupedTasks,
  showClearSortFiltersModal,
  origin,
  sort: sortProp,
  onSortChange: onSortChangeProp,
}: Props) {
  const [collapseMap, collapseDispatch] = useReducer(
    (map: Record<string, boolean>, [id, value]: [string, boolean]) => {
      map[id] = value;
      return { ...map };
    },
    {},
  );
  const [workflowIdentifierMap, setWorkflowIdentifierMap] = useState<any[]>([]);

  const tasksMap = useSelector((state: any) =>
    origin === 'PATIENT'
      ? state.patientDetails?.tasksMap
      : state.listDetails?.tasksMap,
  );

  const listGroups = useSelector((state: any) => state.listDetails?.listGroups);
  const showCompletedWorkflowIdentifiers = useSelector(
    (state: any) => state?.taskItems?.showCompletedWorkflowIdentifiers,
  );
  const showIncompleteWorkflowIdentifiers = useSelector(
    (state: any) => state?.taskItems?.showIncompleteWorkflowIdentifiers,
  );
  const currentTaskListTasksStatus = useSelector(userPreferenceStatusSelector);
  const currentPatientTasksStatus = useSelector(currentListTasksStatusSelector);
  const currentTaskList = useSelector(currentTaskListSelector);
  const currentPatient = useSelector(patientSelector);

  const storageKey = getTaskListWorkflowStatusStorageKey(
    currentTaskList?.taskListIdentifier,
  );
  const isShowCompletedTasksEnabled =
    localStorageHelper.getItem(storageKey) ?? false;

  const elementRef = useRef(null);
  const { updateVisibleWidth } = useVirtualTaskListScrollContext();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect.width) {
        updateVisibleWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, [updateVisibleWidth]);

  const handleAddWorkflowIdentifier = (identifier: any) => {
    setWorkflowIdentifierMap((prev) => [...prev, identifier]);
  };

  const handleRemoveWorkflowIdentifier = (identifier: any) => {
    setWorkflowIdentifierMap((prev) =>
      prev.filter((item) => item !== identifier),
    );
  };

  // Helper function to create task children nodes
  const createTaskChildren = (
    task: any,
    children: any[],
    groupTaskIndex: number,
    groupTasksLength: number,
    index: number,
    listGroupsLength: number,
    taskGroupIdentifier: string,
    origin: string,
    patientTaskIdentifiers?: string[],
  ): Node[] => {
    return children
      .filter((child: any) =>
        shouldShowTask(
          task,
          child,
          tasksMap,
          isShowCompletedTasksEnabled,
          currentTaskListTasksStatus,
          showCompletedWorkflowIdentifiers,
          showIncompleteWorkflowIdentifiers,
        ),
      )
      .map((child: any, childIndex: number) => {
        const isLastChild = childIndex === children.length - 1;
        const nextTaskIdentifier = patientTaskIdentifiers
          ? patientTaskIdentifiers[groupTaskIndex + 1]
          : undefined;

        return createNode(
          child?.taskIdentifier ?? child,
          task.itemType === 'TASK' ? VSubtask : VTask,
          task.itemType === 'TASK' ? 'Subtask' : 'TaskOfBundle',
          !!collapseMap[child?.taskIdentifier ?? child],
          {
            itemType: child?.itemType,
            isNextVirtualTaskItemTypeBundle: isLastChild
              ? patientTaskIdentifiers && nextTaskIdentifier
                ? tasksMap[nextTaskIdentifier]?.itemType === 'BUNDLE'
                : false
              : false,
            isTaskTemplate: true,
            isLastChild,
            bgColor: !(index % 2 === 0),
            isLastTaskOfGroup:
              groupTaskIndex === groupTasksLength - 1 &&
              childIndex === children.length - 1,
            isFirstTaskOfWorkflow: childIndex === 0,
            isFirstSubTaskOfParentTask: childIndex === 0,
            isLastSubtaskParentTask: childIndex === children.length - 1,
            isLastGroupOfList: index === listGroupsLength - 1,
            isSubtaskOfTask: true,
            isWorkflowTask: true,
            origin,
          },
          tasksMap[child]?.subtasks?.length
            ? createSubtaskNodes(
                tasksMap[child].subtasks,
                index,
                groupTaskIndex,
                groupTasksLength,
                children.length,
                childIndex,
                listGroupsLength,
                patientTaskIdentifiers || [],
                tasksMap,
                origin,
              )
            : [],
        );
      });
  };

  // Helper function to create group children
  const createGroupChildren = (
    origin: string,
    groupTasks: any[],
    index: number,
    listGroupsLength: number,
    taskGroupIdentifier: string,
    isLoadingGroup: boolean = false,
    hasMore: boolean = false,
    listTaskGroup?: any,
    patientTaskIdentifiers?: string[],
    sort?: any,
    onSortChange?: (key: string, order: string) => void,
  ): Node[] => {
    const children = [
      createNode(
        uniqueId().toString(),
        VQuickAddTask,
        'QuickAddTask',
        false,
        {
          taskGroupIdentifier,
          bgColor: !(index % 2 === 0),
          groupWithZeroTask: groupTasks?.length === 0,
          isLoadingGroup,
          origin,
        },
        [],
        true,
      ),
      createNode(
        uniqueId().toString(),
        VTaskHeader,
        'TaskHeader',
        false,
        {
          bgColor: !(index % 2 === 0),
          groupWithZeroTask: groupTasks?.length === 0,
          isLastGroupOfList: index === listGroupsLength - 1,
          isLoadingGroup,
          origin,
          sort,
          onSortChange,
        },
        [],
        true,
      ),
      ...groupTasks.map((taskIdentifier: string, groupTaskIndex: number) => {
        const task = tasksMap[taskIdentifier];
        const children = task.itemType === 'TASK' ? task.subtasks : task.tasks;

        return createNode(
          taskIdentifier,
          VTask,
          'Task',
          !!collapseMap[taskIdentifier],
          {
            itemType: task?.itemType,
            isNextVirtualTaskItemTypeBundle:
              groupTaskIndex === groupTasks.length - 1
                ? false
                : tasksMap[groupTasks[groupTaskIndex + 1]]?.itemType ===
                  'BUNDLE',
            bgColor: !(index % 2 === 0),
            isLastTaskOfGroup: groupTaskIndex === groupTasks.length - 1,
            isFirstTaskOfGroup: groupTaskIndex === 0,
            isLastGroupOfList: index === listGroupsLength - 1,
            taskGroupIdentifier,
            isTopLevelTaskOrWorkflowHeader: true,
            origin,
          },
          createTaskChildren(
            task,
            children,
            groupTaskIndex,
            groupTasks.length,
            index,
            listGroupsLength,
            taskGroupIdentifier,
            origin,
            patientTaskIdentifiers,
          ),
        );
      }),
    ];

    if (hasMore && listTaskGroup) {
      children.push(
        createNode(
          uniqueId().toString(),
          VLoadMoreTasks,
          'LoadMoreTasks',
          false,
          { listTaskGroup, bgColor: !(index % 2 === 0) },
          [],
        ),
      );
    }

    return children;
  };

  const nodes = useMemo(() => {
    if (origin === 'PATIENT') {
      return groupedTasks
        .map((group, index: number) => {
          const patientTasks = group?.tasks;
          const patientTaskIdentifiers = patientTasks?.map(
            (task: any) => task?.identifier,
          );

          return createNode(
            'DEFAULT_PATIENT_TASK_GROUP',
            VListGroup,
            'ListGroup',
            false,
            {
              name: 'Default',
              taskGroupIdentifier: 'DEFAULT_PATIENT_TASK_GROUP',
              bgColor: false,
              groupTaskCounts: patientTasks?.length,
              tasksCount: patientTasks?.length,
              isLastGroupOfList: false,
              origin,
            },
            createGroupChildren(
              origin,
              patientTaskIdentifiers,
              index,
              listGroups?.length || 0,
              'DEFAULT_PATIENT_TASK_GROUP',
              false,
              false,
              undefined,
              patientTaskIdentifiers,
              sortProp,
              onSortChangeProp,
            ),
            true,
          );
        })
        .concat(
          createNode(
            uniqueId().toString(),
            VListSpacer,
            'ListSpacer',
            false,
            {},
          ),
        );
    } else {
      return listGroups
        .map((group: any, index: number) => {
          const groupTasks =
            groupedTasks?.find(
              (groupedTask) =>
                groupedTask.groupIdentifier === group.taskGroupIdentifier,
            )?.tasks ?? [];

          const listTaskGroup = groupedTasks?.find(
            (groupedTask) =>
              groupedTask.groupIdentifier === group.taskGroupIdentifier,
          );

          const groupTaskCounts = getTaskCount(group?.metrics);
          const numberOfPatients = getPatientCount(group?.metrics);

          return createNode(
            group.taskGroupIdentifier,
            VListGroup,
            'ListGroup',
            !!collapseMap[group.taskGroupIdentifier],
            {
              name: group.groupName,
              taskGroupIdentifier: group.taskGroupIdentifier,
              bgColor: !(index % 2 === 0),
              groupTaskCounts,
              numberOfPatients,
              tasksCount: groupTasks?.length,
              isLastGroupOfList: index === listGroups?.length - 1,
              origin,
            },
            createGroupChildren(
              origin,
              groupTasks,
              index,
              listGroups?.length || 0,
              group.taskGroupIdentifier,
              listTaskGroup?.isLoadingGroup,
              listTaskGroup?.hasMore,
              listTaskGroup,
              undefined,
              sortProp,
              onSortChangeProp,
            ),
            true,
          );
        })
        .concat(
          createNode(
            uniqueId().toString(),
            VAddGroup,
            'AddGroup',
            false,
            {},
            [],
            true,
          ),
          createNode(
            uniqueId().toString(),
            VListSpacer,
            'ListSpacer',
            false,
            {},
          ),
        );
    }
  }, [
    origin,
    groupedTasks,
    listGroups,
    collapseMap,
    tasksMap,
    currentTaskListTasksStatus,
    currentPatientTasksStatus,
    showCompletedWorkflowIdentifiers,
    showIncompleteWorkflowIdentifiers,
    isShowCompletedTasksEnabled,
  ]);

  const contextValue = {
    get: (id: string) => !!collapseMap[id],
    set: (id: string, value: boolean) => collapseDispatch([id, value]),
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
        <Virtualized
          nodes={nodes}
          tasksMap={tasksMap}
          showClearSortFiltersModal={showClearSortFiltersModal}
          showCompletedWorkflowIdentifiers={showCompletedWorkflowIdentifiers}
          showIncompleteWorkflowIdentifiers={showIncompleteWorkflowIdentifiers}
          currentTaskListTasksStatus={
            origin === 'PATIENT'
              ? currentPatientTasksStatus
              : currentTaskListTasksStatus
          }
        />
      </CollapseContext.Provider>
    </div>
  );
}

// @ts-ignore
export default withVirtualTaskListScrollContext(VirtualTaskList);
