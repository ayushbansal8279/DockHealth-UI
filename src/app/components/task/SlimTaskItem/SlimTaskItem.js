/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pluck } from 'ramda';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { EditorState } from 'draft-js';
import { useSelector } from 'react-redux';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import ThreeDotsIcon from 'img/three-dots';
import { onTaskDueDateChanged } from 'helpers/ga-event-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import MemberGroup from 'components/members/MemberGroup/MemberGroup';
import Tooltip from 'components/common/Tooltip/Tooltip';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import AssignMemberIcon from 'components/members/AssignMemberIcon/AssingMemberIcon';
import { isDueDateOverdue } from 'helpers/task-helpers';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import TaskItemStatus from '../StandardTaskItem/TaskItemStatus';
import {
  ClickablePatient,
  CircleIcon,
  SlimTaskItemContainer,
  SlimTaskItemDescription,
  SlimTaskItemParentTaskLabel,
  SlimTaskItemListLink,
  ThreeDots,
  CompletedBy,
  AssignedBox,
  SlimTaskWorkflowStatusContainer,
  SlimTaskItemPatientLink,
  AddPlaceholder,
  SlimTaskListNameText,
  MainStandardTaskItemCell,
  StandardTaskItemCell,
  DescriptionBox,
  DescriptionWrapper,
  PriorityIndicator,
  DueDateBasicLabel,
} from '../styled';

const STANDARD_TASK_HEIGHT = 35;
const EXTENDED_TASK_HEIGHT = 50;

const DueDateComponent = ({ dueDate, updateDueDate, task, isHovered }) => {
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

  return (
    <PopoverDatepicker
      selectedDate={dueDate}
      onDateChange={date => {
        const existingTime = dueDate ? moment(dueDate).format('HH:mm') : '';
        updateDueDate(
          task,
          moment(`${date} ${existingTime}`, 'YYYY-MM-DD HH:mm'),
          true,
        );
        onTaskDueDateChanged();
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
              <DueDateBasicLabel isOverdue={isDueDateOverdue(task)}>
                {moment(dueDate).format('MM/DD')}
              </DueDateBasicLabel>
            ) : (
              <TaskIcon type="calendar" isHovered={isHovered} />
            )}
          </Tooltip>
        </button>
      )}
    </PopoverDatepicker>
  );
};

const PatientComponent = ({
  status,
  patient,
  openDrawer,
  storeAsCurrentTask,
  task,
  parentTask,
}) => {
  const taskPatient = parentTask ? parentTask.patient : patient;

  return (
    <ClickablePatient
      onClick={() => {
        if (!taskPatient) {
          openDrawer(DrawerFieldEnum.PATIENT);
          storeAsCurrentTask(task);
        }
      }}
    >
      {status !== 'COMPLETE' && !taskPatient && (
        <AddPlaceholder>+ Add Patient</AddPlaceholder>
      )}
      {taskPatient && (
        <SlimTaskItemPatientLink
          to={`/core/patient/${taskPatient.patientIdentifier}`}
        >
          {taskPatient.middleName && taskPatient.middleName !== ''
            ? `${taskPatient.lastName}, ${
                taskPatient.firstName
              } ${taskPatient.middleName?.slice(0, 1)}`
            : `${taskPatient.lastName}, ${taskPatient.firstName}`}
        </SlimTaskItemPatientLink>
      )}
    </ClickablePatient>
  );
};

const WorkflowStatusComponent = ({
  task,
  status,
  workflowStatus,
  updateWorkflowStatus,
}) => (
  <SlimTaskWorkflowStatusContainer
    withPadding={status !== 'COMPLETE' && workflowStatus}
  >
    <TaskWorkflowStatus
      updateWorkflowStatus={value => updateWorkflowStatus(task, value)}
    >
      {status !== 'COMPLETE' && workflowStatus && (
        <TaskItemStatus workflowStatus={workflowStatus} />
      )}
      {task.status !== 'COMPLETE' && !workflowStatus && (
        <AddPlaceholder> + Add Status</AddPlaceholder>
      )}
    </TaskWorkflowStatus>
  </SlimTaskWorkflowStatusContainer>
);

const getDynamicColumn = type => {
  switch (type) {
    case 'DUE_DATE': {
      return DueDateComponent;
    }

    case 'PATIENT': {
      return PatientComponent;
    }

    case 'WORKFLOW_STATUS': {
      return WorkflowStatusComponent;
    }

    default: {
      return DueDateComponent;
    }
  }
};

