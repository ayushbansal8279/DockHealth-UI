/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import { EditorState } from 'draft-js';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { openDrawer } from 'actions/task-drawer-actions';
import { openQuickAddSubtask, storeAsCurrentTask } from 'actions/task-actions';
import { Grid } from '@material-ui/core';
import debounce from 'lodash.debounce';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/cross';
import ThreeDotsIcon from 'img/three-dots';
import Member from 'components/members/Member/Member';
import SingleSubtaskIcon from 'img/SingleSubtaskIcon';
import SubtasksIcon from 'img/subtasks-grey.svg';
import SubtasksIconActive from 'img/subtasks-blue.svg';
import SubtasksIconDisabled from 'img/subtasks-disabled.svg';
import EmptyCalendarIcon from 'img/calendar-dim.svg';
import EmptyCalendarIconHover from 'img/calendar-icon-hover.svg';
import palette from 'styles/palette';
import TaskAssignMember from 'components/tasklist/TaskAssignMember/TaskAssignMember';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import { FocusDrawerFieldEnum } from 'components/task-view/newTaskDrawer/NewTaskDrawer.Utilities';
import Spacing from 'components/common/Spacing';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import Tooltip from 'components/common/Tooltip/Tooltip';
import BulkCheckbox from 'components/common/BulkCheckbox/BulkCheckbox';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
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
  StandardTaskThreeDots,
  CompletedBy,
  InfoText,
  ListLink,
  ListItemLink,
  AssigneeMatchingWrapper,
  TaskItemParentTaskLabel,
  CommentIcon,
  CalendarIcon,
  LabelIcon,
  AttachmentIcon,
  DescriptionTooltip,
  SubtasksCellContentButton,
  SubtasksCellText,
  SubtasksImg,
  DescriptionLabel,
  DescriptionWrapper,
  AddSubtaskButton,
  PriorityIndicator,
  BulkContainer,
} from '../styled';
import TaskItemContextMenu from '../TaskItemContextMenu/TaskItemContextMenu';

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

