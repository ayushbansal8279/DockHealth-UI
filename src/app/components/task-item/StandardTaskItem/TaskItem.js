/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { isEmpty, pick } from 'ramda';
import Highlighter from 'react-highlight-words';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { prepareSubtask } from 'actions/task-actions';
import { Grid } from '@material-ui/core';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import ArrowIcon from 'img/arrow';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
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
import { FocusDrawerFieldEnum } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';
import ReactHtmlParser from 'react-html-parser';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import TaskItemStatus from './TaskItemStatus';

import {
  getItemIconVersion,
  getItemIcon,
  getCalendarIcon,
  REGULAR,
  COMMENTS,
  LABELS,
  ATTACHMENTS,
} from '../icons';

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
  ListItemLink,
  Arrow,
  AssigneeMatchingWrapper,
  DueDateButton,
  SubtasksBox,
  SubtasksAddLabel,
} from '../styled';

const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;

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
  highlightedValue,
  isDraggable,
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
    searchMetaData = {},
  } = task;

  const {
    matchAssignedTo,
    matchAttachments,
    matchComments,
    matchDescription,
    matchLabels,
    matchPatient,
    matchPatientMRN,
    matchWorkflowStatus,
  } = searchMetaData;

  const dispatch = useDispatch();

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

  const isOverdueTask =
    moment(dueDate).format('HH:mm') !== '00:00'
      ? moment(dueDate).isBefore(moment())
      : dueDate && moment(dueDate).isBefore(moment().startOf('day'));

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

  const isSelectedTask =
    selectedTask?.taskIdentifier === taskIdentifier ||
    (selectedTask?.taskIdentifier == null &&
      selectedTask?.parentTaskIdentifier === taskIdentifier);

  return (
    <StandardTaskItemPanel
      isDragging={isDragging}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      <StandardTaskItemContainer isSelected={isSelectedTask}>
        {!dragAndDropDisabled && isDraggable && (
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
              {matchDescription && highlightedValue ? (
                <Highlighter
                  highlightClassName="list-highlight"
                  searchWords={highlightedValue?.toLowerCase().split(/\s+/)}
                  autoEscape
                  textToHighlight={description}
                />
              ) : (
                ReactHtmlParser(
                  mentionifyAndLinkifyTaskText({
                    members: null,
                    value: description,
                  }),
                )
              )}
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
            <SubtasksBox>
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
              {!isSubtask && isSelectedTask && (
                <SubtasksAddLabel
                  onClick={async event => {
                    if (event) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                    // openDrawer();
                    prepareSubtask(taskIdentifier)(dispatch);
                  }}
                >
                  Add Subtask
                </SubtasksAddLabel>
              )}
            </SubtasksBox>
          </DescriptionBox>
        </StandardTaskItemCell>
        {patientVisible && (
          <StandardTaskItemCell width="164px">
            <ClickablePatient
              onClick={() => {
                if (!patient) {
                  openDrawer(FocusDrawerFieldEnum.PATIENT);
                  storeAsCurrentTask(task);
                }
              }}
            >
              {task.status !== 'COMPLETE' && !isSubtask && !patient && (
                <AddPlaceholder>+ Add Patient</AddPlaceholder>
              )}
              {patient && !parentHasPatient && (
                <ListItemLink to={`patient/${patient.patientIdentifier}`}>
                  {(matchPatient || matchPatientMRN) && highlightedValue ? (
                    <Highlighter
                      highlightClassName="list-highlight"
                      searchWords={
                        matchPatient
                          ? highlightedValue?.toLowerCase().split(/\s+/)
                          : `${patient.firstName} ${patient.lastName}`
                              .toLowerCase()
                              .split(/\s+/)
                      }
                      autoEscape
                      textToHighlight={`${patient.firstName} ${patient.lastName}`}
                    />
                  ) : (
                    `${patient.firstName} ${patient.lastName}`
                  )}
                </ListItemLink>
              )}
            </ClickablePatient>
          </StandardTaskItemCell>
        )}
        <StandardTaskItemCell
          width="120px"
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
                isMatching={matchWorkflowStatus}
                highlightedValue={highlightedValue}
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
            <GridImg item xs={3} matched={matchComments}>
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
                    openDrawer(FocusDrawerFieldEnum.COMMENT);
                    storeAsCurrentTask(task);
                  }}
                >
                  <img
                    alt="comments"
                    src={getItemIcon(
                      COMMENTS,
                      comments,
                      isHovered,
                      task.updatedComment,
                    )}
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
                  <DueDateButton
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
                            isOverdueTask,
                            task.updatedDueDate,
                          )}
                        />
                      </DueDateContainer>
                    </UniversalTooltipContainer>
                  </DueDateButton>
                )}
              </PopoverDatepicker>
            </GridImg>
            <GridImg item xs={3} matched={matchLabels}>
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
                    openDrawer(FocusDrawerFieldEnum.LABEL);
                    storeAsCurrentTask(task);
                  }}
                >
                  {' '}
                  <img
                    alt="labels"
                    src={getItemIcon(
                      LABELS,
                      labels,
                      isHovered,
                      task.updatedLabel,
                    )}
                  />
                </ClickableStandardTaskItemIcon>
              </UniversalTooltipContainer>
            </GridImg>
            <GridImg item xs={3} matched={matchAttachments}>
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
                    openDrawer(FocusDrawerFieldEnum.ATTACHMENT);
                    storeAsCurrentTask(task);
                  }}
                >
                  {' '}
                  <img
                    alt="attachments"
                    src={getItemIcon(
                      ATTACHMENTS,
                      attachments,
                      isHovered,
                      task.updatedAttachment,
                    )}
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
              <>
                <AssigneeMatchingWrapper matched={matchAssignedTo} />
                <Member member={assignedTo} size={34} />
              </>
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
  isDraggable,
  ...restProps
}) => {
  const [draggedId, setDraggableId] = useState(false);
  const [orderedSubtasks, reorderSubtasksInState] = useState(subtasks);
  const subtasksOrder = subtasks.map(({ taskIdentifier }) => taskIdentifier);
  const { openDrawer, storeAsCurrentTask, highlightedValue } = restProps;

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
                orderedSubtasks?.map((subtask, index) => {
                  const matchedComments = getMatchedComments(
                    subtask.comments,
                    subtask.searchMetaData?.matchingCommentIdentifiers,
                  );

                  return (
                    <Draggable
                      key={subtask.taskIdentifier}
                      draggableId={String(subtask.taskIdentifier)}
                      index={index}
                      isDragDisabled={!isDraggable}
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
                            isDraggable={isDraggable}
                            {...restProps}
                          />
                          {draggedId !== String(subtask.taskIdentifier) &&
                            !isEmpty(matchedComments) && (
                              <TaskComments
                                isOpen={isFullView}
                                comments={matchedComments}
                                highlightedValue={highlightedValue}
                                onClickComment={() => {
                                  openDrawer();
                                  storeAsCurrentTask(subtask);
                                }}
                              />
                            )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
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
  isDraggable,
  ...restProps
}) => {
  const [isOpen, switchOpen] = useState(false);
  const { comments, subtasks, patient, searchMetaData } = task;
  const { innerRef, draggableProps, dragHandleProps } = draggableProvided;
  const { openDrawer, storeAsCurrentTask, highlightedValue } = restProps;

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

  const matchingComments = getMatchedComments(
    comments,
    searchMetaData?.matchingCommentIdentifiers,
  );

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
          isDraggable={isDraggable}
          {...restProps}
        />
      </div>

      {!isEmpty(matchingComments) && !isStartedDnD && (
        <TaskComments
          isOpen={isFullView}
          comments={matchingComments}
          highlightedValue={highlightedValue}
          onClickComment={() => {
            openDrawer();
            storeAsCurrentTask(task);
          }}
        />
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
          isDraggable={isDraggable}
          {...restProps}
        />
      )}
    </div>
  );
};

export default Task;
