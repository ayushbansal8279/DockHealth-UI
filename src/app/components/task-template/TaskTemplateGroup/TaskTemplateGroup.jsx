/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useState,
  useMemo,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import ThreeDotsIcon from 'img/three-dots';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHoriz } from '@material-ui/icons';
import * as ModalActions from 'modal/actions';
import palette from 'styles/palette';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import ProgressBar from 'components/common/ProgressBar/ProgressBar';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { TaskStatus } from 'helpers/task-helpers';
import {
  TaskTemplateGroupContainer,
  TaskTemplateGroupHeader,
  TaskTemplateGroupHeaderContainer,
  TaskTemplateGroupList,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
  TaskTemplateNameInput,
} from './styled';

const TaskTemplateGroup = ({
  templateGroup = {},
  taskItemConfig,
  groupHasMultipleAssignees,
  isFullView,
  isStartedDnD,
  draggableProvided = {},
  groupDragAndDropDisabled,
  tasksDragAndDropDisabled,
}) => {
  const { name, tasks, identifier } = templateGroup;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const [isOpen, setOpen] = useState(true);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInputValue, setNameInputValue] = useState(name);
  const nameInputReference = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setNameInputValue(name);
  }, [name]);

  const [completedTasksAmount, allTasksAmount] = useMemo(
    () =>
      tasks.reduce(
        (accumulator, currentTask) => {
          if (currentTask.status === TaskStatus.COMPLETE) {
            accumulator[0] += 1;
          }

          accumulator[0] += currentTask?.subTasksCompletedCount;
          accumulator[1] =
            accumulator[1] + (currentTask?.subTasksCount || 0) + 1;

          return accumulator;
        },
        [0, 0],
      ),
    [tasks],
  );

  const menuOptions = useMemo(() => {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    let opts = [
      {
        name: 'Edit Name',
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
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () => {
                dispatch(
                  TemplateBundleActions.duplicateTemplateBundle(
                    identifier,
                    true,
                  ),
                );
              },
              skip: () => {
                dispatch(
                  TemplateBundleActions.duplicateTemplateBundle(
                    identifier,
                    false,
                  ),
                );
              },
            }),
          ),
      },
      {
        name: 'Move',
        onClick: () =>
          dispatch(
            ModalActions.openModal('SelectDestination', {
              confirmText: 'Move',
              confirm: ({ taskListIdentifier, taskGroupIdentifier }) => {
                dispatch(
                  TemplateBundleActions.moveTemplateBundle({
                    bundleIdentifier: identifier,
                    taskListIdentifier,
                    taskGroupIdentifier,
                  }),
                );
              },
            }),
          ),
      },
    ];

    if (!showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: 'Show completed tasks',
          onClick: () => setShowCompletedTasks(true),
        },
      ];
    }

    if (showCompletedTasks) {
      opts = [
        ...opts,
        {
          name: 'Hide completed tasks',
          onClick: () => setShowCompletedTasks(false),
        },
      ];
    }

    return [
      ...opts,
      {
        name: 'Delete',
        onClick: () =>
          dispatch(TemplateBundleActions.deleteTemplateBundle(identifier)),
      },
    ];
  }, [dispatch, identifier, showCompletedTasks]);

  const handleNameInputKeyDown = useCallback(
    event => {
      const { key } = event;
      if (key === 'Enter') {
        dispatch(
          TemplateBundleActions.updateTemplateBundle({
            bundle: templateGroup,
            dataToUpdate: {
              name: event.target?.value,
            },
          }),
        );
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      } else if (key === 'Escape') {
        // eslint-disable-next-line no-unused-expressions
        nameInputReference.current?.blur();
      }
    },
    [dispatch, templateGroup],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        task => showCompletedTasks || task.status !== TaskStatus.COMPLETE,
      ),
    [showCompletedTasks, tasks],
  );

  return (
    <TaskTemplateGroupContainer ref={innerRef} {...draggableProps}>
      <TaskTemplateGroupHeaderContainer>
        {!groupDragAndDropDisabled && !bulkEditIsActive && (
          <TemplateHandle
            src={ThreeDotsIcon}
            alt="Handle"
            {...dragHandleProps}
          />
        )}
        <TaskTemplateGroupHeader onClick={() => setOpen(!isOpen)}>
          <RotatableChevron rotated={isOpen} />
          <TaskTemplateNameInput
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
        </TaskTemplateGroupHeader>
        <TaskTemplateOptionsContainer>
          <TaskTemplateProgressCircle>
            <ProgressBar
              progress={(completedTasksAmount / allTasksAmount) * 100}
              label={`${completedTasksAmount}/${allTasksAmount}`}
            />
          </TaskTemplateProgressCircle>
          <OptionsMenu options={menuOptions}>
            <MoreHoriz
              fontSize="large"
              color="inherit"
              style={{ color: palette.coolGrey1 }}
            />
          </OptionsMenu>
        </TaskTemplateOptionsContainer>
      </TaskTemplateGroupHeaderContainer>
      {!isStartedDnD && (
        <TaskTemplateGroupList timeout={150} in={isOpen && !isStartedDnD}>
          <DragDropContext
            onBeforeCapture={({ draggableId: id }) =>
              setDraggedTaskIdentifier(id)
            }
            onDragEnd={dragEndData => {
              setDraggedTaskIdentifier(null);
              dispatch(
                TemplateBundleActions.reorderSubtasksInTemplateBundle({
                  ...dragEndData,
                  bundle: templateGroup,
                  completedTasksShown: showCompletedTasks,
                }),
              );
            }}
          >
            <Droppable droppableId={templateGroup.identifier}>
              {templateDroppableProvided => (
                <div
                  ref={templateDroppableProvided.innerRef}
                  {...templateDroppableProvided.droppableProps}
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.taskIdentifier}
                      draggableId={task.taskIdentifier}
                      index={index}
                    >
                      {(templateTaskDraggableProvided, draggableSnapshot) => (
                        <StandardTaskItemContainer
                          isStartedDnD={
                            draggedTaskIdentifier === task.taskIdentifier
                          }
                          isDragging={draggableSnapshot.isDragging}
                          draggableProvided={templateTaskDraggableProvided}
                          task={task}
                          taskItemConfig={taskItemConfig}
                          isFullView={isFullView}
                          multipleAssigneesContext={groupHasMultipleAssignees}
                          dragAndDropDisabled={tasksDragAndDropDisabled}
                          isDraggable
                          isBundleTask
                        />
                      )}
                    </Draggable>
                  ))}
                  {templateDroppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TaskTemplateGroupList>
      )}
    </TaskTemplateGroupContainer>
  );
};

export default TaskTemplateGroup;
