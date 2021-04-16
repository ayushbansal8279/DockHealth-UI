/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ThreeDotsIcon from 'img/three-dots';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-circular-progressbar/dist/styles.css';
import * as TaskActions from 'actions/task-actions';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItemContainer from 'components/task/StandardTaskItemContainer/StandardTaskItemContainer';
import TaskTemplateOptions from '../TaskTemplateOptions/TaskTemplateOptions';
import {
  TaskTemplateGroupContainer,
  TaskTemplateGroupHeader,
  TaskTemplateGroupHeaderContainer,
  TaskTemplateGroupList,
  TaskTemplateGroupName,
  TaskTemplateProgressCircle,
  TemplateHandle,
  TaskTemplateOptionsContainer,
} from './styled';

const TaskTemplateGroup = ({
  templateGroup = {},
  taskItemConfig,
  groupHasMultipleAssignees,
  isFullView,
  isStartedDnD,
  draggableProvided = {},
  dragAndDropDisabled,
  taskGroupIdentifier,
}) => {
  const { name, tasks, identifier } = templateGroup;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const [isOpen, setOpen] = useState(true);
  const { bulkEditIsActive } = useContext(BulkEditContext);
  const [draggedTaskIdentifier, setDraggedTaskIdentifier] = useState(null);
  const dispatch = useDispatch();

  const completedTasksAmount = useMemo(
    () => tasks?.filter(task => !!task.completedBy).length,
    [tasks],
  );

  return (
    <TaskTemplateGroupContainer ref={innerRef} {...draggableProps}>
      <TaskTemplateGroupHeaderContainer>
        {!dragAndDropDisabled && !bulkEditIsActive && (
          <TemplateHandle
            src={ThreeDotsIcon}
            alt="Handle"
            {...dragHandleProps}
          />
        )}
        <TaskTemplateGroupHeader onClick={() => setOpen(!isOpen)}>
          <RotatableChevron rotated={isOpen} />
          <TaskTemplateGroupName>{name}</TaskTemplateGroupName>
        </TaskTemplateGroupHeader>
        <TaskTemplateOptionsContainer>
          <TaskTemplateProgressCircle>
            <CircularProgressbar
              value={(completedTasksAmount / tasks?.length) * 100}
              text={`${completedTasksAmount}/${tasks?.length}`}
              styles={buildStyles({
                textSize: '32px',
                textColor: '#000000',
              })}
            />
          </TaskTemplateProgressCircle>
          <TaskTemplateOptions
            taskGroupIdentifier={taskGroupIdentifier}
            templateBundleIdentifier={identifier}
          />
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
                TaskActions.reorderSubtasksInTemplateBundle({
                  ...dragEndData,
                  templateBundle: templateGroup,
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
                  {tasks.map((task, index) => (
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
                          dragAndDropDisabled={dragAndDropDisabled}
                          isDraggable
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
