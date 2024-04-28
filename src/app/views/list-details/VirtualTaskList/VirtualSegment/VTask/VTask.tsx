import React, {
  ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
// import QuickAddSubtask from '@/app/components/task/StandardTaskItem/QuickAddSubtask';
// import { taskLookupSelector } from '@/app/selectors/task-details-selectors';
// import { useSelector } from 'react-redux';
import * as Sc from './styled';
import * as TaskActions from 'actions/task-actions';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { useDispatch, useSelector } from 'react-redux';
import { taskLookupSelector } from '@/app/selectors/task-details-selectors';
import QuickAddSubtask from '@/app/components/task/StandardTaskItem/QuickAddSubtask';
import { QuickAddInputWrapper } from '@/app/components/task-template/TaskTemplateGroup/styled';
import QuickAddTaskInput from '@/app/components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { CollapseContext } from '../../VirtualTaskList';
import palette from '@/app/styles/palette';
import { useVirtualTaskListScrollContext } from '../../VirtualTaskListScrollContext';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  isLastChild: boolean;
  bgColor: boolean;
  isLastTaskOfGroup: boolean;
  isLastGroupOfList: boolean;
  isNextVirtualTaskItemTypeBundle: boolean;
}

export const VTaskContext = createContext({
  isVirtualListWorkflowOpen: true,
});

