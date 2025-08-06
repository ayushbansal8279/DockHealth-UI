/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import pluck from 'ramda/src/pluck';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import SimpleArrowRight from 'img/simple-arrow-right.svg';
import RecurringIcon from 'img/recurring-arrows';
import ReminderIcon from 'img/reminder';
import {
  onTaskDrawerSubtaskCompleted,
  onTaskDrawerSubtaskReActivated,
  onTaskDrawerSubtaskAssigned,
} from 'helpers/ga-event-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Spacing from 'components/common/Spacing';
import {
  storeAsCurrentTask,
  toggleCompleteTask,
  partialUpdateTask,
  updateTaskDueDate,
} from 'actions/task-actions';
import MultiAssignMembersList from 'components/task/MultiAssignPopover/MultiAssignMembersList';
import { openDrawer } from 'actions/task-drawer-actions';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
// import TextEditor from 'components/common/TextEditor/TextEditor';
// import { convertToEditorState } from 'components/common/TextEditor/helpers';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import MemberGroup from 'components/user/MemberGroup/MemberGroup';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import AssignMemberIcon from 'components/user/AssignMemberIcon/AssingMemberIcon';
import { DueDateBasicLabel } from 'components/task/styled';
import DueDatePicker from 'components/task/DueDatePicker/DueDatePicker';
import TaskDragHandle from 'components/task/TaskDragHandle/TaskDragHandle';
import {
  checkDateTimeIntent,
  checkIfTemplateTask,
  DueDateIntent,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
  getLabelsIconTooltipTitle,
  isDueDateOverdue,
  ReminderType,
  validateAssigneeCompleteDisabled,
} from 'helpers/task-helpers';
// import { userProfileSelector } from 'selectors/user-selectors';
// import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  // SINGLE_TASK_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { createMentionsFromTokenizedDescription } from 'components/common/RichTextEditor/CreateMentions';
import {
  Container,
  IconsSection,
  CircleIcon,
  Description,
  DescriptionContainer,
  AssigneeContainer,
  GoToParentIconContainer,
  DueDateContainer,
  IconContainer,
  DueDateText,
  DragHandleContainer,
} from './styled';
import { adjustUTCDateForDateIntent } from '../../task/DueDatePicker/helpers';
import { selectedUserOrganizationSelector } from '@/app/selectors/user-selectors';
import { isMemberAdmin } from '@/app/helpers/list-members-helper';
import { checkIfUserIsOrganizationAdmin } from '@/app/helpers/user-helper';
import { currentTaskListSelector } from '@/app/selectors/task-list-selectors';

const { DISABLED, READ_ONLY } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

