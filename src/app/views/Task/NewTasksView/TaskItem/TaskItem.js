/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { isEmpty, pick } from 'ramda';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Grid } from '@material-ui/core';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import ArrowIcon from 'img/arrow';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import CalendarDimIcon from 'img/calendar-dim';
import CalendarIcon from 'img/calendar-icon';
import CalendarIconHover from 'img/calendar-icon-hover';
import CalendarNewIcon from 'img/calendar-new';
import ClipDimIcon from 'img/clip-dim';
import ClipIconHover from 'img/clip-hover';
import ClipIcon from 'img/clip-v2';
import ClipNewIcon from 'img/clip-new';
import LabelDimIcon from 'img/label-dim';
import LabelIcon from 'img/label';
import LabelIconHover from 'img/label-hover';
import MessageDimIcon from 'img/message-dim';
import MessageIcon from 'img/message';
import MessageIconHover from 'img/message-hover';
import MessageNewIcon from 'img/message-new';
import ThreeDotsIcon from 'img/three-dots';
import Member from 'components/members/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import LowPriorityHoverLabel from 'img/priority-label-hover-icon.svg';
import TaskItemStatus from './TaskItemStatus';
import TaskComments from '../TaskComments/TaskComments';
import TaskAssignMember from '../TaskAssignMember/TaskAssignMember';
import { onDragEndSubtask } from '../DragDrop.helpers';
import {
  AddCrossIcon,
  AddPlaceholder,
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
  PriorityHoverIcon,
} from './styled';

import { Tasks as SubtasksContainer, Arrow } from '../TasksGroup/styled';

const dueDateQuickSelectOptions = [
  {
    label: 'Today',
    date: moment(),
  },
  {
    label: 'Tomorrow',
    date: moment().add(1, 'days'),
  },
];

const COMMENTS = 'COMMENTS';
const DUE_DATE = 'DUE_DATE';
const LABELS = 'LABELS';
const ATTACHMENTS = 'ATTACHMENTS';

const LIGHT = 'LIGHT';
const REGULAR = 'REGULAR';
const HOVER = 'HOVER';
// const NEW = 'NEW';

const ITEM_ICONS = {
  COMMENTS: {
    LIGHT: MessageDimIcon,
    REGULAR: MessageIcon,
    NEW: MessageNewIcon,
    HOVER: MessageIconHover,
  },
  DUE_DATE: {
    LIGHT: CalendarDimIcon,
    REGULAR: CalendarIcon,
    NEW: CalendarNewIcon,
    HOVER: CalendarIconHover,
  },
  LABELS: {
    LIGHT: LabelDimIcon,
    REGULAR: LabelIcon,
    NEW: LabelIcon,
    HOVER: LabelIconHover,
  },
  ATTACHMENTS: {
    LIGHT: ClipDimIcon,
    REGULAR: ClipIcon,
    NEW: ClipNewIcon,
    HOVER: ClipIconHover,
  },
};

const getItemIconVersion = (value, isHovered) => {
  if (!isEmpty(value) && value) return REGULAR;

  if (isHovered) return HOVER;

  return LIGHT;
};

const getItemIcon = (type, value, isHovered) =>
  ITEM_ICONS[type][getItemIconVersion(value, isHovered)];

