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
import CalendarOverDueIcon from 'img/calendar-overdue-icon';
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
import palette from 'styles/palette';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import TaskComments from 'views/Task/NewTasksView/TaskComments/TaskComments';
import TaskAssignMember from 'views/Task/NewTasksView/TaskAssignMember/TaskAssignMember';
import TaskWorkflowStatus from 'views/Task/NewTasksView/TaskWorkflowStatus/TaskWorkflowStatus';
import { onDragEndSubtask } from 'views/Task/NewTasksView/DragDrop.helpers';
import { Tasks as SubtasksContainer } from 'views/Task/NewTasksView/TasksGroup/styled';
import TaskItemStatus from './TaskItemStatus';
import {
  AddCrossIcon,
  AddPlaceholder,
  CircleIcon,
  ClickablePatient,
  ClickableStandardTaskItemIcon,
  Description,
  DescriptionBox,
  DueDate,
  DueDateContainer,
  GridImg,
  SubtasksGroupLabel,
  SmallText,
  StandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  ThreeDots,
  PrioritySwitch,
  CompletedBy,
  InfoText,
  PriorityHoverIcon,
  ListLink,
  Arrow,
} from '../styled';

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

const getCalendarIcon = (value, isHovered, isOverDue) =>
  isOverDue
    ? CalendarOverDueIcon
    : ITEM_ICONS[DUE_DATE][getItemIconVersion(value, isHovered)];

const getToolTipMultiLabelDetails = labels => {
  let toolTipMultiLabelDetails = '';
  if (labels.length === 1) {
    toolTipMultiLabelDetails = `${labels[0].labelName}`;
  } else if (labels.length === 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${labels[1].labelName}`;
  } else if (labels.length > 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${
      labels[1].labelName
    } + ${labels.length - 2}`;
  }
  return toolTipMultiLabelDetails;
};

