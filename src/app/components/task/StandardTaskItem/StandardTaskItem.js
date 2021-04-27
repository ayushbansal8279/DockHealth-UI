/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask, loadSubTasks } from 'actions/task-actions';
import { isEmpty } from 'ramda';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import TaskItem from './TaskItem';
import Subtasks from './Subtasks';
import { getMatchedComments } from './helpers';
import { ParentTaskContainer, SubtasksWrapper } from '../styled';
import QuickAddSubtask from './QuickAddSubtask';

const Task = ({
  task,
  isFullView,
  isStartedDnD,
  isDragging,
  draggableProvided = {},
  taskGroupIdentifier,
  isDraggable,
  addingNewSubtask,
  addingNewSubtaskParentId,
  subtaskShape,
  subtasksDisabled,
  areFiltersApplied,
  isSearchApplied,
  listNameVisible,
  patientVisible = true,
  shouldShowBlockModalOnDrag,
  showClearSortFiltersModal,
  selectedTask,
  highlightedTasksParentIdenditifer,
  noMargin,
  ...restProps
}) => {
  const parentTaskReference = useRef(null);
  const [areSubtasksOpen, setAreSubtasksOpen] = useState(false);
  const {
    taskIdentifier,
    comments,
    subtasks,
    patient,
    searchMetaData = {},
    subTasksCount,
    taskList,
    subtaskQuickAddOpen,
  } = task || {};

  const { taskIdentifier: selectedTaskIdentifier } = selectedTask || {};
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const { highlightedValue, multipleAssigneesContext } = restProps;
  const { matchingCommentIdentifiers = [] } = searchMetaData;

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
      ? [...subtasks, subtaskShape]
      : subtasks;

  const dispatch = useDispatch();

  const handleSetSubtasksOpen = useCallback(
    areOpen => {
      if (
        subTasksCount > 0 &&
        isEmpty(renderedSubtasks) &&
        !subtasksDisabled &&
        !isFullView
      ) {
        dispatch(loadSubTasks(task));
      }
      setAreSubtasksOpen(areOpen);
    },
    [
      subTasksCount,
      renderedSubtasks,
      subtasksDisabled,
      dispatch,
      task,
      isFullView,
    ],
  );

  useEffect(() => {
    if (isFullView) handleSetSubtasksOpen(true);
    else setAreSubtasksOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullView]);

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
      });
    }, 500);
  };

  const onClickComment = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ParentTaskContainer
      ref={parentTaskReference}
      noMargin={noMargin}
      {...draggableProps}
    >
      <div ref={innerRef}>
        <TaskItem
          task={task}
          isOpen={areSubtasksOpen}
          listNameVisible={listNameVisible}
          patientVisible={patientVisible}
          switchOpen={handleSetSubtasksOpen}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          subtasks={renderedSubtasks}
          subTasksCount={subTasksCount}
          isDraggable={isDraggable}
          subtasksDisabled={subtasksDisabled}
          isFullView={isFullView}
          isSelected={
            selectedTaskIdentifier === task.taskIdentifier ||
            (highlightedTasksParentIdenditifer &&
              (highlightedTasksParentIdenditifer === task.taskIdentifier ||
                highlightedTasksParentIdenditifer ===
                  task.parentTaskIdentifier))
          }
          {...restProps}
        />
      </div>
      {showComments && (
        <TaskComments
          isOpen={isFullView}
          comments={comments}
          highlightedValue={highlightedValue}
          onClickComment={onClickComment}
        />
      )}
      {showSubtasks && (
        <SubtasksWrapper>
          <Subtasks
            isFetchingSubTasks={task?.isFetchingSubTasks}
            parentTask={task}
            subtasks={renderedSubtasks}
            subTasksCount={subTasksCount}
            isOpen={areSubtasksOpen}
            isFullView={isFullView}
            taskGroupIdentifier={taskGroupIdentifier}
            parentHasPatient={!!patient}
            taskList={taskList}
            isDraggable={isDraggable}
            listNameVisible={listNameVisible}
            patientVisible={patientVisible}
            showClearSortFiltersModal={showClearSortFiltersModal}
            shouldShowBlockModalOnDrag={shouldShowBlockModalOnDrag}
            selectedTaskIdentifier={selectedTaskIdentifier}
            {...restProps}
          />
          {subtaskQuickAddOpen &&
            (renderedSubtasks?.length > 0 || subTasksCount === 0) && (
              <QuickAddSubtask
                patientVisible={patientVisible}
                listNameVisible={listNameVisible}
                taskListIdentifier={taskList?.taskListIdentifier}
                parentTaskIdentifier={taskIdentifier}
                multipleAssigneesContext={multipleAssigneesContext}
                onFocus={handleQuickAddOnFocus}
              />
            )}
        </SubtasksWrapper>
      )}
    </ParentTaskContainer>
  );
};

export default React.memo(Task);