const TaskItem = ({
  isOpen,
  switchOpen,
  toggleCompleteTask,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  task,
  dragHandleProps,
  isDragging,
  isCompletedGroup,
  members,
  currentUser,
  reassignTask,
  subtasks,
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
    workflowStatus,
    completedDt,
    completedBy,
  } = task;

  const [isHovered, setIsHoverd] = useState(false);

  const isCompleted = task.status === 'COMPLETE';

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <TaskItemPanel
      isDragging={isDragging}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <TaskItemContainer>
        {!isCompletedGroup && (
          <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        )}
        <PrioritySwitch onClick={() => toggleTaskPriority(task)}>
          {task.priority === 'HIGH' ? (
            <img src={HighPriorityLabel} alt="Priority icon" />
          ) : (
            <PriorityHoverIcon
              className="low"
              src={LowPriorityHoverLabel}
              alt="No priority"
            />
          )}
        </PrioritySwitch>
        <TaskItemCell bolded paddingLeft="huge">
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
            {!isEmpty(subtasks) && subtasks?.length > 0 && (
              <SubtasksGroupLabel onClick={() => switchOpen(!isOpen)}>
                <span>{subtasks?.length} subtasks</span>
                <Arrow alt="arrow" isOpen={isOpen} src={ArrowIcon} />
              </SubtasksGroupLabel>
            )}
          </DescriptionBox>
        </TaskItemCell>
        <TaskItemCell width="164px">
          {task.status !== 'COMPLETE' && !patient && (
            <AddPlaceholder>+ Add Patient</AddPlaceholder>
          )}
          {patient && `${patient.firstName} ${patient.lastName}`}
        </TaskItemCell>
        <TaskItemCell width="110px" paddingLeft="smallPlus" paddingRight="tiny">
          {task.status === 'COMPLETE' && <InfoText>Completed</InfoText>}
          {task.status !== 'COMPLETE' && workflowStatus && (
            <TaskItemStatus workflowStatus={workflowStatus} />
          )}
          {task.status !== 'COMPLETE' && !workflowStatus && (
            <AddPlaceholder>+ Add Status</AddPlaceholder>
          )}
        </TaskItemCell>
        <TaskItemCell width="200px">
          <Grid container>
            <GridImg item xs={3}>
              <img
                alt="comments"
                src={getItemIcon(COMMENTS, comments, isHovered)}
              />
            </GridImg>
            <GridImg item xs={3}>
              <PopoverDatepicker
                selectedDate={dueDate}
                onDateChange={date => {
                  console.log('date change', date);
                }}
                quickSelectOptions={dueDateQuickSelectOptions}
              >
                <DueDateContainer>
                  <DueDate>
                    {dueDate && moment(dueDate).format('MM/DD')}
                  </DueDate>
                  <img
                    alt="due-date"
                    src={getItemIcon(DUE_DATE, dueDate, isHovered)}
                  />
                </DueDateContainer>
              </PopoverDatepicker>
            </GridImg>
            <GridImg item xs={3}>
              <img alt="labels" src={getItemIcon(LABELS, labels, isHovered)} />
            </GridImg>
            <GridImg item xs={3}>
              <img
                alt="attachments"
                src={getItemIcon(ATTACHMENTS, attachments, isHovered)}
              />
            </GridImg>
          </Grid>
        </TaskItemCell>
        <TaskItemCell width="80px" justify="center">
          <TaskAssignMember
            members={members}
            currentUser={currentUser}
            reassignTask={reassignTask}
            task={task}
            isCompletedGroup={isCompletedGroup}
          >
            {assignedTo ? (
              <Member member={assignedTo} size={34} />
            ) : (
              <AddCrossIcon src={CrossIcon} size="34px" />
            )}
          </TaskAssignMember>
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
  reassignTask,
  currentUser,
  members,
  ...restProps
}) => {
  const [draggedId, setDraggableId] = useState(false);
  const [orderedSubtasks, reorderSubtasksInState] = useState(subtasks);
  const subtasksOrder = subtasks.map(({ taskIdentifier }) => taskIdentifier);

  useEffect(() => {
    reorderSubtasksInState(subtasks);
  }, [subtasks]);

  return (
    <SubtasksContainer issubtasks="true" in={isOpen}>
      <DragDropContext
        onBeforeCapture={({ draggableId }) => {
          setDraggableId(draggableId);
        }}
        onDragEnd={eventBundle =>
          onDragEndSubtask({
            eventBundle,
            subtasksOrder,
            reorderSubtasksForTask,
            groupId,
            taskListIdentifier,
            parentTaskId,
            orderedSubtasks,
            reorderSubtasksInState,
            setDraggableId,
          })
        }
      >
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {!isEmpty(orderedSubtasks) &&
                orderedSubtasks?.map((subtask, index) => (
                  <Draggable
                    key={subtask.taskId}
                    draggableId={String(subtask.taskId)}
                    index={index}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      { isDragging: isDraggingSubtask },
                    ) => (
                      <div ref={innerRef} {...draggableProps}>
                        <TaskItem
                          dragHandleProps={dragHandleProps}
                          key={subtask.taskId}
                          task={subtask}
                          isDragging={isDraggingSubtask}
                          currentUser={currentUser}
                          members={members}
                          reassignTask={reassignTask}
                          {...restProps}
                        />
                        {draggedId !== String(subtask.taskId) &&
                          !isEmpty(subtask.comments) && (
                            <TaskComments
                              isOpen={isFullView}
                              comments={subtask.comments}
                            />
                          )}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </SubtasksContainer>
  );
};

const Task = ({
  task,
  isFullView,
  isStartedDnD,
  isDragging,
  draggableProvided,
  groupId,
  taskListIdentifier,
  members,
  currentUser,
  reassignTask,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const { comments, subtasks } = task;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;

  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state =>
    pick(['addingNewSubtask', 'addingNewSubtaskParentId', 'subtaskShape'])(
      state.taskState,
    ),
  );

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
      ? [...subtasks, subtaskShape]
      : subtasks;

  return (
    <div ref={innerRef} {...draggableProps}>
      <TaskItem
        task={task}
        isOpen={isOpen}
        switchOpen={switchOpen}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
        members={members}
        currentUser={currentUser}
        reassignTask={reassignTask}
        subtasks={renderedSubtasks}
        {...restProps}
      />
      {!isEmpty(comments) && !isStartedDnD && (
        <TaskComments isOpen={isFullView} comments={comments} />
      )}
      {!isEmpty(subtasks) && !isStartedDnD && (
        <Subtasks
          subtasks={renderedSubtasks}
          isOpen={isOpen}
          isFullView={isFullView}
          groupId={groupId}
          taskListIdentifier={taskListIdentifier}
          parentTaskId={task.taskIdentifier}
          currentUser={currentUser}
          members={members}
          reassignTask={reassignTask}
          {...restProps}
        />
      )}
    </div>
  );
};

export default Task;
