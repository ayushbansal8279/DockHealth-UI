/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { EditorState } from 'draft-js';
import Circle from 'img/circle';
import CrossIcon from 'img/cross';
import CircleCompleted from 'img/circle-completed';
import EmptyCalendarIcon from 'img/calendar-dim.svg';
import EmptyCalendarIconHover from 'img/calendar-icon-hover.svg';
import ThreeDotsIcon from 'img/three-dots';
import Tooltip from 'components/common/Tooltip/Tooltip';
import Member from 'components/members/Member/Member';
import PopoverDatepicker from 'components/common/PopoverDatepicker/PopoverDatepicker';
import TaskWorkflowStatus from 'components/tasklist/TaskWorkflowStatus/TaskWorkflowStatus';
import TaskAssignMember from 'components/tasklist/TaskAssignMember/TaskAssignMember';
import { FocusDrawerFieldEnum } from 'components/task-drawer/NewTaskDrawer.Utilities';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';

import { getItemIconVersion, REGULAR, isDueDateOverdue } from '../icons';
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
  AddCrossIcon,
  AddPlaceholder,
  SlimTaskListNameText,
  MainStandardTaskItemCell,
  StandardTaskItemCell,
  DescriptionBox,
  DescriptionWrapper,
  PriorityIndicator,
  DueDateBasicLabel,
  CalendarIcon,
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
      }}
      quickSelectOptions={dueDateQuickSelectOptions}
    >
      {({ elementReference, setIsPopoverOpen, isPopoverOpen }) => (
        <button
          type="button"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          ref={elementReference}
        >
          {/* <DueDateContainer>
            <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
            <img alt="due-date" src={getCalendarIcon(dueDate, true)} />
            {!dueDate && <DueDateAddLabel>Add</DueDateAddLabel>}
          </DueDateContainer> */}
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
                src={isHovered ? EmptyCalendarIconHover : EmptyCalendarIcon}
                alt="Due date"
              />
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
          openDrawer(FocusDrawerFieldEnum.PATIENT);
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
    <TaskWorkflowStatus task={task} updateWorkflowStatus={updateWorkflowStatus}>
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
  currentUser,
  reassignTask,
  updateWorkflowStatus,
}) => {
  const {
    assignedTo,
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
        <DescriptionBox>
          <DescriptionWrapper>
            <SlimTaskItemDescription>
              <div
                onClick={() => {
                  openDrawer();
                  storeAsCurrentTask(task, 'home');
                }}
              >
                <MentionsEditor
                  readOnly
                  state={descriptionState}
                  onChange={setDescriptionState}
                />
              </div>
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
          paddingLeft="tiny"
          paddingRight="tiny"
          {...gridConfig.assignedPerson}
        >
          <AssignedBox>
            <TaskAssignMember
              currentUser={currentUser}
              reassignTask={reassignTask}
              task={task}
            >
              {assignedTo ? (
                <Member member={assignedTo} size={30} />
              ) : (
                <AddCrossIcon src={CrossIcon} size="30px" />
              )}
            </TaskAssignMember>
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
