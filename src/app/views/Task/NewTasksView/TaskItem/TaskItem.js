import React from 'react';
import moment from 'moment';
import { isEmpty } from 'ramda';
import { Grid } from '@material-ui/core';
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
import Member from 'components/members/Member';
import TaskItemStatus from './TaskItemStatus';
import {
  AddCrossIcon,
  CircleIcon,
  Description,
  DueDate,
  DueDateContainer,
  GridImg,
  TaskItemCell,
  TaskItemContainer,
} from './styled';

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
  markComplete,
  openDrawer,
  storeAsCurrentTask,
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
    workflowStatus,
  } = task;

  return (
    <TaskItemContainer>
      <TaskItemCell bolded>
        <CircleIcon
          src={Circle}
          onClick={() => markComplete(task, status, status, currentUser)}
        />
        <Description
          onClick={() => {
            openDrawer();
            storeAsCurrentTask(task);
          }}
        >
          {description}
        </Description>
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
      <TaskItemCell width="80px">
        {assignedTo ? (
          <Member member={assignedTo} size={40} />
        ) : (
          <AddCrossIcon src={CrossIcon} />
        )}
      </TaskItemCell>
    </TaskItemContainer>
  );
};

export default TaskItem;
