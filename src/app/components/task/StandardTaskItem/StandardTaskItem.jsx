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
import * as TaskActions from 'actions/task-actions';
// import { taskDetailsSelector } from 'selectors/list-details-selectors';
import { CollapseContext } from 'views/list-details/VirtualTaskList/VirtualTaskList';
import useActions from 'hooks/use-actions';
import TaskItem from './TaskItem';
import Subtasks from './Subtasks';
import { getMatchedComments } from './helpers';
import { ParentTaskContainer, SubtasksWrapper, TaskContainer } from '../styled';
import QuickAddSubtask from './QuickAddSubtask';
import { ListPageContext } from '@/app/views/list-details/ListDetailsView';

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
    isNextTaskItemTypeBundle,
    isAddingTask,
    viewType,
    ...restProps
  }) => {
    const parentTaskReference = useRef(null);
    const [areSubtasksOpen, setAreSubtasksOpen] = useState(false);

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
      subtaskQuickAddOpen,
    } = task || {};

    const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
    const { highlightedValue } = restProps;
    const { matchingCommentIdentifiers = [] } = searchMetaData;
    const { tasks, handleAddTask } = useContext(ListPageContext);
    const taskActions = useActions(TaskActions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const renderedSubtasks = addingNewSubtask ? [...subtasks, {}] : subtasks;
    const renderedSubtasks = subtasks;

    const dispatch = useDispatch();

    const collapse = useContext(CollapseContext);

    const handleSetSubtasksOpen = useCallback(
      (areOpen) => {
        if (
          subTasksCount > 0 &&
          isEmpty(renderedSubtasks) &&
          !subtasksDisabled &&
          !isFullView &&
          areOpen
        ) {
          dispatch(loadSubTasks(task));
        }
        setAreSubtasksOpen(areOpen);
        collapse.set(taskIdentifier, !areOpen);
      },
      [
        subTasksCount,
        renderedSubtasks,
        subtasksDisabled,
        isFullView,
        collapse,
        taskIdentifier,
        dispatch,
        task,
      ],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleUpdateTask = useCallback(
      compose(dispatch, TaskActions.partialUpdateTask),
      [dispatch],
    );

    useEffect(() => {
      if (origin === 'PATIENT') {
        if (viewType === 'FULL_VIEW') {
          handleSetSubtasksOpen(true);
        } else {
          handleSetSubtasksOpen(false);
        }
      }
    }, [origin, viewType]);

    useEffect(() => {
      // if (isFullView) handleSetSubtasksOpen(true);
      // else setAreSubtasksOpen(false);
      if (viewType === 'FULL_VIEW') {
        if (!tasks.includes(taskIdentifier)) {
          handleSetSubtasksOpen(true);
          handleAddTask(taskIdentifier);
        } else {
          setAreSubtasksOpen(!collapse.get(taskIdentifier));
        }
      } else if (viewType === 'SLIM_VIEW') {
        if (!tasks.includes(taskIdentifier)) {
          handleSetSubtasksOpen(false);
          handleAddTask(taskIdentifier);
        } else {
          setAreSubtasksOpen(!collapse.get(taskIdentifier));
        }
      } else {
        handleSetSubtasksOpen(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewType]);

    useEffect(() => {
      if (!areSubtasksOpen && subtaskQuickAddOpen && !subtasksDisabled) {
        handleSetSubtasksOpen(true);
      }
    }, [
      handleSetSubtasksOpen,
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
            switchOpen={handleSetSubtasksOpen}
            dragHandleProps={dragHandleProps}
            onTaskUpdate={handleUpdateTask}
            isDragging={isDragging}
            isDraggable={isDraggable}
            updateWorkflowStatus={taskActions.updateWorkflowStatus}
            isCompletedGroup={isCompletedGroup}
            subtasksDisabled={subtasksDisabled}
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
            isWidthGreaterThanHudredPercent={$width}
            pageBackground={pageBackground}
            {...restProps}
            isNextVirtualTaskItemTypeBundle={isNextVirtualTaskItemTypeBundle}
            isLastTaskOfGroup={isLastTaskOfGroup}
            viewType={viewType}
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
