/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { EditorState } from 'draft-js';
import { Grid } from '@material-ui/core';
import Circle from 'img/circle';
import CrossIcon from 'img/cross';
import CircleCompleted from 'img/circle-completed';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';
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

import { getCalendarIcon } from '../icons';
import TaskItemStatus from '../StandardTaskItem/TaskItemStatus';
import {
  ClickablePatient,
  CircleIcon,
  SlimTaskItemContainer,
  SlimTaskItemDescription,
  SlimTaskItemParentTaskLabel,
  SlimTaskItemListLink,
  PrioritySwitch,
  ThreeDots,
  CompletedBy,
  DueDate,
  DueDateContainer,
  SlimTaskGridContainer,
  AssignedBox,
  SlimTaskWorkflowStatusContainer,
  SlimTaskItemPatientLink,
  DueDateAddLabel,
  AddCrossIcon,
  AddPlaceholder,
  SlimTaskListNameText,
} from '../styled';

const DueDateComponent = ({ dueDate, updateDueDate, task }) => {
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
          <DueDateContainer>
            <DueDate>{dueDate && moment(dueDate).format('MM/DD')}</DueDate>
            <img alt="due-date" src={getCalendarIcon(dueDate, true)} />
            {!dueDate && <DueDateAddLabel>Add</DueDateAddLabel>}
          </DueDateContainer>
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
        <AddPlaceholder>+ Patient</AddPlaceholder>
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
        <AddPlaceholder>+ Status</AddPlaceholder>
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

  return (
    <SlimTaskItemContainer isDragging={isDragging} isSelected={isSelected}>
      {isDraggable && <ThreeDots src={ThreeDotsIcon} {...dragHandleProps} />}
      <PrioritySwitch left="42px" onClick={() => {}} isClickable={false}>
        {priority === 'HIGH' && (
          <img src={HighPriorityLabel} alt="Priority icon" />
        )}
      </PrioritySwitch>
      <Grid container justify="space-between" alignItems="stretch">
        <Grid container item {...gridConfig.description[dynamicColumnType]}>
          <SlimTaskGridContainer>
            <CircleIcon
              src={isCompleted ? CircleCompleted : Circle}
              onClick={toggleTaskComplete}
              isClickable
            />
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
          </SlimTaskGridContainer>
        </Grid>
        <Grid container item {...gridConfig.dynamicColumn[dynamicColumnType]}>
          <DynamicColumnComponent
            {...{
              ...task,
              isOverdueTask: isOverdueTask && !isCompleted,
              updateDueDate,
              task,
              openDrawer,
              storeAsCurrentTask,
              updateWorkflowStatus,
            }}
          />
        </Grid>
        {showAssignedPerson && (
          <Grid container item {...gridConfig.assignedPerson}>
            <AssignedBox>
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
            </AssignedBox>
          </Grid>
        )}
        <Grid container item {...gridConfig.listName}>
          {taskList && (
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
          )}
        </Grid>
      </Grid>
    </SlimTaskItemContainer>
  );
};

export default SlimTaskItem;