function VTask(
  {
    metadata,
    register,
    isTaskTemplate,
    isLastChild,
    isLastTaskOfGroup,
    bgColor,
    isLastGroupOfList,
    isNextVirtualTaskItemTypeBundle,
    ...record
  }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const parentTaskReference = useRef(null);
  const [subtaskQuickAddOpen, setSubtaskQuickAddOpen] = useState(false);
  const { get, workflowIdentifierMap, handleRemoveWorkflowIdentifier } =
    useContext(CollapseContext);
  const pulledTask = useSelector((state) => {
    // @ts-ignore
    return taskLookupSelector(state, origin, metadata.id);
  });
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;

  const percentage =
    ((!!droppableHeaderWidth ? droppableHeaderWidth : 0) / screenWidth) * 100;
  const task = pulledTask;
  const { taskList, taskGroups, identifier } = task;
  const [subTasksCount, setsubTasksCount] = useState(task?.subtasks?.length);

  const [addWorkflowTask, setAddWorkflowTask] = useState(false);
  const taskGroup = !!taskGroups
    ? taskGroups.filter((taskGroup) =>
        taskGroup?.groupType === 'TASK_BUNDLE' ? taskGroup : '',
      )
    : '';

  useEffect(() => {
    setSubtaskQuickAddOpen(task?.subtaskQuickAddOpen);
    setsubTasksCount(task?.subtasks?.length);
    workflowIdentifierMap.some(
      (identifier) => identifier === taskGroup[0]?.taskGroupIdentifier,
    )
      ? setAddWorkflowTask(true)
      : setAddWorkflowTask(false);
  }, [task, workflowIdentifierMap]);

  const handleQuickAddOnFocus = () => {
    setTimeout(() => {
      parentTaskReference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      window.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }, 500);
  };

  const handleAddBundleTask = useCallback(
    (workflowTask) => {
      const taskData = {
        ...workflowTask,
        taskGroupIdentifier: taskGroup[0]?.taskGroupIdentifier,
        taskListIdentifier: taskList?.taskListIdentifier,
      };
      dispatch(TaskActions.saveTask(taskData));
    },
    [
      dispatch,
      // identifier,
      taskGroup,
      taskList?.taskListIdentifier,
    ],
  );

  const contextValue = {
    isVirtualListWorkflowOpen: get(identifier),
  };
  return (
    // <div
    //   style={{
    //     width: '100%',
    //     background: bgColor ? palette.aliceBlue : '',
    //     paddingBottom: isLastTaskOfGroup ? '20px' : '0px',
    //   }}
    // >
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <Sc.VTask
            {...register}
            ref={parentTaskReference}
            $subitem={metadata.level > 1}
            // @ts-ignore
            $workflow={record.task?.itemType === 'BUNDLE'}
            $template={isTaskTemplate && isLastChild}
            isTaskTemplate={isTaskTemplate}
            isLastChild={isLastChild || false}
            origin={TaskOrigin.LIST}
            bgColor={bgColor}
            isLastTaskOfGroup={isLastTaskOfGroup}
            virtualListWorkflowOpen={get(identifier)}
            subtaskQuickAddOpen={subtaskQuickAddOpen}
            addWorkflowTask={addWorkflowTask}
            subTaskExpanded={!metadata.collapsed && task?.subtasks?.length}
            isLastGroupOfList={isLastGroupOfList}
            isNextVirtualTaskItemTypeBundle={isNextVirtualTaskItemTypeBundle}
            $width={percentage > 90 ? `${droppableHeaderWidth + 70}` : '100%'}
          >
            <VTaskContext.Provider value={contextValue}>
              <StandardTaskItem
                // @ts-ignore
                taskIdentifier={metadata.id}
                draggableProvided={provided}
                isDraggable
                isDragging={snapshot.isDragging}
                isTaskTemplate={isTaskTemplate}
                isLastChild={isLastChild || false}
                origin={TaskOrigin.LIST}
                pageBackground={bgColor ? palette.aliceBlue : ''}
                isNestedTask
                isVirtualTask
                $width={percentage > 90}
              />
            </VTaskContext.Provider>
          </Sc.VTask>
          {subtaskQuickAddOpen && subTasksCount === 0 && (
            <div
              style={{
                width:
                  percentage > 90 ? `${droppableHeaderWidth + 70}` : '100%',
                background: bgColor ? palette.aliceBlue : '',
                paddingBottom: !addWorkflowTask
                  ? isLastTaskOfGroup
                    ? bgColor
                      ? '20px'
                      : isLastGroupOfList
                      ? '20px'
                      : '0px'
                    : isTaskTemplate &&
                      isLastChild &&
                      !isNextVirtualTaskItemTypeBundle
                    ? '10px'
                    : ''
                  : '',
              }}
            >
              <Sc.QuickAddContainer
                $width={
                  percentage > 90
                    ? visibleWidth
                      ? `${visibleWidth}px`
                      : '100%'
                    : `${visibleWidth - 120}px`
                }
              >
                <QuickAddSubtask
                  taskListIdentifier={task.taskList.taskListIdentifier}
                  parentTaskIdentifier={metadata.id}
                  onFocus={handleQuickAddOnFocus}
                  // origin={origin}
                />
              </Sc.QuickAddContainer>
            </div>
          )}
          {isTaskTemplate &&
            isLastChild &&
            addWorkflowTask &&
            (task?.subtasks?.length === 0 || metadata?.collapsed) && (
              <div
                style={{
                  width:
                    percentage > 90 ? `${droppableHeaderWidth + 70}` : '100%',
                  background: bgColor ? palette.aliceBlue : '',
                  paddingBottom: addWorkflowTask
                    ? isLastTaskOfGroup
                      ? bgColor
                        ? '20px'
                        : isLastGroupOfList
                        ? '20px'
                        : '0px'
                      : isTaskTemplate &&
                        isLastChild &&
                        !isNextVirtualTaskItemTypeBundle
                      ? '10px'
                      : ''
                    : '0px',
                }}
              >
                <Sc.WorkflowQuickAddTaskContainer
                  $width={
                    percentage > 90
                      ? visibleWidth
                        ? `${visibleWidth}px`
                        : '100%'
                      : `${visibleWidth - 85}px`
                  }
                >
                  <QuickAddInputWrapper>
                    <QuickAddTaskInput
                      // autofocus
                      disableMentions
                      quickAddTask={handleAddBundleTask}
                      onBlur={() => {
                        handleRemoveWorkflowIdentifier(
                          taskGroup[0]?.taskGroupIdentifier,
                        );
                      }}
                      validator={(value) => {
                        if (
                          [...value]?.filter((char) => char !== ' ').length < 2
                        )
                          return 'The task description is too short (min. 2 characters)';

                        return null;
                      }}
                      origin={TaskOrigin.LIST}
                      // iconColorActive={iconColorActive}
                    />
                  </QuickAddInputWrapper>
                </Sc.WorkflowQuickAddTaskContainer>
              </div>
              // {/* // )} */}
            )}
        </>
        // </div>
      )}
    </Draggable>
    // </div>
  );
}

export default forwardRef(VTask);
