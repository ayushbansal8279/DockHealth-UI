import React, { useState } from 'react';
import moment from 'moment';
import { isEmpty } from 'ramda';
import { Grid } from '@material-ui/core';
import ArrowIcon from 'img/arrow';
import Circle from 'img/circle';
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
  TaskItemCell,
  TaskItemContainer,
  TaskItemPanel,
  ThreeDots,
  PrioritySwitch,
} from './styled';

import { Tasks as Subtasks, Arrow } from '../TasksGroup/styled';

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
  currentUser,
  isOpen,
  switchOpen,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  task,
}) => {
  const {
    assignedTo,
    attachments,
    comments,
    description,
    dueDate,
    labels,
    patient,
    status,
    subtasks,
    workflowStatus,
  } = task;

  return (
    <TaskItemContainer>
      <PrioritySwitch onClick={() => toggleTaskPriority(task)}>
        {task.priority === 'HIGH' ? (
          <img src={HighPriorityLabel} alt="Priority icon" />
        ) : (
          <img className="low" src={LowPriorityHoverLabel} alt="No priority" />
        )}
      </PrioritySwitch>
      <TaskItemCell bolded>
        <CircleIcon
          src={Circle}
          onClick={() => markComplete(task, status, status, currentUser)}
        />
        <DescriptionBox>
          <Description
            onClick={() => {
              openDrawer();
              storeAsCurrentTask(task);
            }}
          >
            {description}
          </Description>
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
        {workflowStatus && <TaskItemStatus workflowStatus={workflowStatus} />}
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
  );
};

const Task = ({
  task,
  isFullView,
  isDragging,
  dragandDropProps,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const { comments, subtasks } = task;
  const { ref, draggableProps, dragHandleProps } = dragandDropProps;

  return (
    <div {...draggableProps}>
      <TaskItemPanel ref={ref} isDragging={isDragging}>
        <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        <TaskItem
          task={task}
          isOpen={isOpen}
          switchOpen={switchOpen}
          {...restProps}
        />
      </TaskItemPanel>
      {!isEmpty(comments) && !isDragging && (
        <TaskComments isOpen={isFullView} comments={comments} />
      )}
      {!isDragging && (
        <Subtasks issubtasks="true" in={isOpen}>
          {!isEmpty(subtasks) &&
            subtasks?.map(subtask => (
              <>
                <TaskItem key={subtask.taskId} task={subtask} {...restProps} />
                <TaskComments
                  isOpen={isFullView && !isDragging}
                  comments={subtask.comments}
                />
              </>
            ))}
        </Subtasks>
      )}
    </div>
  );
};

export default Task;
