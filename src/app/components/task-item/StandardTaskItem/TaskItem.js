/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { EditorState } from 'draft-js';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { openDrawer } from 'actions/task-drawer-actions';
import {
  // prepareSubtask,
  storeAsCurrentTask,
} from 'actions/task-actions';
import { Grid } from '@material-ui/core';
import debounce from 'lodash.debounce';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import ThreeDotsIcon from 'img/three-dots';
import Member from 'components/members/Member/Member';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
import LowPriorityHoverLabel from 'img/priority-label-hover-icon.svg';
import SubtasksIcon from 'img/subtasks-grey.svg';
import SubtasksIconActive from 'img/subtasks-blue.svg';
import EmptyCalendarIcon from 'img/calendar-dim.svg';
import EmptyCalendarIconHover from 'img/calendar-icon-hover.svg';
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
import PatientCard from 'components/patients/PatientCard/PatientCard';
import TaskItemStatus from './TaskItemStatus';
import { getSubtaskStylingLink } from './helpers';
import {
  getItemIconVersion,
  getItemIcon,
  REGULAR,
  COMMENTS,
  LABELS,
  ATTACHMENTS,
  getToolTipMultiLabelDetails,
  getToolTipAttachmentsLabelDetails,
  isDueDateOverdue,
} from '../icons';
import {
  AddCrossIcon,
  AddPlaceholder,
  CircleIcon,
  ClickablePatient,
  ClickableStandardTaskItemIcon,
  Description,
  DescriptionBox,
  DueDateBasicLabel,
  GridImg,
  StandardTaskItemCell,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
  StandardTaskItemPanel,
  ThreeDots,
  PrioritySwitch,
  CompletedBy,
  InfoText,
  PriorityHoverIcon,
  ListLink,
  ListItemLink,
  AssigneeMatchingWrapper,
  DueDateButton,
  TaskItemParentTaskLabel,
  CommentIcon,
  CalendarIcon,
  LabelIcon,
  AttachmentIcon,
  DescriptionTooltip,
  SubtasksCellContent,
  SubtasksCellText,
  SubtasksImg,
  DescriptionLabel,
  DescriptionWrapper,
} from '../styled';

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
    duplicated,
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
  const [
    isDescriptionTooltipVisible,
    setIsDescriptionTooltipVisible,
  ] = useState(false);
  const dispatch = useDispatch();
  const previousDescription = useRef(null);
  const descriptionReference = useRef(null);

  const checkIfShouldDisplayTooltip = useCallback(() => {
    const descriptionTextElement = descriptionReference.current?.querySelector(
      '.public-DraftStyleDefault-block',
    );
    if (
      descriptionTextElement &&
      descriptionTextElement.scrollWidth > descriptionTextElement.offsetWidth
    ) {
      setIsDescriptionTooltipVisible(true);
    } else {
      setIsDescriptionTooltipVisible(false);
    }
  }, []);

  const handleResize = useCallback(
    debounce(() => {
      checkIfShouldDisplayTooltip();
    }, 1000),
    [],
  );

  useEffect(() => {
    if (descriptionReference.current) {
      checkIfShouldDisplayTooltip();
    }
  }, [checkIfShouldDisplayTooltip]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (
        isTaskStatusTogglingEnabled &&
        (isSubtask ||
          (isCompletedGroup && isCompleted) ||
          (!isCompletedGroup && !isCompleted))
      ) {
        toggleCompleteTask(task);
      }
      event.stopPropagation();
    },
    [
      isTaskStatusTogglingEnabled,
      task,
      toggleCompleteTask,
      isSubtask,
      isCompletedGroup,
      isCompleted,
    ],
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

  // const onAddSubtaskLabelClick = useCallback(
  //   event => {
  //     if (event) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //     prepareSubtask(taskIdentifier, null, task)(dispatch);
  //   },
  //   [taskIdentifier, dispatch, task],
  // );

  const onSubtaskLabelClick = useCallback(
    event => {
      event.stopPropagation();
      if (!isOpen) {
        switchOpen(true);
      } else {
        switchOpen(!isOpen);
      }
    },
    [isOpen, switchOpen],
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

  const onLabelClick = useCallback(() => {
    dispatch(openDrawer(FocusDrawerFieldEnum.LABEL));
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

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  const hasParentTaskLabel = isSubtask && !isNestedTask && parentTask;

  return (
    <StandardTaskItemPanel
      isDragging={isDragging}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StandardTaskItemContainer
        isSelected={isSelectedTask}
        height={hasParentTaskLabel || isCompletedGroup ? 50 : 35}
        noTopBorder={isSubtask}
      >
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
        <MainStandardTaskItemCell
          bolded
          paddingLeft="huge"
          paddingRight="small"
          onClick={onClickTaskItem}
          position="static"
        >
          <CircleIcon
            src={isCompleted ? CircleCompleted : Circle}
            isClickable={isTaskStatusTogglingEnabled}
            isCompleted={isCompleted}
            onClick={onCircleClick}
          />
          <DescriptionBox>
            <DescriptionWrapper>
              <Description
                ref={descriptionReference}
                isCrossedOut={!isCompletedGroup && isCompleted}
              >
                <MentionsEditor
                  readOnly
                  oneline
                  state={descriptionState}
                  onChange={setDescriptionState}
                  highlightedValues={
                    matchDescription &&
                    highlightedValue?.toLowerCase().split(/\s+/)
                  }
                />
                {isDescriptionTooltipVisible && (
                  <DescriptionTooltip>{description}</DescriptionTooltip>
                )}
              </Description>
              {edited && !duplicated && (
                <DescriptionLabel>(edited)</DescriptionLabel>
              )}
              {duplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
            </DescriptionWrapper>
            {hasParentTaskLabel && (
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
            {isCompletedGroup && (
              <CompletedBy isCompleted={isCompleted}>
                <span>{`Completed by ${completedByName} ${completedDt &&
                  ` on ${
                    completedDt
                      ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                      : ''
                  }`}
                `}</span>
              </CompletedBy>
            )}
          </DescriptionBox>
        </MainStandardTaskItemCell>
        {!hideSubtasks && (
          <StandardTaskItemCell
            width="60px"
            paddingLeft="tiny"
            paddingRight="tiny"
          >
            {!isSubtask && subTasksCount > 0 && (
              <SubtasksCellContent onClick={onSubtaskLabelClick}>
                <SubtasksCellText isOpen={isOpen}>
                  {subTasksCount}
                </SubtasksCellText>
                <SubtasksImg
                  src={isOpen ? SubtasksIconActive : SubtasksIcon}
                  alt="Subtasks"
                />
              </SubtasksCellContent>
            )}
          </StandardTaskItemCell>
        )}
        {patientVisible && (
          <StandardTaskItemCell width="164px">
            <ClickablePatient onClick={onPatientClick}>
              {task.status !== 'COMPLETE' && !isSubtask && !patient && (
                <AddPlaceholder>+ Add Patient</AddPlaceholder>
              )}
              {patient && !parentHasPatient && (
                <PatientCard patientIdentifier={patient.patientIdentifier}>
                  <ListItemLink
                    to={`/core/patient/${patient.patientIdentifier}`}
                  >
                    {(matchPatient || matchPatientMRN) && highlightedValue ? (
                      <Highlighter
                        highlightClassName="list-highlight"
                        searchWords={
                          matchPatient
                            ? highlightedValue?.toLowerCase().split(/\s+/)
                            : `${patientName}`.toLowerCase().split(/\s+/)
                        }
                        autoEscape
                        textToHighlight={`${patient.patientName}`}
                      />
                    ) : (
                      `${patientName}`
                    )}
                  </ListItemLink>
                </PatientCard>
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
        <StandardTaskItemCell width="150px">
          <Grid container>
            <GridImg item xs={4} matched={matchComments}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(comments) === REGULAR
                    ? `${comments?.length} comment${
                        comments.length > 1 ? 's' : ''
                      }`
                    : 'Add a new comment'
                }
              >
                <ClickableStandardTaskItemIcon onClick={onCommentClick}>
                  <CommentIcon
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
            <GridImg item xs={4} matched={matchLabels}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(labels) === REGULAR
                    ? getToolTipMultiLabelDetails(labels)
                    : 'Add label'
                }
              >
                <ClickableStandardTaskItemIcon onClick={onLabelClick}>
                  <LabelIcon
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
            <GridImg item xs={4} matched={matchAttachments}>
              <UniversalTooltipContainer
                placement="top"
                label={
                  getItemIconVersion(attachments) === REGULAR
                    ? getToolTipAttachmentsLabelDetails(attachments)
                    : 'Add file'
                }
              >
                <ClickableStandardTaskItemIcon onClick={onAttachmentsClick}>
                  <AttachmentIcon
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
        <StandardTaskItemCell
          paddingLeft="tiny"
          paddingRight="tiny"
          width="60px"
          justify="center"
        >
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
                  {dueDate ? (
                    <DueDateBasicLabel isOverdue={isDueDateOverdue(dueDate)}>
                      {moment(dueDate).format('MM/DD')}
                    </DueDateBasicLabel>
                  ) : (
                    <CalendarIcon
                      src={
                        isHovered ? EmptyCalendarIconHover : EmptyCalendarIcon
                      }
                      alt="Due date"
                    />
                  )}
                </UniversalTooltipContainer>
              </DueDateButton>
            )}
          </PopoverDatepicker>
        </StandardTaskItemCell>
        <StandardTaskItemCell
          width="60px"
          justify="center"
          paddingLeft="tiny"
          paddingRight="tiny"
        >
          <TaskAssignMember
            currentUser={currentUser}
            reassignTask={reassignTask}
            task={task}
          >
            {assignedTo ? (
              <UniversalTooltipContainer
                placement="top-end"
                label={`Assigned to ${assignedTo.userName}`}
              >
                <AssigneeMatchingWrapper matched={matchAssignedTo} />
                <Member member={assignedTo} size={30} showTooltip={false} />
              </UniversalTooltipContainer>
            ) : (
              <UniversalTooltipContainer placement="top" label="Assign to">
                <AddCrossIcon src={CrossIcon} size="28px" />
              </UniversalTooltipContainer>
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
                to={`/core/tasks/${taskListIdentifier}${
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
