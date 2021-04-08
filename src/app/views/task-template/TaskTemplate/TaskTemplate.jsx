import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Collapse } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { onTaskOrderChanged } from 'helpers/ga-event-helper';
import { taskTemplateDetailsSelector } from 'selectors/task-template-selectors';
import * as TaskTemplateActions from 'actions/task-template-actions';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import {
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
} from 'components/task/StandardTaskItem/helpers';
import {
  TaskTemplateContainer,
  TaskTemplateHeader,
  NameInput,
  Description,
  ArrowButton,
  MenuContainer,
} from './styled';

const TEMPLATES_VIEW_COLUMNS_CONFIG = [
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
];

const TaskTemplate = ({ template }) => {
  const { taskTemplateIdentifier, name, description } = template;

  const [draggableId, setDraggableId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const nameInputReference = useRef(null);

  const dispatch = useDispatch();
  const { isOpen, isFetching, tasks } =
    useSelector(taskTemplateDetailsSelector(taskTemplateIdentifier)) || {};

  useEffect(() => {
    setNameInputValue(name);
    // eslint-disable-next-line no-unused-expressions
    nameInputReference.current?.blur();
  }, [name]);

  const menuOptions = useMemo(
    () => [
      {
        name: 'Edit',
        onClick: () => {
          setIsEditing(true);
          // eslint-disable-next-line no-unused-expressions
          nameInputReference.current?.focus();
        },
      },
      {
        name: 'Duplicate',
        onClick: () =>
          dispatch(
            TaskTemplateActions.duplicateTemplate(taskTemplateIdentifier),
          ),
      },
      {
        name: 'Delete this template',
        onClick: () =>
          dispatch(TaskTemplateActions.deleteTemplate(taskTemplateIdentifier)),
      },
    ],
    [taskTemplateIdentifier, dispatch, nameInputReference],
  );

  const handleNameInputKeyDown = useCallback(
    event => {
      const { key } = event;
      if (key === 'Enter') {
        dispatch(
          TaskTemplateActions.updateTemplate(taskTemplateIdentifier, {
            name: event.target?.value,
          }),
        );
      } else if (key === 'Escape') {
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, taskTemplateIdentifier],
  );

  const handleAddTaskToTemplate = useCallback(
    task => {
      dispatch(
        TaskTemplateActions.addTaskToTemplate({
          ...task,
          taskTemplateIdentifier,
        }),
      );
    },
    [dispatch, taskTemplateIdentifier],
  );

  const onBeforeCapture = useCallback(({ draggableId: id }) => {
    setDraggableId(id);
  }, []);

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      setDraggableId(null);
      onTaskOrderChanged();

      dispatch(
        TaskTemplateActions.reorderTasksForTemplate({
          taskTemplateIdentifier,
          source,
          destination,
        }),
      );
    },
    [dispatch, taskTemplateIdentifier],
  );

  return (
    <TaskTemplateContainer>
      <TaskTemplateHeader>
        <ArrowButton
          onClick={() =>
            dispatch(
              TaskTemplateActions.toggleTemplateOpen(taskTemplateIdentifier),
            )
          }
        >
          <RotatableChevron rotated={isOpen} />
        </ArrowButton>
        <NameInput
          ref={nameInputReference}
          readOnly={!isEditing}
          onChange={event => setNameInputValue(event.target?.value)}
          onBlur={() => {
            setIsEditing(false);
            setNameInputValue(name);
          }}
          onKeyDown={handleNameInputKeyDown}
          value={nameInputValue}
        />
        <OptionsMenu options={menuOptions}>
          <MenuContainer size="small">
            <MoreHoriz fontSize="large" color="inherit" />
          </MenuContainer>
        </OptionsMenu>
        {description && <Description>{description}</Description>}
      </TaskTemplateHeader>
      <Collapse in={isOpen}>
        <>
          {!isFetching ? (
            <>
              <Box m={0.4} />
              <DragDropContext
                onBeforeCapture={onBeforeCapture}
                onDragEnd={onDragEnd}
              >
                <Droppable droppableId="droppable">
                  {droppableProvided => (
                    <div
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {tasks?.map((task, index) => {
                        return (
                          <Draggable
                            key={task.taskIdentifier}
                            draggableId={task.taskIdentifier}
                            index={index}
                          >
                            {(draggableProvided, draggableSnapshot) => (
                              <StandardTaskItem
                                isStartedDnD={
                                  draggableId === task.taskIdentifier
                                }
                                isDragging={draggableSnapshot.isDragging}
                                draggableProvided={draggableProvided}
                                isDraggable
                                task={task}
                                taskItemConfig={TEMPLATES_VIEW_COLUMNS_CONFIG}
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <QuickAddTaskInput quickAddTask={handleAddTaskToTemplate} />
            </>
          ) : (
            <TasksSkeletonLoader rows={4} />
          )}
        </>
      </Collapse>
    </TaskTemplateContainer>
  );
};

export default TaskTemplate;
