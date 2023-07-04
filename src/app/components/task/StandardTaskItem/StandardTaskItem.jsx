/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import isEmpty from 'ramda/src/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask, loadSubTasks } from 'actions/task-actions';
import TaskComments from 'components/tasklist/TaskComments/TaskComments';
import { taskLookupSelector } from 'selectors/task-details-selectors';
// import { taskDetailsSelector } from 'selectors/list-details-selectors';
import TaskItem from './TaskItem';
import Subtasks from './Subtasks';
import { getMatchedComments } from './helpers';
import { ParentTaskContainer, SubtasksWrapper } from '../styled';
import QuickAddSubtask from './QuickAddSubtask';

const Task = React.memo(
  ({
    task: taskItemIdentifier,
    isCompletedGroup,
    isFullView,
    isStartedDnD,
    isDragging,
    draggableProvided = {},
    isDraggable,
    addingNewSubtask,
    subtasksDisabled,
    areFiltersApplied,
    isSearchApplied,
    shouldShowBlockModalOnDrag,
    showClearSortFiltersModal,
    highlightedTasksParentIdentifier,
    noMargin,
    origin,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const renderedSubtasks = addingNewSubtask ? [...subtasks, {}] : subtasks;

    const dispatch = useDispatch();

    const handleSetSubtasksOpen = useCallback(
      (areOpen) => {
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

    return (
      <ParentTaskContainer
        ref={parentTaskReference}
        noMargin={noMargin}
        {...draggableProps}
      >
        <div ref={innerRef}>
          <TaskItem
            task={task?.identifier}
            isOpen={areSubtasksOpen}
            switchOpen={handleSetSubtasksOpen}
            dragHandleProps={dragHandleProps}
            isDragging={isDragging}
            isDraggable={isDraggable}
            isCompletedGroup={isCompletedGroup}
            subtasksDisabled={subtasksDisabled}
            origin={origin}
            isSelectedByHighlighted={
              highlightedTasksParentIdentifier &&
              (highlightedTasksParentIdentifier === task?.taskIdentifier ||
                highlightedTasksParentIdentifier === task?.parentTaskIdentifier)
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
              parentHasPatient={!!patient}
              taskList={taskList}
              isDraggable={isDraggable}
              showClearSortFiltersModal={showClearSortFiltersModal}
              shouldShowBlockModalOnDrag={shouldShowBlockModalOnDrag}
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
