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
import QuickAddSubatask from './QuickAddSubtask';

const Task = ({
  task,
  isFullView,
  isStartedDnD,
  isDragging,
  draggableProvided,
  groupId,
  currentUser,
  reassignTask,
  isDraggable,
  addingNewSubtask,
  addingNewSubtaskParentId,
  subtaskShape,
  subtasksDisabled,
  areFiltersApplied,
  isSearchApplied,
  listNameVisible,
  patientVisible = true,
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
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const { highlightedValue } = restProps;
  const { matchingCommentIdentifiers = [] } = searchMetaData;

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
      ? [...subtasks, subtaskShape]
      : subtasks;

  const dispatch = useDispatch();

  const handleSetSubtasksOpen = useCallback(
    areOpen => {
      if (subTasksCount > 0 && isEmpty(renderedSubtasks)) {
        dispatch(loadSubTasks(task));
      }
      setAreSubtasksOpen(areOpen);
    },
    [task, renderedSubtasks, setAreSubtasksOpen, dispatch, subTasksCount],
  );

  useEffect(() => {
    if (
      !areSubtasksOpen &&
      (areFiltersApplied || isSearchApplied || subtaskQuickAddOpen)
    ) {
      handleSetSubtasksOpen(true);
    }
  }, [
    areFiltersApplied,
    isSearchApplied,
    handleSetSubtasksOpen,
    areSubtasksOpen,
    subtaskQuickAddOpen,
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
    <ParentTaskContainer ref={parentTaskReference} {...draggableProps}>
      <div ref={innerRef}>
        <TaskItem
          task={task}
          isOpen={areSubtasksOpen}
          listNameVisible={listNameVisible}
          patientVisible={patientVisible}
          switchOpen={handleSetSubtasksOpen}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          currentUser={currentUser}
          reassignTask={reassignTask}
          subtasks={renderedSubtasks}
          subTasksCount={subTasksCount}
          isDraggable={isDraggable}
          subtasksDisabled={subtasksDisabled}
          isFullView={isFullView}
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
            groupId={groupId}
            parentTaskId={task.taskIdentifier}
            currentUser={currentUser}
            reassignTask={reassignTask}
            parentHasPatient={!!patient}
            taskList={taskList}
            isDraggable={isDraggable}
            listNameVisible={listNameVisible}
            patientVisible={patientVisible}
            {...restProps}
          />
          {subtaskQuickAddOpen &&
            (renderedSubtasks?.length > 0 || subTasksCount === 0) && (
              <QuickAddSubatask
                patientVisible={patientVisible}
                listNameVisible={listNameVisible}
                taskListIdentifier={taskList?.taskListIdentifier}
                parentTaskIdentifier={taskIdentifier}
                onFocus={handleQuickAddOnFocus}
              />
            )}
        </SubtasksWrapper>
      )}
    </ParentTaskContainer>
  );
};

export default React.memo(Task);