const SlimTaskItem = ({
  task,
  toggleTaskComplete,
  storeAsCurrentTask,
  redirectToParentTask,
  isDragging,
  isDraggable,
  dragHandleProps,
  openDrawer,
  isSelected,
  showAssignedPerson,
  gridConfig,
  updateDueDate,
  dynamicColumnType = 'DUE_DATE',
  onTaskUpdate,
  updateWorkflowStatus,
}) => {
  const {
    taskIdentifier,
    assignedToUsers,
    description,
    tokenizedDescription,
    taskMentions,
    taskList,
    dueDate,
    priority,
    parentTask,
    completedDt,
    completedBy,
    status,
  } = task;

  const currentUser = useSelector(userProfileSelector);
  const history = useHistory();
  const [isHovered, setIsHoverd] = useState(false);

  const formattedTaskDescription =
    description?.length > 100
      ? description
          ?.substring(0, 100)
          .trim()
          .concat('...')
      : description;

  const previousDescriptionValue = useRef(null);
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: formattedTaskDescription,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
    }),
  );

  useEffect(() => {
    if (previousDescriptionValue.current !== null) {
      const newContent = createMentionEntities(
        tokenizedDescription,
        formattedTaskDescription,
        taskMentions,
      );
      setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescriptionValue.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const isOverdueTask =
    moment(dueDate).format('HH:mm') !== '00:00'
      ? moment(dueDate).isBefore(moment())
      : dueDate && moment(dueDate).isBefore(moment().startOf('day'));
  const taskListLength = isOverdueTask ? 20 : 24;
  const formattedTaskListName =
    taskList?.listName?.length > taskListLength
      ? taskList?.listName
          ?.substring(0, taskListLength)
          .trim()
          .concat('...')
      : taskList?.listName;

  const showTooltip = taskList?.listName?.length > taskListLength;

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const isCompleted = status === 'COMPLETE';
  const DynamicColumnComponent = getDynamicColumn(dynamicColumnType);

  const onMouseEnter = () => setIsHoverd(true);
  const onMouseLeave = () => setIsHoverd(false);

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

  return (
    <SlimTaskItemContainer
      isDragging={isDragging}
      isSelected={isSelected}
      height={parentTask ? EXTENDED_TASK_HEIGHT : STANDARD_TASK_HEIGHT}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isDraggable && (
        <ThreeDots
          src={ThreeDotsIcon}
          {...dragHandleProps}
          style={{ marginLeft: '-30px' }}
        />
      )}
      {priority === 'HIGH' && <PriorityIndicator />}
      <MainStandardTaskItemCell
        bolded
        paddingLeft="smallPlus"
        paddingRight="small"
        position="static"
      >
        <CircleIcon
          src={isCompleted ? CircleCompleted : Circle}
          onClick={toggleTaskComplete}
          isClickable
        />
        <DescriptionBox
          onClick={() => {
            openDrawer();
            storeAsCurrentTask(task, 'home');
          }}
        >
          <DescriptionWrapper>
            <SlimTaskItemDescription>
              <MentionsEditor
                readOnly
                state={descriptionState}
                onChange={setDescriptionState}
              />
              <CompletedBy isCompleted={isCompleted}>
                <span>{`Completed by ${completedByName} ${completedDt &&
                  ` on ${
                    completedDt
                      ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                      : ''
                  }`}
                `}</span>
              </CompletedBy>
              {parentTask && (
                <SlimTaskItemParentTaskLabel>
                  Subtask of
                  <span
                    onClick={() => {
                      storeAsCurrentTask(parentTask);
                      redirectToParentTask(
                        parentTask?.taskList?.taskListIdentifier,
                        parentTask?.taskIdentifier,
                        parentTask?.status,
                        history,
                      );
                    }}
                  >
                    {` ${parentTask.description}`}
                  </span>
                </SlimTaskItemParentTaskLabel>
              )}
            </SlimTaskItemDescription>
          </DescriptionWrapper>
        </DescriptionBox>
      </MainStandardTaskItemCell>
      <StandardTaskItemCell
        paddingLeft="tiny"
        paddingRight="tiny"
        {...gridConfig.dynamicColumn[dynamicColumnType]}
      >
        <DynamicColumnComponent
          {...{
            ...task,
            isOverdueTask: isOverdueTask && !isCompleted,
            updateDueDate,
            task,
            openDrawer,
            storeAsCurrentTask,
            updateWorkflowStatus,
            isHovered,
          }}
        />
      </StandardTaskItemCell>
      {showAssignedPerson && (
        <StandardTaskItemCell
          justify="center"
          paddingLeft="small"
          paddingRight="small"
          {...gridConfig.assignedPerson}
        >
          <AssignedBox>
            <MultiAssignPopover
              taskListIdentifiers={task?.taskList?.taskListIdentifier}
              selectedMembers={assignedToUsers}
              onSelect={handleReasignTask}
            >
              {assignedToUsers?.length ? (
                <MemberGroup members={assignedToUsers} />
              ) : (
                <AssignMemberIcon />
              )}
            </MultiAssignPopover>
          </AssignedBox>
        </StandardTaskItemCell>
      )}
      {taskList && (
        <StandardTaskItemCell
          justify="left"
          paddingLeft="tiny"
          paddingRight="tiny"
          {...gridConfig.listName}
        >
          <SlimTaskItemListLink
            to={`/core/tasks/${taskList?.taskListIdentifier}`}
            withMargin={isOverdueTask}
          >
            <Tooltip
              placement="top"
              title={taskList?.listName}
              hideTooltip={!showTooltip}
            >
              <SlimTaskListNameText>
                {formattedTaskListName}
              </SlimTaskListNameText>
            </Tooltip>
          </SlimTaskItemListLink>
        </StandardTaskItemCell>
      )}
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
