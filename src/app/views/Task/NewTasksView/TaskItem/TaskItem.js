import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { isEmpty } from 'ramda';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Grid } from '@material-ui/core';
import ArrowIcon from 'img/arrow';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import CalendarDimIcon from 'img/calendar-dim';
import CalendarIcon from 'img/calendar-icon';
import CalendarNewIcon from 'img/calendar-new';
import ClipDimIcon from 'img/clip-dim';
import ClipIcon from 'img/clip-v2';
import ClipNewIcon from 'img/clip-new';
import LabelDimIcon from 'img/label-dim';
import LabelIcon from 'img/label';
import MessageDimIcon from 'img/message-dim';
import MessageIcon from 'img/message';
import MessageNewIcon from 'img/message-new';
import ThreeDotsIcon from 'img/three-dots';
import Member from 'components/members/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import LowPriorityHoverLabel from 'img/priority-label-hover-icon.svg';
import TaskItemStatus from './TaskItemStatus';
import TaskComments from '../TaskComments/TaskComments';
import {
  AddCrossIcon,
  CircleIcon,
  Description,
  DescriptionBox,
  DueDate,
  DueDateContainer,
  GridImg,
  SubtasksGroupLabel,
  SmallText,
  TaskItemCell,
  TaskItemContainer,
  TaskItemPanel,
  ThreeDots,
  PrioritySwitch,
  CompletedBy,
  InfoText,
} from './styled';

import { Tasks as SubtasksContainer, Arrow } from '../TasksGroup/styled';

const COMMENTS = 'COMMENTS';
const DUE_DATE = 'DUE_DATE';
const LABELS = 'LABELS';
const ATTACHMENTS = 'ATTACHMENTS';

const LIGHT = 'LIGHT';
const REGULAR = 'REGULAR';
// const NEW = 'NEW';

const ITEM_ICONS = {
  COMMENTS: {
    LIGHT: MessageDimIcon,
    REGULAR: MessageIcon,
    NEW: MessageNewIcon,
  },
  DUE_DATE: {
    LIGHT: CalendarDimIcon,
    REGULAR: CalendarIcon,
    NEW: CalendarNewIcon,
  },
  LABELS: {
    LIGHT: LabelDimIcon,
    REGULAR: LabelIcon,
    NEW: LabelIcon,
  },
  ATTACHMENTS: {
    LIGHT: ClipDimIcon,
    REGULAR: ClipIcon,
    NEW: ClipNewIcon,
  },
};

const getItemIconVersion = value => {
  if (!isEmpty(value) && value) return REGULAR;

  return LIGHT;
};

const getItemIcon = (type, value) =>
  ITEM_ICONS[type][getItemIconVersion(value)];

const TaskItem = ({
  isOpen,
  switchOpen,
  toggleCompleteTask,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  task,
  draggableProvied,
  isDragging,
  isCompletedGroup,
}) => {
  const {
    edited,
    assignedTo,
    attachments,
    comments,
    description,
    dueDate,
    labels,
    patient,
    subtasks,
    workflowStatus,
    completedDt,
    completedBy,
  } = task;

  const isCompleted = task.status === 'COMPLETE';

  const { innerRef, draggableProps, dragHandleProps } = draggableProvied;

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <TaskItemPanel ref={innerRef} {...draggableProps} isDragging={isDragging}>
      <TaskItemContainer>
        {!isCompletedGroup && (
          <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        )}
        <PrioritySwitch onClick={() => toggleTaskPriority(task)}>
          {task.priority === 'HIGH' ? (
            <img src={HighPriorityLabel} alt="Priority icon" />
          ) : (
            <img
              className="low"
              src={LowPriorityHoverLabel}
              alt="No priority"
            />
          )}
        </PrioritySwitch>
        <TaskItemCell bolded padding="huge">
          <CircleIcon
            src={isCompleted ? CircleCompleted : Circle}
            onClick={() => toggleCompleteTask(task)}
          />
          <DescriptionBox>
            <Description
              isCrossedOut={!isCompletedGroup && isCompleted}
              onClick={() => {
                openDrawer();
                storeAsCurrentTask(task);
              }}
            >
              {description}
              {edited && <SmallText> (Edited)</SmallText>}
            </Description>
            <CompletedBy isCompleted={isCompleted}>
              <span>{`Completed by ${completedByName} ${completedDt &&
                ` on ${
                  completedDt
                    ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                    : ''
                }`}
                `}</span>
            </CompletedBy>
            {!isEmpty(subtasks) && (
              <SubtasksGroupLabel onClick={() => switchOpen(!isOpen)}>
                <span>{subtasks?.length} subtasks</span>
                <Arrow alt="arrow" isOpen={isOpen} src={ArrowIcon} />
              </SubtasksGroupLabel>
            )}
          </DescriptionBox>
        </TaskItemCell>
        <TaskItemCell width="164px">
          {patient ? `${patient.firstName} ${patient.lastName}` : ''}
        </TaskItemCell>
        <TaskItemCell width="110px" padding="regular">
          {task.status === 'COMPLETE' ? (
            <InfoText>Completed</InfoText>
          ) : (
            workflowStatus && <TaskItemStatus workflowStatus={workflowStatus} />
          )}
        </TaskItemCell>
        <TaskItemCell width="200px">
          <Grid container>
            <GridImg item xs={3}>
              <img alt="comments" src={getItemIcon(COMMENTS, comments)} />
            </GridImg>
            <GridImg item xs={3}>
              <DueDateContainer>
                <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
                <img alt="due-date" src={getItemIcon(DUE_DATE, dueDate)} />
              </DueDateContainer>
            </GridImg>
            <GridImg item xs={3}>
              <img alt="labels" src={getItemIcon(LABELS, labels)} />
            </GridImg>
            <GridImg item xs={3}>
              <img
                alt="attachments"
                src={getItemIcon(ATTACHMENTS, attachments)}
              />
            </GridImg>
          </Grid>
        </TaskItemCell>
        <TaskItemCell width="80px" justify="center">
          {assignedTo ? (
            <Member member={assignedTo} size={34} />
          ) : (
            <AddCrossIcon src={CrossIcon} size="34px" />
          )}
        </TaskItemCell>
      </TaskItemContainer>
    </TaskItemPanel>
  );
};