const getToolTipAttachmentsLabelDetails = attachments => {
  let attachmentLabelDetails = '';
  if (attachments.length === 1) {
    attachmentLabelDetails = `${attachments[0].fileName}`;
  } else if (attachments.length > 1) {
    attachmentLabelDetails = `${
      attachments[0].fileName
    } + ${attachments.length - 1}`;
  }
  return attachmentLabelDetails;
};

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
  currentUser,
  reassignTask,
  updateDueDate,
  updateWorkflowStatus,
  subtasks,
  dragAndDropDisabled,
  listNameVisible,
  patientVisible = true,
  selectedTask,
  parentHasPatient,
}) => {
  const {
    taskIdentifier,
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
    taskList,
    parentTaskIdentifier,
  } = task;

  const listName = taskList?.listName;
  const taskListIdentifier = taskList?.taskListIdentifier;

  const [isHovered, setIsHoverd] = useState(false);

  const isCompleted = task.status === 'COMPLETE';

  const isSubtask = !!parentTaskIdentifier;
  const isTaskStatusTogglingEnabled = !(isCompletedGroup && isSubtask);

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  return (
    <StandardTaskItemPanel
      isDragging={isDragging}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <StandardTaskItemContainer
        isSelected={selectedTask?.taskIdentifier === taskIdentifier}
      >
        {!dragAndDropDisabled && (
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
        <StandardTaskItemCell
          bolded
          paddingLeft="huge"
          onClick={() => {
            openDrawer();
            storeAsCurrentTask(task);
          }}
        >
          <CircleIcon
            src={isCompleted ? CircleCompleted : Circle}
            isClickable={isTaskStatusTogglingEnabled}
            onClick={event => {
              if (isTaskStatusTogglingEnabled) {
                toggleCompleteTask(task);
              }
              event.stopPropagation();
            }}
          />
          <DescriptionBox>
            <Description isCrossedOut={!isCompletedGroup && isCompleted}>
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
              <SubtasksGroupLabel
                onClick={event => {
                  event.stopPropagation();
                  switchOpen(!isOpen);
                }}
              >
                <span>{subtasks?.length} subtasks</span>
                <Arrow alt="arrow" isOpen={isOpen} src={ArrowIcon} />
              </SubtasksGroupLabel>
            )}
          </DescriptionBox>
        </StandardTaskItemCell>
        {patientVisible && (
          <StandardTaskItemCell width="164px">
            <ClickablePatient
              onClick={() => {
                openDrawer('patient');
                storeAsCurrentTask(task);
              }}
            >
              {task.status !== 'COMPLETE' && !isSubtask && !patient && (
                <AddPlaceholder>+ Add Patient</AddPlaceholder>
              )}
              {patient &&
                !parentHasPatient &&
                `${patient.firstName} ${patient.lastName}`}
            </ClickablePatient>
          </StandardTaskItemCell>
        )}
        <StandardTaskItemCell
          width="110px"
          paddingLeft="smallPlus"
          paddingRight="tiny"
        >
          <TaskWorkflowStatus
            task={task}
            isCompletedGroup={isCompletedGroup}
            updateWorkflowStatus={updateWorkflowStatus}
          >
            {task.status === 'COMPLETE' && <InfoText>Completed</InfoText>}
            {task.status !== 'COMPLETE' && workflowStatus && (
              <TaskItemStatus
                workflowStatus={workflowStatus}
                labelWidth="100px"
              />
            )}
            {task.status !== 'COMPLETE' && !workflowStatus && (
              <AddPlaceholder>+ Add Status</AddPlaceholder>
            )}
          </TaskWorkflowStatus>
        </StandardTaskItemCell>
        <StandardTaskItemCell width="200px">
          <Grid container>
            <GridImg item xs={3}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(comments) === REGULAR
                    ? `${comments?.length} comments`
                    : 'Add a new comment'
                }
              >
                <ClickableStandardTaskItemIcon
                  onClick={() => {
                    openDrawer('comment');
                    storeAsCurrentTask(task);
                  }}
                >
                  <img
                    alt="comments"
                    src={getItemIcon(COMMENTS, comments, isHovered)}
                  />
                </ClickableStandardTaskItemIcon>
              </UniversalTooltipContainer>
            </GridImg>
            <GridImg item xs={3}>
              <PopoverDatepicker
                selectedDate={dueDate}
                onDateChange={date => {
                  const existingTime = dueDate
                    ? moment(dueDate).format('HH:mm')
                    : '';
                  updateDueDate(task, moment(`${date} ${existingTime}`), true);
                }}
                quickSelectOptions={dueDateQuickSelectOptions}
              >
                {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
                  <button
                    type="button"
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    ref={elementReference}
                  >
                    <UniversalTooltipContainer
                      placement="top"
                      label={
                        getItemIconVersion(dueDate) === REGULAR
                          ? 'Edit due date'
                          : 'Add due date'
                      }
                    >
                      <DueDateContainer>
                        <DueDate>
                          {dueDate && moment(dueDate).format('MM/DD')}
                        </DueDate>
                        <img
                          alt="due-date"
                          src={getCalendarIcon(
                            dueDate,
                            isHovered,
                            !!(
                              dueDate &&
                              moment(dueDate).isBefore(moment().startOf('day'))
                            ),
                          )}
                        />
                      </DueDateContainer>
                    </UniversalTooltipContainer>
                  </button>
                )}
              </PopoverDatepicker>
            </GridImg>
            <GridImg item xs={3}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(labels) === REGULAR
                    ? getToolTipMultiLabelDetails(labels)
                    : 'Add label'
                }
              >
                <ClickableStandardTaskItemIcon
                  onClick={() => {
                    openDrawer('label');
                    storeAsCurrentTask(task);
                  }}
                >
                  {' '}
                  <img
                    alt="labels"
                    src={getItemIcon(LABELS, labels, isHovered)}
                  />
                </ClickableStandardTaskItemIcon>
              </UniversalTooltipContainer>
            </GridImg>
            <GridImg item xs={3}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(attachments) === REGULAR
                    ? getToolTipAttachmentsLabelDetails(attachments)
                    : 'Add file'
                }
              >
                <ClickableStandardTaskItemIcon
                  onClick={() => {
                    openDrawer('attachment');
                    storeAsCurrentTask(task);
                  }}
                >
                  {' '}
                  <img
                    alt="attachments"
                    src={getItemIcon(ATTACHMENTS, attachments, isHovered)}
                  />
                </ClickableStandardTaskItemIcon>
              </UniversalTooltipContainer>
            </GridImg>
          </Grid>
        </StandardTaskItemCell>
        <StandardTaskItemCell width="80px" justify="center">
          <TaskAssignMember
            currentUser={currentUser}
            reassignTask={reassignTask}
            task={task}
          >
            {assignedTo ? (
              <Member member={assignedTo} size={34} />
            ) : (
              <AddCrossIcon src={CrossIcon} size="34px" />
            )}
          </TaskAssignMember>
        </StandardTaskItemCell>
        {listNameVisible && (
          <StandardTaskItemCell
            color={listName ? palette.brightBlue : palette.coolGrey2}
            width="168px"
          >
            {listName && taskListIdentifier ? (
              <ListLink
                to={`/tasks/${taskListIdentifier}${
                  task.status === 'COMPLETE' ? '/complete' : ''
                }`}
              >
                {listName}
              </ListLink>
            ) : (
              'Unfiled'
            )}
          </StandardTaskItemCell>
        )}
      </StandardTaskItemContainer>
    </StandardTaskItemPanel>
  );
};