const DrawerTask = (props) => {
  const {
    task,
    taskRestrictions,
    taskListRestrictions: taskListRestriction,
    currentUser,
    dragListeners,
    dragAttributes,
    isDraggable,
    isDragging,
    isDragActive,
    isDraggedOver,
    hoverBorder,
  } = props;

  const dispatch = useDispatch();
  const restrictions = taskRestrictions;

  const {
    taskIdentifier,
    status,
    // description,
    tokenizedDescription,
    taskMentions,
    assignedToUsers: taskAssignedToUsers,
    dueDate: taskDueDate,
    dueDateIntent,
    creator,
    comments,
    updatedComment,
    labels,
    updatedLabel,
    attachments,
    updatedAttachment,
    taskList,
    hasRecurringSchedule,
    reminderType,
    dependencyTasksCompletedCount,
    dependencyTasksCount,
  } = task;

  const [assignedToUsers, setAssignedToUsers] = useState(taskAssignedToUsers);
  const [dueDate, setDueDate] = useState(taskDueDate);
  const [isCompleted, setIsCompleted] = useState(task?.status === 'COMPLETE');
  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const currentTasklist = useSelector(currentTaskListSelector);
  let taskListRestrictions = taskListRestriction;
  if (!taskListRestrictions) {
    taskListRestrictions = {};
  }

  useEffect(() => {
    if (task?.status === 'COMPLETE') {
      setIsCompleted(true);
    }
    setAssignedToUsers(taskAssignedToUsers);
    setDueDate(taskDueDate);
  }, [task]);

  const updateStatus = () => {
    setIsCompleted(!isCompleted);
  };

  const isTemplateTask = checkIfTemplateTask(task);

  // const [descriptionState, setDescriptionState] = useMentionsEditorState(
  //   convertToEditorState({
  //     rawText: description,
  //     tokenizedText: tokenizedDescription,
  //     mentions: taskMentions,
  //     handleRichText: false,
  //   }),
  // );

  const isDecisionTask = task.intentType === 'DECISION';
  const isDecisionSelected = task.taskOutcomes?.reduce(
    (accumulator, currentValue) => accumulator || currentValue.isSelected,
    false,
  );
  const isTaskStatusTogglingDisabled =
    isTemplateTask || (isDecisionTask && !isDecisionSelected);

  const isDependencyEmptyOrCompleted =
    dependencyTasksCount === dependencyTasksCompletedCount;

  const handleGoToChildTask = useCallback(
    (childTask) => {
      return dispatch(storeAsCurrentTask(childTask));
    },
    [dispatch],
  );

  const handleReassignSubtask = useCallback(
    (selectedMembers) => {
      setAssignedToUsers(selectedMembers);
      onTaskDrawerSubtaskAssigned();
      dispatch(
        partialUpdateTask(task.taskIdentifier, {
          assignedToUsers: selectedMembers,
          assignedToIdentifiers: pluck('userIdentifier', selectedMembers),
        }),
      );
    },
    [dispatch, task.taskIdentifier],
  );

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleCommentIconClick = () => {
    // dispatch(openDrawer(DrawerFieldEnum.COMMENT));
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleLabelIconClick = () => {
    // dispatch(openDrawer(DrawerFieldEnum.LABEL));
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleAttachmentIconClick = () => {
    // dispatch(openDrawer(DrawerFieldEnum.ATTACHMENT));
  };

  const isCreator = useMemo(() => {
    return creator?.identifier === currentUser?.identifier;
  }, [currentUser, creator]);

  const isListAdmin = useMemo(() => {
    const currentUserMember = currentTasklist?.listUsers?.find(
      (u) => u.identifier === currentUser?.identifier,
    );
    const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);
    return isMemberAdmin(currentUserMember) || isOwnerOrAdmin;
  }, [currentUser, currentTasklist]);

  const nonAssigneeCompleteDisabled = useMemo(() => {
    return validateAssigneeCompleteDisabled(
      selectedOrganization,
      task,
      currentUser,
      isListAdmin,
      isCreator,
    );
  }, [task, currentUser, selectedOrganization, isCreator, isListAdmin]);

  if (nonAssigneeCompleteDisabled) {
    taskListRestrictions.completeTask = DISABLED;
  }

  const handleDueDateChange = useCallback(
    (newDueDate) => {
      setDueDate(newDueDate);
      const dueDateIntent = checkDateTimeIntent(newDueDate);
      dispatch(updateTaskDueDate(task, newDueDate, dueDateIntent));
    },
    [dispatch, task],
  );

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [tokenizedDescription]);

  const TooltipWrapper = isTruncated ? Tooltip : React.Fragment;

  return (
    <Container
      isDragActive={isDragActive}
      isDraggedOver={isDraggedOver}
      hoverBorder={hoverBorder}
    >
      {isDraggable && (
        <DragHandleContainer isDragging={isDragging}>
          <TaskDragHandle {...dragListeners} {...dragAttributes} />
        </DragHandleContainer>
      )}
      <CircleIcon
        src={isCompleted ? CircleCompleted : Circle}
        isCompleted={isCompleted}
        isClickable={
          !isTaskStatusTogglingDisabled &&
          isDependencyEmptyOrCompleted &&
          taskListRestrictions?.completeTask !== DISABLED
        }
        onClick={
          // eslint-disable-next-line unicorn/no-negated-condition
          !isTaskStatusTogglingDisabled &&
          isDependencyEmptyOrCompleted &&
          taskListRestrictions?.completeTask !== DISABLED
            ? (event) => {
                updateStatus();
                event.stopPropagation();
                (isCompleted
                  ? onTaskDrawerSubtaskReActivated
                  : onTaskDrawerSubtaskCompleted)();
                dispatch(toggleCompleteTask(task, currentUser));
              }
            : () => {}
        }
      />
      <DescriptionContainer
        onClick={() => {
          handleGoToChildTask(task);
        }}
      >
        <Description isCrossedOut={isCompleted}>
          {/* {tokenizedDescription} */}
          <TooltipWrapper
            {...(isTruncated && {
              placement: 'top',
              title: tokenizedDescription,
            })}
          >
            <div
              ref={textRef}
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {createMentionsFromTokenizedDescription(
                tokenizedDescription,
                taskMentions,
              )}
            </div>
          </TooltipWrapper>
        </Description>
      </DescriptionContainer>
      <IconsSection>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              comments?.length > 0
                ? getCommentsIconTooltipTitle(comments)
                : 'Comment'
            }
          >
            <button type="button" onClick={handleCommentIconClick}>
              <TaskIcon
                type="comments"
                isActive={comments?.length > 0}
                isNew={updatedComment}
              />
            </button>
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              labels?.length > 0 ? getLabelsIconTooltipTitle(labels) : 'Label'
            }
          >
            <button type="button" onClick={handleLabelIconClick}>
              <TaskIcon
                type="labels"
                isActive={labels?.length > 0}
                isNew={updatedLabel}
              />
            </button>
          </Tooltip>
        </IconContainer>
        <IconContainer>
          <Tooltip
            placement="top"
            title={
              attachments?.length > 0
                ? getAttachmentsIconTooltipTitle(attachments)
                : 'File'
            }
          >
            <button type="button" onClick={handleAttachmentIconClick}>
              <TaskIcon
                type="attachments"
                isActive={attachments?.length > 0}
                isNew={updatedAttachment}
              />
            </button>
          </Tooltip>
        </IconContainer>
      </IconsSection>
      <DueDateContainer>
        <TaskItemPopover
          disabled={isTemplateTask || restrictions?.dueDate === DISABLED}
          placement="top-end"
          content={({ closePopover }) => (
            <DueDatePicker
              taskIdentifier={taskIdentifier}
              selectedDate={adjustUTCDateForDateIntent(
                moment(dueDate),
                dueDateIntent,
              )}
              onDateChange={handleDueDateChange}
              recurring={hasRecurringSchedule}
              onCloseClick={closePopover}
              dueDateIntent={dueDateIntent}
              dateType="dueDate"
            />
          )}
        >
          {dueDate ? (
            <Tooltip placement="top" title="Edit due date">
              <DueDateBasicLabel
                isOverdue={isDueDateOverdue({ ...task, dueDate })}
              >
                <DueDateText>
                  {dueDateIntent === DueDateIntent.DATE
                    ? moment(dueDate).utc().format('MM/DD')
                    : moment(dueDate).format('MM/DD')}
                </DueDateText>
                {reminderType && reminderType !== ReminderType.NONE && (
                  <>
                    <Spacing horizontal={2} />
                    <ReminderIcon />
                  </>
                )}
                {hasRecurringSchedule && (
                  <>
                    <Spacing horizontal={2} />
                    <RecurringIcon />
                  </>
                )}
              </DueDateBasicLabel>
            </Tooltip>
          ) : (
            <Tooltip placement="top" title="Add due date">
              <div>
                <TaskIcon type="calendar" />
              </div>
            </Tooltip>
          )}
        </TaskItemPopover>
      </DueDateContainer>
      <AssigneeContainer>
        <TaskItemPopover
          disabled={restrictions?.assigment === READ_ONLY}
          placement="top-end"
          fullWidth
          content={({ closePopover }) => (
            <MultiAssignMembersList
              fullWidth
              taskListIdentifiers={taskList?.taskListIdentifier}
              selectedMembers={assignedToUsers}
              onSelect={handleReassignSubtask}
              onError={closePopover}
              closeModel={closePopover}
              enableLazyLoading={
                taskList?.listType === 'PUBLIC' ||
                taskList?.listType === 'TEMPLATE'
              }
            />
          )}
        >
          {assignedToUsers?.length ? (
            <MemberGroup members={assignedToUsers} />
          ) : (
            restrictions?.assigment !== READ_ONLY && (
              <Tooltip placement="top" title="Assign to">
                <div>
                  <AssignMemberIcon />
                </div>
              </Tooltip>
            )
          )}
        </TaskItemPopover>
      </AssigneeContainer>
      <GoToParentIconContainer
        onClick={() => {
          handleGoToChildTask(task);
          dispatch(openDrawer());
        }}
      >
        <Tooltip placement="top" title="Details">
          <img src={SimpleArrowRight} alt="Go to parent task" />
        </Tooltip>
      </GoToParentIconContainer>
    </Container>
  );
};

export default DrawerTask;