const Subtasks = ({
  subtasks,
  isOpen,
  isFullView,
  groupId,
  taskListIdentifier,
  parentTaskId,
  reorderSubtasksForTask,
  ...restProps
}) => {
  const [isStartedSubtaskDnd, setSubtaskDnd] = useState(false);
  const [orderedSubtasks, reorderSubtasksInState] = useState(subtasks);
  const subtasksOrder = subtasks.map(({ taskIdentifier }) => taskIdentifier);

  useEffect(() => {
    reorderSubtasksInState(subtasks);
  }, [subtasks]);

  return (
    <DragDropContext
      onBeforeCapture={() => {
        setSubtaskDnd(true);
      }}
      onDragEnd={eventBundle => {
        const { destination, source } = eventBundle;
        if (destination && destination?.index !== source?.index) {
          const newSubtasksOrder = [...subtasksOrder];
          newSubtasksOrder.splice(
            destination.index,
            0,
            newSubtasksOrder.splice(source.index, 1)[0],
          );

          reorderSubtasksForTask(
            newSubtasksOrder,
            groupId,
            taskListIdentifier,
            parentTaskId,
          );

          const reorderedTasks = newSubtasksOrder.map(taskId =>
            orderedSubtasks.find(
              ({ taskIdentifier }) => taskIdentifier === taskId,
            ),
          );

          reorderSubtasksInState(reorderedTasks);
          setSubtaskDnd(false);
        }
      }}
    >
      <Droppable droppableId="droppable">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <SubtasksContainer issubtasks="true" in={isOpen}>
              {!isEmpty(orderedSubtasks) &&
                orderedSubtasks?.map((subtask, index) => (
                  <Draggable
                    key={subtask.taskId}
                    draggableId={String(subtask.taskId)}
                    index={index}
                  >
                    {(draggableProvied, { isDragging: isDraggingSubtask }) => (
                      <>
                        <TaskItem
                          draggableProvied={draggableProvied}
                          key={subtask.taskId}
                          task={subtask}
                          isDragging={isDraggingSubtask}
                          {...restProps}
                        />
                        {!isStartedSubtaskDnd && !isEmpty(subtask.comments) && (
                          <TaskComments
                            isOpen={isFullView}
                            comments={subtask.comments}
                          />
                        )}
                        {draggableProvied.placeholder}
                      </>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </SubtasksContainer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const Task = ({
  task,
  isFullView,
  isStartedDnD,
  isDragging,
  dragandDropProps,
  groupId,
  taskListIdentifier,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const { comments, subtasks } = task;

  return (
    <div>
      <TaskItem
        task={task}
        isOpen={isOpen}
        switchOpen={switchOpen}
        draggableProvied={dragandDropProps}
        isDragging={isDragging}
        {...restProps}
      />
      {!isEmpty(comments) && !isStartedDnD && (
        <TaskComments isOpen={isFullView} comments={comments} />
      )}
      {!isStartedDnD && (
        <Subtasks
          subtasks={subtasks}
          isOpen={isOpen}
          isFullView={isFullView}
          groupId={groupId}
          taskListIdentifier={taskListIdentifier}
          parentTaskId={task.taskId}
          {...restProps}
        />
      )}
    </div>
  );
};

export default Task;