const Subtasks = ({
  subtasks,
  isOpen,
  isFullView,
  groupId,
  parentTaskId,
  reorderSubtasksForTask,
  reassignTask,
  currentUser,
  parentHasPatient,
  taskList,
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
                    key={subtask.taskIdentifier}
                    draggableId={String(subtask.taskIdentifier)}
                    index={index}
                  >
                    {(
                      { innerRef, draggableProps, dragHandleProps },
                      { isDragging: isDraggingSubtask },
                    ) => (
                      <div ref={innerRef} {...draggableProps}>
                        <TaskItem
                          dragHandleProps={dragHandleProps}
                          key={subtask.taskIdentifier}
                          task={{ ...subtask, taskList }}
                          isDragging={isDraggingSubtask}
                          currentUser={currentUser}
                          reassignTask={reassignTask}
                          parentHasPatient={parentHasPatient}
                          {...restProps}
                        />
                        {draggedId !== String(subtask.taskIdentifier) &&
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
  currentUser,
  reassignTask,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const { comments, subtasks, patient } = task;
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

  useEffect(() => {
    switchOpen(isFullView);
  }, [isFullView, switchOpen]);

  const renderedSubtasks =
    addingNewSubtask && addingNewSubtaskParentId === task?.taskIdentifier
      ? [...subtasks, subtaskShape]
      : subtasks;

  return (
    <div {...draggableProps}>
      <div ref={innerRef}>
        <TaskItem
          task={task}
          isOpen={isOpen}
          switchOpen={switchOpen}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          currentUser={currentUser}
          reassignTask={reassignTask}
          subtasks={renderedSubtasks}
          {...restProps}
        />
      </div>

      {!isEmpty(comments) && !isStartedDnD && (
        <TaskComments isOpen={isFullView} comments={comments} />
      )}
      {!isEmpty(subtasks) && !isStartedDnD && (
        <Subtasks
          subtasks={renderedSubtasks}
          isOpen={isOpen}
          isFullView={isFullView}
          groupId={groupId}
          parentTaskId={task.taskIdentifier}
          currentUser={currentUser}
          reassignTask={reassignTask}
          parentHasPatient={!!patient}
          taskList={task?.taskList}
          {...restProps}
        />
      )}
    </div>
  );
};

export default Task;
