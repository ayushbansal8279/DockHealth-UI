/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { EditorState } from 'draft-js';
import moment from 'moment';
import { isEmpty } from 'ramda';
import Highlighter from 'react-highlight-words';
import { openDrawer } from 'actions/task-drawer-actions';
import {
  prepareSubtask,
  storeAsCurrentTask,
  loadSubTasks,
} from 'actions/task-actions';
import { Grid } from '@material-ui/core';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import ArrowIcon from 'img/arrow';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import ThreeDotsIcon from 'img/three-dots';
import Member from 'components/members/Member/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import LowPriorityHoverLabel from 'img/priority-label-hover-icon.svg';
import palette from 'styles/palette';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import TaskAssignMember from 'components/tasklist/TaskAssignMember/TaskAssignMember';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import { FocusDrawerFieldEnum } from 'components/taskView/newTaskDrawer/NewTaskDrawer.Utilities';
import Spacing from 'components/common/Spacing';
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
  SubtaskStylingLastLink,
  SubtaskStylingLinkContainer,
  SubtaskStylingVerticalPart,
  SubtaskStylingHorizontalPart,
  TaskItemParentTaskLabel,
} from '../styled';

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

const getSubtaskStylingLink = isLast => {
  if (isLast) return <SubtaskStylingLastLink />;

  return (
    <SubtaskStylingLinkContainer>
      <SubtaskStylingVerticalPart />
      <SubtaskStylingHorizontalPart />
    </SubtaskStylingLinkContainer>
  );
};

const TaskItem = ({
  isOpen,
  switchOpen,
  toggleCompleteTask,
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
  subTasksCount,
  dragAndDropDisabled,
  listNameVisible,
  patientVisible = true,
  selectedTask,
  parentHasPatient,
  highlightedValue,
  isDraggable,
  isLast,
  showSubtaskStylingLink,
  isNestedTask = false,
  hideSubtasks,
}) => {
  const {
    taskIdentifier,
    edited,
    assignedTo,
    attachments,
    comments,
    description,
    tokenizedDescription,
    taskMentions,
    dueDate,
    labels,
    patient,
    workflowStatus,
    completedDt,
    completedBy,
    taskList = {},
    parentTaskIdentifier,
    searchMetaData = {},
    parentTask,
  } = task;
  const { listName, taskListIdentifier } = taskList;

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

  const [isHovered, setIsHoverd] = useState(false);
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
    }),
  );
  const dispatch = useDispatch();
  const previousDescription = useRef(null);

  useEffect(() => {
    if (previousDescription.current !== null) {
      const newContent = createMentionEntities(
        tokenizedDescription,
        description,
        taskMentions,
      );
      setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescription.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const isCompleted = task.status === 'COMPLETE';
  const isSubtask = !!parentTaskIdentifier;
  const isTaskStatusTogglingEnabled = !(isCompletedGroup && isSubtask);

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

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

  const onMouseEnter = () => setIsHoverd(true);
  const onMouseLeave = () => setIsHoverd(false);

  const onPrioritySwtich = useCallback(
    () => toggleTaskPriority(task),

    [task, toggleTaskPriority],
  );

  const onClickTaskItem = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onCircleClick = useCallback(
    event => {
      if (isTaskStatusTogglingEnabled) {
        toggleCompleteTask(task);
      }
      event.stopPropagation();
    },
    [isTaskStatusTogglingEnabled, task, toggleCompleteTask],
  );

  const onParentLabelClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(parentTask));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentTask],
  );

  const onAddSubtaskLabelClick = useCallback(
    event => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      prepareSubtask(taskIdentifier, null, task)(dispatch);
    },
    [taskIdentifier, dispatch, task],
  );

  const onSubtaskLabelClick = useCallback(
    event => {
      event.stopPropagation();
      if (subTasksCount > 0 && isEmpty(subtasks)) {
        dispatch(loadSubTasks(task));
        if (!isOpen) {
          switchOpen(true);
        }
      } else {
        switchOpen(!isOpen);
      }
    },
    [subTasksCount, subtasks, dispatch, task, isOpen, switchOpen],
  );

  const onPatientClick = useCallback(() => {
    if (!patient) {
      dispatch(openDrawer(FocusDrawerFieldEnum.PATIENT));
      dispatch(storeAsCurrentTask(task));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);

  const onCommentClick = useCallback(() => {
    dispatch(openDrawer(FocusDrawerFieldEnum.COMMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(openDrawer(FocusDrawerFieldEnum.ATTACHMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const showDraggableDots = !dragAndDropDisabled && isDraggable;
  const showPriority = task.priority === 'HIGH';

  return (
    <StandardTaskItemPanel
      isDragging={isDragging}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StandardTaskItemContainer isSelected={isSelectedTask}>
        {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
        {showDraggableDots && (
          <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        )}
        <PrioritySwitch onClick={onPrioritySwtich}>
          {showPriority ? (
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
          onClick={onClickTaskItem}
        >
          <CircleIcon
            src={isCompleted ? CircleCompleted : Circle}
            isClickable={isTaskStatusTogglingEnabled}
            onClick={onCircleClick}
          />
          <DescriptionBox>
            <Description isCrossedOut={!isCompletedGroup && isCompleted}>
              <MentionsEditor
                readOnly
                withEditedLabel={edited}
                state={descriptionState}
                onChange={setDescriptionState}
                highlightedValues={
                  matchDescription &&
                  highlightedValue?.toLowerCase().split(/\s+/)
                }
              />
            </Description>
            {isSubtask && !isNestedTask && parentTask && (
              <>
                <TaskItemParentTaskLabel>
                  Subtask of
                  <span
                    onClick={onParentLabelClick}
                  >{` ${parentTask.description}`}</span>
                </TaskItemParentTaskLabel>
                {isCompleted && <Spacing vertical={2} />}
              </>
            )}
            <CompletedBy isCompleted={isCompleted}>
              <span>{`Completed by ${completedByName} ${completedDt &&
                ` on ${
                  completedDt
                    ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                    : ''
                }`}
                `}</span>
            </CompletedBy>
            {!hideSubtasks && (
              <SubtasksBox>
                {(subTasksCount > 0 ||
                  (!isEmpty(subtasks) && subtasks?.length > 0)) &&
                  !isSubtask && (
                    <SubtasksGroupLabel onClick={onSubtaskLabelClick}>
                      <span>{subtasks?.length || subTasksCount} subtasks</span>
                      <Arrow alt="arrow" isOpen={isOpen} src={ArrowIcon} />
                    </SubtasksGroupLabel>
                  )}
                {!isSubtask && isSelectedTask && (
                  <SubtasksAddLabel onClick={onAddSubtaskLabelClick}>
                    Add a subtask
                  </SubtasksAddLabel>
                )}
              </SubtasksBox>
            )}
          </DescriptionBox>
        </StandardTaskItemCell>
        {patientVisible && (
          <StandardTaskItemCell width="164px">
            <ClickablePatient onClick={onPatientClick}>
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
                <ClickableStandardTaskItemIcon onClick={onCommentClick}>
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
                            isCompleted,
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
                <ClickableStandardTaskItemIcon onClick={onCommentClick}>
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
                <ClickableStandardTaskItemIcon onClick={onAttachmentsClick}>
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

export default React.memo(TaskItem);
