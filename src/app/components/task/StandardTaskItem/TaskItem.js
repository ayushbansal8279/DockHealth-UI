/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { pluck } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
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
import ThreeDotsIcon from 'img/three-dots';
import { userProfileSelector } from 'selectors/user-selectors';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import SubtaskIcon from 'img/SubtaskIcon';
import ParentTaskIcon from 'img/ParentTaskIcon';
import palette from 'styles/palette';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import Spacing from 'components/common/Spacing';
import PatientCard from 'components/patients/PatientCard/PatientCard';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import {
  getLabelsIconTooltipTitle,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  isDueDateOverdue,
} from 'helpers/task-helpers';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import TaskItemStatus from './TaskItemStatus';
import { getSubtaskStylingLink } from './helpers';
import {
  AddPlaceholder,
  CircleIcon,
  ClickablePatient,
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
  DescriptionTooltip,
  SubtasksCellContentButton,
  SubtasksCellText,
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
  onTaskUpdate,
  updateDueDate,
  updateWorkflowStatus,
  subTasksCount,
  dragAndDropDisabled,
  listNameVisible,
  patientVisible,
  isSelected,
  parentHasPatient,
  highlightedValue,
  isDraggable,
  isLast,
  showSubtaskStylingLink,
  isNestedTask = false,
  subtasksDisabled,
  multipleAssigneesContext,
  highlightTasksOfTheSameParent,
}) => {
  const {
    taskIdentifier,
    edited,
    duplicated,
    assignedToUsers,
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

  const currentUser = useSelector(userProfileSelector);
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

  const previousSubtasksCount = useRef(subTasksCount);
  const previousAttachmentsLength = useRef(attachments?.length);
  const previousAssignedToUsers = useRef(assignedToUsers);
  const hasAttachments = useMemo(() => attachments?.length > 0, [attachments]);

  const bulkEditActionPayload = useMemo(
    () =>
      isSubtask
        ? {
            parentTaskIdentifier,
            taskIdentifier,
            hasAttachments,
            taskList,
            assignedToUsers,
          }
        : {
            taskIdentifier,
            subTasksCount,
            hasAttachments,
            taskList,
            assignedToUsers,
          },
    [
      isSubtask,
      parentTaskIdentifier,
      taskIdentifier,
      hasAttachments,
      taskList,
      assignedToUsers,
      subTasksCount,
    ],
  );

  const isCheckedByBulkEdit = useMemo(
    () =>
      bulkEditTaskActions?.getTaskIsSelectedInBulkEdit(bulkEditActionPayload),
    [bulkEditTaskActions, bulkEditActionPayload],
  );

  useEffect(() => {
    if (subTasksCount !== previousSubtasksCount?.current) {
      previousSubtasksCount.current = subTasksCount;

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
      attachments?.length !== previousAttachmentsLength?.current ||
      assignedToUsers !== previousAssignedToUsers?.current
    ) {
      previousAttachmentsLength.current = attachments?.length;
      previousAssignedToUsers.current = assignedToUsers;

      if (
        isCheckedByBulkEdit &&
        bulkEditTaskActions?.onUpdateSelectedBulkEditTask
      )
        bulkEditTaskActions.onUpdateSelectedBulkEditTask({
          taskIdentifier,
          hasAttachments: attachments?.length > 0,
          assignedToUsers,
        });
    }
  }, [
    attachments,
    bulkEditTaskActions,
    isSubtask,
    subTasksCount,
    taskIdentifier,
    isCheckedByBulkEdit,
    assignedToUsers,
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
      } else {
        highlightTasksOfTheSameParent(
          task.parentTaskIdentifier || task.taskIdentifier,
        );
      }
    },
    [
      subtasksDisabled,
      isOpen,
      switchOpen,
      highlightTasksOfTheSameParent,
      task.parentTaskIdentifier,
      task.taskIdentifier,
    ],
  );

  const onPatientClick = useCallback(() => {
    if (!patient) {
      dispatch(openDrawer(DrawerFieldEnum.PATIENT));
      dispatch(storeAsCurrentTask(task));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, task]);

  const onCommentClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.COMMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onLabelClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.LABEL));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.ATTACHEMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const handleReasignTask = useCallback(
    selectedMembers => {
      onTaskUpdate(taskIdentifier, {
        assignedToUsers: selectedMembers,
        assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        assignedBy: selectedMembers?.length ? currentUser : null,
      });
    },
    [currentUser, onTaskUpdate, taskIdentifier],
  );

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
          isSelected={isSelected || isCheckedByBulkEdit}
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
              <Checkbox
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
            {!isSubtask &&
            !subtaskQuickAddOpen &&
            !subtasksDisabled &&
            !subTasksCount ? (
              <AddSubtaskButton
                type="button"
                onClick={() => dispatch(openQuickAddSubtask(taskIdentifier))}
              >
                {isHovered && <AddPlaceholder>+ Add</AddPlaceholder>}
              </AddSubtaskButton>
            ) : (
              <>
                {(subTasksCount || isSubtask) && (
                  <SubtasksCellContentButton
                    isOpen={isOpen}
                    disabled={isNestedTask}
                    isGreyedOut={subtasksDisabled}
                    onClick={onSubtaskLabelClick}
                  >
                    {!isSubtask ? (
                      <>
                        <SubtasksCellText>{subTasksCount}</SubtasksCellText>
                        <ParentTaskIcon />
                      </>
                    ) : (
                      <SubtaskIcon />
                    )}
                  </SubtasksCellContentButton>
                )}
              </>
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
                    comments?.length > 0
                      ? getCommentsIconTooltipTitle(comments)
                      : 'Add a new comment'
                  }
                >
                  <TaskIcon
                    type="comments"
                    isHovered={isHovered}
                    isActive={comments?.length > 0}
                    isNew={task.updatedComment}
                    onClick={onCommentClick}
                  />
                </Tooltip>
              </GridImg>
              <GridImg item xs={4} matched={matchLabels}>
                <Tooltip
                  placement="top"
                  title={
                    labels?.length > 0
                      ? getLabelsIconTooltipTitle(labels)
                      : 'Add label'
                  }
                >
                  <TaskIcon
                    type="labels"
                    isHovered={isHovered}
                    isActive={labels?.length > 0}
                    isNew={task.updatedLabel}
                    onClick={onLabelClick}
                  />
                </Tooltip>
              </GridImg>
              <GridImg item xs={4} matched={matchAttachments}>
                <Tooltip
                  placement="top"
                  title={
                    attachments?.length > 0
                      ? getAttachmentsIconTooltipTitle(attachments)
                      : 'Add file'
                  }
                >
                  <TaskIcon
                    type="attachments"
                    onClick={onAttachmentsClick}
                    isHovered={isHovered}
                    isActive={attachments?.length > 0}
                    isNew={task.updatedAttachment}
                  />
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
                    title={dueDate ? 'Edit due date' : 'Add due date'}
                  >
                    {dueDate ? (
                      <DueDateBasicLabel isOverdue={isDueDateOverdue(dueDate)}>
                        {moment(dueDate).format('MM/DD')}
                      </DueDateBasicLabel>
                    ) : (
                      <TaskIcon type="calendar" isHovered={isHovered} />
                    )}
                  </Tooltip>
                </button>
              )}
            </PopoverDatepicker>
          </StandardTaskItemCell>
          <StandardTaskItemCell
            width={`${multipleAssigneesContext ? 90 : 60}px`}
            justify={multipleAssigneesContext ? 'flex-start' : 'center'}
            paddingLeft="small"
            paddingRight="small"
            onContextMenu={event => {
              event.stopPropagation();
            }}
          >
            <MultiAssignPopover
              fullWidth={multipleAssigneesContext}
              taskListIdentifiers={task?.taskList?.taskListIdentifier}
              selectedMembers={assignedToUsers}
              onSelect={handleReasignTask}
            >
              {assignedToUsers?.length ? (
                <>
                  <AssigneeMatchingWrapper matched={matchAssignedTo} />
                  <MemberGroup members={assignedToUsers} />
                </>
              ) : (
                <Tooltip placement="top" title="Assign to">
                  <AssignMemberIcon />
                </Tooltip>
              )}
            </MultiAssignPopover>
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