const TaskItem = ({
  isOpen,
  switchOpen,
  toggleCompleteTask,
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
  patientVisible,
  selectedTask,
  parentHasPatient,
  highlightedValue,
  isDraggable,
  isLast,
  showSubtaskStylingLink,
  isNestedTask = false,
  subtasksDisabled,
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
    subtaskQuickAddOpen,
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
  const [contextMenu, setContextMenu] = useState(null);
  const [
    isDescriptionTooltipVisible,
    setIsDescriptionTooltipVisible,
  ] = useState(false);
  const dispatch = useDispatch();
  const previousDescription = useRef(null);
  const descriptionReference = useRef(null);

  const isSubtask = !!parentTaskIdentifier;

  const { bulkEditIsActive, bunchBulkEditTaskActions } = useContext(
    BulkEditContext,
  );

  const bulkEditTaskActions = useMemo(
    () =>
      isSubtask
        ? bunchBulkEditTaskActions?.subtaskActions
        : bunchBulkEditTaskActions?.parentActions,
    [bunchBulkEditTaskActions, isSubtask],
  );

  const preventSubtasksCount = useRef(subTasksCount);
  const preventAttachmentsLength = useRef(attachments?.length);
  const hasAttachments = useMemo(() => attachments?.length > 0, [attachments]);

  const bulkEditActionPayload = useMemo(
    () =>
      isSubtask
        ? { parentTaskIdentifier, taskIdentifier, hasAttachments, taskList }
        : { taskIdentifier, subTasksCount, hasAttachments, taskList },
    [
      isSubtask,
      parentTaskIdentifier,
      taskIdentifier,
      subTasksCount,
      hasAttachments,
      taskList,
    ],
  );

  const isCheckedByBulkEdit = useMemo(
    () =>
      bulkEditTaskActions?.getTaskIsSelectedInBulkEdit(bulkEditActionPayload),
    [bulkEditTaskActions, bulkEditActionPayload],
  );

  useEffect(() => {
    if (subTasksCount !== preventSubtasksCount?.current) {
      preventSubtasksCount.current = subTasksCount;

      if (
        !isSubtask &&
        bulkEditTaskActions?.onUpdateSelectedBulkEditTask &&
        isCheckedByBulkEdit
      ) {
        bulkEditTaskActions.onUpdateSelectedBulkEditTask({
          taskIdentifier,
          subTasksCount,
        });
      }
    }

    if (
      attachments?.length !== preventAttachmentsLength?.current &&
      isCheckedByBulkEdit
    ) {
      preventAttachmentsLength.current = attachments?.length;

      if (bulkEditTaskActions?.onUpdateSelectedBulkEditTask)
        bulkEditTaskActions.onUpdateSelectedBulkEditTask({
          taskIdentifier,
          hasAttachments: attachments?.length > 0,
        });
    }
  }, [
    attachments,
    bulkEditTaskActions,
    isSubtask,
    subTasksCount,
    taskIdentifier,
    isCheckedByBulkEdit,
  ]);

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

  const handleTaskItemRightClick = useCallback(event => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY });
  }, []);

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
      selectedTask?.parentTaskIdentifier === taskIdentifier) ||
    contextMenu != null;

  const onMouseEnter = () => setIsHoverd(true);
  const onMouseLeave = () => setIsHoverd(false);

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

      if (isCheckedByBulkEdit && bulkEditTaskActions?.onUnselectBulkEditTask) {
        bulkEditTaskActions.onUnselectBulkEditTask(bulkEditActionPayload);
      }
      event.stopPropagation();
    },
    [
      isTaskStatusTogglingEnabled,
      isSubtask,
      isCompletedGroup,
      isCompleted,
      isCheckedByBulkEdit,
      bulkEditTaskActions,
      toggleCompleteTask,
      task,
      bulkEditActionPayload,
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

  const onSubtaskLabelClick = useCallback(
    event => {
      event.stopPropagation();
      if (!subtasksDisabled) {
        if (!isOpen) {
          switchOpen(true);
        } else {
          switchOpen(!isOpen);
        }
      }
    },
    [isOpen, switchOpen, subtasksDisabled],
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
    dispatch(openDrawer(FocusDrawerFieldEnum.ATTACHEMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const showDraggableDots =
    !dragAndDropDisabled && isDraggable && !bulkEditIsActive;
  const showPriority = task.priority === 'HIGH';

  const patientName = patient?.middleName
    ? `${patient?.lastName}, ${patient?.firstName} ${patient?.middleName?.slice(
        0,
        1,
      )}`
    : `${patient?.lastName}, ${patient?.firstName}`;

  const hasParentTaskLabel = isSubtask && !isNestedTask && parentTask;

  return (
    <>
      <StandardTaskItemPanel
        onContextMenu={handleTaskItemRightClick}
        isDragging={isDragging}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {showDraggableDots && (
          <StandardTaskThreeDots src={ThreeDotsIcon} {...dragHandleProps} />
        )}
        <StandardTaskItemContainer
          isSelected={isSelectedTask || isCheckedByBulkEdit}
          height={
            hasParentTaskLabel || isCompletedGroup
              ? EXTENDED_TASK_HEIGHT
              : STANDARD_TASK_HEIGHT
          }
        >
          {showPriority && <PriorityIndicator />}
          {showSubtaskStylingLink && getSubtaskStylingLink(isLast)}
          {bulkEditTaskActions && (
            <BulkContainer>
              <BulkCheckbox
                isChecked={isCheckedByBulkEdit}
                onClick={() =>
                  bulkEditTaskActions?.onClickBulkEditTask(
                    bulkEditActionPayload,
                  )
                }
              />
            </BulkContainer>
          )}
          <MainStandardTaskItemCell
            bolded
            paddingLeft="smallPlus"
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
                {duplicated && (
                  <DescriptionLabel>(duplicated)</DescriptionLabel>
                )}
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
          <StandardTaskItemCell
            width="60px"
            justify="center"
            paddingLeft="tiny"
            paddingRight="tiny"
          >
            {!isSubtask ? (
              <>
                {subTasksCount > 0 ? (
                  <SubtasksCellContentButton
                    isOpen={isOpen}
                    disabled={subtasksDisabled}
                    onClick={onSubtaskLabelClick}
                  >
                    <SubtasksCellText>{subTasksCount}</SubtasksCellText>
                    <SubtasksImg
                      src={
                        subtasksDisabled
                          ? SubtasksIconDisabled
                          : // eslint-disable-next-line unicorn/no-nested-ternary
                          isOpen
                          ? SubtasksIconActive
                          : SubtasksIcon
                      }
                      alt="Subtasks"
                    />
                  </SubtasksCellContentButton>
                ) : (
                  <>
                    {isHovered &&
                      !isSubtask &&
                      !subtaskQuickAddOpen &&
                      !subtasksDisabled && (
                        <AddSubtaskButton
                          type="button"
                          onClick={() =>
                            dispatch(openQuickAddSubtask(taskIdentifier))
                          }
                        >
                          <AddPlaceholder>+ Add</AddPlaceholder>
                        </AddSubtaskButton>
                      )}
                  </>
                )}
              </>
            ) : (
              <SingleSubtaskIcon />
            )}
          </StandardTaskItemCell>
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
            onContextMenu={event => {
              event.stopPropagation();
            }}
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
                <Tooltip
                  placement="top"
                  title={
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
                </Tooltip>
              </GridImg>
              <GridImg item xs={4} matched={matchLabels}>
                <Tooltip
                  placement="top"
                  title={
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
                </Tooltip>
              </GridImg>
              <GridImg item xs={4} matched={matchAttachments}>
                <Tooltip
                  placement="top"
                  title={
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
                </Tooltip>
              </GridImg>
            </Grid>
          </StandardTaskItemCell>
          <StandardTaskItemCell
            paddingLeft="tiny"
            paddingRight="tiny"
            width="60px"
            justify="center"
            onContextMenu={event => {
              event.stopPropagation();
            }}
          >
            <PopoverDatepicker
              selectedDate={dueDate}
              onDateChange={date => {
                const existingTime = dueDate
                  ? moment(dueDate).format('HH:mm')
                  : '';

                updateDueDate(
                  task,
                  moment(`${date} ${existingTime}`, 'YYYY-MM-DD HH:mm'),
                  true,
                );
              }}
              quickSelectOptions={dueDateQuickSelectOptions}
            >
              {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
                <button
                  type="button"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  ref={elementReference}
                >
                  <Tooltip
                    placement="top"
                    title={
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
                  </Tooltip>
                </button>
              )}
            </PopoverDatepicker>
          </StandardTaskItemCell>
          <StandardTaskItemCell
            width="80px"
            justify="center"
            paddingLeft="tiny"
            paddingRight="tiny"
            onContextMenu={event => {
              event.stopPropagation();
            }}
          >
            <TaskAssignMember
              currentUser={currentUser}
              reassignTask={reassignTask}
              task={task}
            >
              {assignedTo ? (
                <Tooltip
                  placement="top-end"
                  title={`Assigned to ${assignedTo.userName}`}
                >
                  <AssigneeMatchingWrapper matched={matchAssignedTo} />
                  <Member member={assignedTo} size={30} showTooltip={false} />
                </Tooltip>
              ) : (
                <Tooltip placement="top" title="Assign to">
                  <AddCrossIcon src={CrossIcon} size="28px" />
                </Tooltip>
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
      {contextMenu && (
        <TaskItemContextMenu
          position={contextMenu}
          task={task}
          onClose={() => setContextMenu(null)}
          subtasksDisabled={subtasksDisabled}
        />
      )}
    </>
  );
};

export default React.memo(TaskItem);
