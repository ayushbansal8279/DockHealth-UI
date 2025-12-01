/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import isEmpty from 'ramda/src/isEmpty';
import compose from 'ramda/src/compose';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask, loadSubTasks } from 'actions/task-actions';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import { taskLookupSelector } from 'selectors/task-details-selectors';
import { useSubtaskQuickAddState } from 'hooks/useSubtaskQuickAdd';
import * as TaskActions from 'actions/task-actions';
// import { taskDetailsSelector } from 'selectors/list-details-selectors';
import { CollapseContext } from 'views/list-details/VirtualTaskList/VirtualTaskList';
import useActions from 'hooks/use-actions';
import TaskItem from './TaskItem';
import Subtasks from './Subtasks';
import { getMatchedComments, originConfig } from './helpers';
import { ParentTaskContainer, SubtasksWrapper, TaskContainer } from '../styled';
import QuickAddSubtask from './QuickAddSubtask';
import { TaskViewContext } from '@/app/context-api/task-view-context';

const Task = React.memo(
  ({
    taskIdentifier: taskItemIdentifier,
    templateBundleIdentifier,
    patient: parentPatient,
    taskGroupIdentifier,
    isCompletedGroup,
    isFullView,
    isStartedDnD,
    isDragging,
    draggableProvided = {},
    isDraggable,
    // addingNewSubtask,
    subtasksDisabled,
    areFiltersApplied,
    isSearchApplied,
    shouldShowBlockModalOnDrag,
    showClearSortFiltersModal,
    highlightedTasksParentIdentifier,
    noMargin,
    origin,
    viewSetup,
    isTaskTemplate,
    isWorkflowSubtask,
    isLastChild,
    pageBackground,
    isNestedTask,
    isVirtualTask,
    isVirtualSubtask,
    $width,
    isNextVirtualTaskItemTypeBundle,
    isLastTaskOfGroup,
    isFirstTaskOfGroup,
    isNextTaskItemTypeBundle,
    isAddingTask,
    viewType,
    isDragPreview,
    isFirstTaskOfWorkflow,
    isFirstSubTaskOfParentTask,
    isTopLevelTaskOrWorkflowHeader,
    isWorkflowTask,
    isSubtaskOfTask,
    isFirstSubtaskOfWorkflowTask,
    taskItemDragAndDropDisabled,
    ...restProps
  }) => {
    const parentTaskReference = useRef(null);

    // const pulledTask = useSelector((state) =>
    //   taskDetailsSelector(state, taskItemIdentifier),
    // );
    const pulledTask = useSelector((state) => {
      return taskLookupSelector(state, origin, taskItemIdentifier);
    });

    const task = pulledTask;

    const {
      taskIdentifier,
      comments,
      subtasks,
      patient,
      searchMetaData = {},
      subTasksCount = 0,
      taskList,
    } = task || {};

    const subtaskQuickAddOpen = useSubtaskQuickAddState(taskIdentifier);

    const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
    const { highlightedValue } = restProps;
    const { matchingCommentIdentifiers = [] } = searchMetaData;
    const { changeViewType } = useContext(TaskViewContext);
    const collapse = useContext(CollapseContext);
    const taskActions = useActions(TaskActions);
    const isSlimView = changeViewType === 'SLIM_VIEW';
    const defaultCollapsed = isSlimView; // SLIM: true, FULL: false
    // collapseMap value or default based on view
    const isCollapsed = collapse.getOrDefault(taskIdentifier, defaultCollapsed);
    const areSubtasksOpen = !isCollapsed;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const renderedSubtasks = addingNewSubtask ? [...subtasks, {}] : subtasks;
    const renderedSubtasks = subtasks;

    const dispatch = useDispatch();

    // const handleSetSubtasksOpen = useCallback(
    //   (areOpen) => {
    //     if (
    //       subTasksCount > 0 &&
    //       isEmpty(renderedSubtasks) &&
    //       !subtasksDisabled &&
    //       !isFullView &&
    //       areOpen
    //     ) {
    //       dispatch(loadSubTasks(task));
    //     }
    //     // setAreSubtasksOpen(areOpen);
    //     collapse.set(taskIdentifier, !areOpen);
    //     // collapse.set(taskKey(taskIdentifier), nextCollapsed);
    //   },
    //   [
    //     subTasksCount,
    //     renderedSubtasks,
    //     subtasksDisabled,
    //     isFullView,
    //     collapse,
    //     taskIdentifier,
    //     dispatch,
    //     task,
    //   ],
    // );

    const handleToggleSubtasks = useCallback(() => {
      const nextCollapsed = !isCollapsed;
      const nextAreOpen = !nextCollapsed;
      if (
        nextAreOpen &&
        subTasksCount > 0 &&
        isEmpty(renderedSubtasks) &&
        !subtasksDisabled &&
        !isFullView
      ) {
        dispatch(loadSubTasks(task));
      }
      // Save new collapsed state to context
      if (subTasksCount > 0) {
        collapse.set(taskIdentifier, nextCollapsed);
      }
    }, [
      changeViewType,
      collapse,
      taskIdentifier,
      subTasksCount,
      renderedSubtasks,
      subtasksDisabled,
      isFullView,
      dispatch,
      task,
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleUpdateTask = useCallback(
      compose(dispatch, TaskActions.partialUpdateTask),
      [dispatch],
    );

    useEffect(() => {
      if (!areSubtasksOpen && subtaskQuickAddOpen && !subtasksDisabled) {
        const timer = setTimeout(() => {
          handleToggleSubtasks();
        }, 0);
        return () => clearTimeout(timer);
      }
    }, [
      handleToggleSubtasks,
      areSubtasksOpen,
      subtaskQuickAddOpen,
      isFullView,
      subtasksDisabled,
    ]);

    const matchingComments = useMemo(
      () => getMatchedComments(comments, matchingCommentIdentifiers),
      [comments, matchingCommentIdentifiers],
    );

    const showComments = useMemo(
      () => !isEmpty(matchingComments) && !isStartedDnD,
      [matchingComments, isStartedDnD],
    );

    const showSubtasks = useMemo(
      () =>
        (subTasksCount > 0 ||
          !isEmpty(renderedSubtasks) ||
          subtaskQuickAddOpen) &&
        !isStartedDnD &&
        (!subtasksDisabled ||
          ((areFiltersApplied || isSearchApplied) &&
            renderedSubtasks?.length > 0)),
      [
        subTasksCount,
        renderedSubtasks,
        isStartedDnD,
        subtasksDisabled,
        areFiltersApplied,
        isSearchApplied,
        subtaskQuickAddOpen,
      ],
    );
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

    const onClickComment = useCallback(() => {
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(task));
    }, [dispatch, task]);

    const taskBundleId =
      task?.taskGroups?.length > 1 &&
      task?.taskGroups?.[1].groupType === 'TASK_BUNDLE'
        ? task?.taskGroups?.[1].taskGroupIdentifier
        : undefined;

    return (
      <ParentTaskContainer
        ref={parentTaskReference}
        noMargin={noMargin}
        {...draggableProps}
        isVirtualTask={isVirtualTask}
        origin={origin}
        isLastChild={isLastChild}
        $width={$width}
        isNextTaskItemTypeBundle={isNextTaskItemTypeBundle}
        isAddingTask={isAddingTask}
        $isVirtualSubtask={isVirtualSubtask}
        $isWorkflowTask={isTaskTemplate}
        disableRightOffset={originConfig[origin]?.disableRightOffset ?? false}
      >
        <TaskContainer ref={innerRef}>
          <TaskItem
            isTaskTemplate={isTaskTemplate}
            isLastChild={isLastChild}
            taskItemIdentifier={task?.identifier}
            templateBundleIdentifier={templateBundleIdentifier || taskBundleId}
            patient={parentPatient}
            taskGroupIdentifier={taskGroupIdentifier}
            isOpen={areSubtasksOpen}
            switchOpen={handleToggleSubtasks}
            dragHandleProps={dragHandleProps}
            onTaskUpdate={handleUpdateTask}
            isDragging={isDragging}
            isDraggable={isDraggable}
            updateWorkflowStatus={taskActions.updateWorkflowStatus}
            isCompletedGroup={isCompletedGroup}
            subtasksDisabled={subtasksDisabled}
            subtaskQuickAddOpen={subtaskQuickAddOpen}
            origin={origin}
            isSelectedByHighlighted={
              highlightedTasksParentIdentifier &&
              (highlightedTasksParentIdentifier === task?.taskIdentifier ||
                highlightedTasksParentIdentifier === task?.parentTaskIdentifier)
            }
            viewSetup={viewSetup}
            isNestedTask={isNestedTask}
            isWorkflowSubtask={isWorkflowSubtask}
            isVirtualTask={isVirtualTask}
            isVirtualSubtask={isVirtualSubtask}
            pageBackground={pageBackground}
            {...restProps}
            isNextVirtualTaskItemTypeBundle={isNextVirtualTaskItemTypeBundle}
            isLastTaskOfGroup={isLastTaskOfGroup}
            isFirstTaskOfGroup={isFirstTaskOfGroup}
            viewType={changeViewType}
            isDragPreview={isDragPreview}
            isFirstTaskOfWorkflow={isFirstTaskOfWorkflow}
            isFirstSubTaskOfParentTask={isFirstSubTaskOfParentTask}
            isTopLevelTaskOrWorkflowHeader={isTopLevelTaskOrWorkflowHeader}
            isWorkflowTask={isWorkflowTask}
            isSubtaskOfTask={isSubtaskOfTask}
            isFirstSubtaskOfWorkflowTask={isFirstSubtaskOfWorkflowTask}
            taskItemDragAndDropDisabled={taskItemDragAndDropDisabled}
          />
        </TaskContainer>
        {showComments && window.disabledVirtualTaskList && (
          <TaskComments
            isOpen={isFullView}
            comments={comments}
            highlightedValue={highlightedValue}
            onClickComment={onClickComment}
          />
        )}
        {showSubtasks && window.disabledVirtualTaskList && (
          <SubtasksWrapper>
            <Subtasks
              isFetchingSubTasks={task?.isFetchingSubTasks}
              parentTask={task}
              subtasks={renderedSubtasks}
              subTasksCount={subTasksCount}
              isOpen={areSubtasksOpen}
              isFullView={isFullView}
              parentHasPatient={!!patient}
              taskList={taskList}
              draggableProvided={draggableProvided}
              isDraggable={isDraggable}
              showClearSortFiltersModal={showClearSortFiltersModal}
              shouldShowBlockModalOnDrag={shouldShowBlockModalOnDrag}
              origin={origin}
              isWorkflowSubtask={isWorkflowTask}
              isSubtaskOfTask={isTopLevelTaskOrWorkflowHeader}
              {...restProps}
            />
            {subtaskQuickAddOpen &&
              (renderedSubtasks?.length > 0 || subTasksCount === 0) && (
                <QuickAddSubtask
                  taskListIdentifier={taskList?.taskListIdentifier}
                  parentTaskIdentifier={taskIdentifier}
                  onFocus={handleQuickAddOnFocus}
                  origin={origin}
                />
              )}
          </SubtasksWrapper>
        )}
      </ParentTaskContainer>
    );
  },
);

export default Task;
