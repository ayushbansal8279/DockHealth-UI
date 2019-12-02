import { AnimatePresence } from 'framer-motion';
import Linkify from 'linkifyjs/react';
import moment from 'moment';
import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { archiveTask as archiveTaskAction } from '../../actions/task-actions';
import { isTaskArchivable as isTaskArchivableMethod } from '../../helpers/utilityFunctions';
import useBoolean from '../../hooks/useBoolean';
import ChevronRightIcon from '../../img/chevron-right.svg';
import EnvelopeIcon from '../../img/envelope.svg';
import UpdateIndicatorIcon from '../../img/update-indicator.svg';
import CubesLoader from '../common/CubesLoader';
import {
  priorityColor,
  PriorityContainer,
  PriorityDot,
} from '../common/Priority';
import MemberPicker from '../members/MemberPicker';
import { SubtaskLoadingContainer, SubtaskOrderContainer } from './Task.styled';
import {
  AnimatedPatientsTasklistDate,
  ArchiveButton,
  CompletedBy,
  EditedTaskDescriptionLabel,
  MemberPickerContainer,
  PatientsTasklistDate,
  PatientsTasklistDescription,
  PatientsTasklistInfo,
  PatientsTaskListInnerDescription,
  PatientsTasklistNew,
  PatientsTasklistStrikeThrough,
  PatientTasklistContainer,
  PatientTasklistPatient,
  RolloverNestedListItemText,
  RolloverPopover,
  TaskBodyChevronContainer,
  TaskBodyMainContainer,
  TaskDateContainer,
  TaskDescriptionOuterContainer,
  TaskStatusContainer,
} from './TaskBody.styled';
import TaskCheckbox from './TaskCheckbox';

const animationProperties = {
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: '0.625rem', opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

const TaskBody = ({
  isSubtask,
  subtaskIndex,
  task,
  handleStatusChange,
  disabled,
  isParentComplete = task?.status === 'COMPLETE',
  storeAsCurrentTask,
  markAsUnread,
  openTaskDrawer,
  taskDrawerOpen,
  hidePatient,
  hideCheckbox,
  readOnly,
  taskTimeouts,
}) => {
  const {
    createdDateTime,
    updatedDateTime,
    dueDate,
    comments,
    subtasks,
    workflowStatus,
    read,
    updated,
    description,
    creator,
    assignedTo,
    status,
    patient,
    completedDt: completedDateTime,
    completedBy,
    isNewSubtask,
  } = task;

  const formattedCreationDate = moment(createdDateTime).format('h:mma');
  const dueDateMoment = moment(dueDate);
  const formattedDueDate = dueDateMoment.format('ddd, MMM D');
  const completedDateTimeMoment = moment(completedDateTime);
  const formattedCompletedDateTime = completedDateTimeMoment.isValid()
    ? completedDateTimeMoment.format('h:mma')
    : '';

  const dispatch = useDispatch();
  const currentUserProfile = useSelector(store => store.userState.userProfile);
  const taskDescriptionRef = useRef(null);
  const taskInnerDescriptionRef = useRef(null);
  const [isPopoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);

  const isInbox = !task?.taskList?.taskListId;

  const isTaskArchivable = isTaskArchivableMethod(currentUserProfile, task);

  const isTaskTimingOut =
    status === 'COMPLETE' &&
    Boolean(taskTimeouts?.find(({ taskId }) => taskId === task?.taskId));

  const subtasksCount = subtasks?.length ?? 0;
  const commentsCount = comments?.length ?? 0;

  const countInfoContentArray = [];

  if (subtasksCount) {
    countInfoContentArray.push(
      `${subtasksCount} subtask${subtasksCount > 1 ? 's' : ''}`,
    );
  }

  if (commentsCount) {
    countInfoContentArray.push(
      `${commentsCount} comment${commentsCount > 1 ? 's' : ''}`,
    );
  }

  let countInfoContent = countInfoContentArray.join(' | ');

  if (countInfoContent.trim().length > 0) {
    countInfoContent = ` • ${countInfoContent.trim()}`;
  }

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const completedByContent =
    formattedCompletedDateTime &&
    `Completed by ${completedByName} at ${formattedCompletedDateTime}`;

  const firstLetterName = creator?.firstName?.charAt(0);
  const formattedUserName = `${firstLetterName ? `${firstLetterName}.` : ''} ${
    creator?.lastName
  }`;

  const archiveTask = event => {
    event.preventDefault();
    event.stopPropagation();
    archiveTaskAction(task, currentUserProfile)(dispatch);
  };

  const overdue = dueDateMoment.isBefore(moment().format('YYYY-MM-DD'));

  const onTaskDescriptionMouseEnter = useCallback(() => {
    if (
      taskInnerDescriptionRef.current?.scrollWidth >
      taskDescriptionRef.current?.offsetWidth
    ) {
      setPopoverOpen();
    }
  });

  const onTaskDescriptionMouseLeave = useCallback(() => {
    unsetPopoverOpen();
  });

  return (
    <TaskBodyMainContainer
      readOnly={readOnly}
      onClick={e => {
        e.stopPropagation();
        if (!readOnly) {
          /* eslint-disable no-unused-expressions */
          openTaskDrawer?.();
          storeAsCurrentTask?.(task);
          markAsUnread?.(task, false);
          /* eslint-enable no-unused-expressions */
        }
      }}
    >
      {isSubtask && (
        <SubtaskOrderContainer>{`${subtaskIndex}.`}</SubtaskOrderContainer>
      )}
      {isNewSubtask ? (
        <SubtaskLoadingContainer>
          <CubesLoader size={30} />
        </SubtaskLoadingContainer>
      ) : (
        <>
          {!hideCheckbox && (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                width: 54,
                minWidth: 54,
              }}
            >
              <TaskCheckbox
                checked={status === 'COMPLETE'}
                onChange={handleStatusChange}
                onClick={e => {
                  e.stopPropagation();
                }}
                disabled={disabled || (isSubtask && isParentComplete)}
              />
            </div>
          )}
          <MemberPickerContainer>
            <MemberPicker
              task={task}
              member={assignedTo}
              disabled={disabled || isParentComplete || isInbox}
            />
          </MemberPickerContainer>
          <PatientTasklistContainer isSubtask={isSubtask}>
            <AnimatePresence>
              {!read && (
                <PatientsTasklistNew {...animationProperties}>
                  NEW
                </PatientsTasklistNew>
              )}
            </AnimatePresence>
            <TaskDescriptionOuterContainer>
              {task.sourceMessage && (
                <img
                  src={EnvelopeIcon}
                  alt="Email"
                  style={{
                    paddingRight: '5px',
                  }}
                />
              )}
              <PatientsTasklistDescription
                ref={taskDescriptionRef}
                onMouseEnter={onTaskDescriptionMouseEnter}
                onMouseLeave={onTaskDescriptionMouseLeave}
              >
                <Linkify
                  tagName="span"
                  options={{ target: '_blank', className: 'decorated-link' }}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <PatientsTaskListInnerDescription
                    hasDescription={Boolean(description)}
                    ref={taskInnerDescriptionRef}
                  >
                    {description || 'Unnamed task'}
                    <PatientsTasklistStrikeThrough
                      hasDescription={Boolean(description)}
                      active={status === 'COMPLETE'}
                    />
                  </PatientsTaskListInnerDescription>
                </Linkify>
                {createdDateTime !== updatedDateTime && (
                  <EditedTaskDescriptionLabel>
                    (edited)
                  </EditedTaskDescriptionLabel>
                )}
              </PatientsTasklistDescription>
            </TaskDescriptionOuterContainer>
            <div>
              <PatientsTasklistInfo>
                {updated && (
                  <img
                    src={UpdateIndicatorIcon}
                    alt="Updated"
                    style={{
                      width: '17px',
                      height: '17px',
                      paddingRight: '2px',
                    }}
                  />
                )}
                {`Assigned by ${formattedUserName} at ${formattedCreationDate}${countInfoContent}`}
              </PatientsTasklistInfo>
            </div>
            <div>
              <CompletedBy
                isCompleted={status === 'COMPLETE' && completedByContent}
              >
                <span>{completedByContent}</span>
              </CompletedBy>
            </div>
          </PatientTasklistContainer>
          {!taskDrawerOpen && !hidePatient && (
            <PatientTasklistPatient>
              {patient && !isSubtask && (
                <Link
                  to={`/patient/${patient.patientId}`}
                  style={{ color: '#0ca1c7', fontSize: '0.875rem' }}
                >
                  <div>
                    {`${patient?.lastName}, ${
                      patient?.firstName
                    } ${patient?.mrn ?? ''}`.trim()}
                  </div>
                </Link>
              )}
            </PatientTasklistPatient>
          )}
          {!taskDrawerOpen && (
            <TaskDateContainer isTaskArchivable={isTaskArchivable}>
              {dueDate && !isTaskTimingOut && (
                <PatientsTasklistDate overdue={overdue}>
                  {formattedDueDate}
                </PatientsTasklistDate>
              )}
              {isTaskTimingOut && (
                <AnimatedPatientsTasklistDate>
                  Nice work!
                </AnimatedPatientsTasklistDate>
              )}
            </TaskDateContainer>
          )}
          {!taskDrawerOpen && (
            <>
              <TaskStatusContainer isTaskArchivable={isTaskArchivable}>
                <PriorityContainer archivable={isTaskArchivable}>
                  {isTaskArchivable ? (
                    <ArchiveButton onClick={archiveTask}>Archive</ArchiveButton>
                  ) : (
                    status !== 'COMPLETE' && (
                      <PriorityDot color={priorityColor(workflowStatus)} />
                    )
                  )}
                </PriorityContainer>
              </TaskStatusContainer>
              {!readOnly && (
                <TaskBodyChevronContainer isSubtask={isSubtask}>
                  <img
                    style={{
                      height: '10px',
                    }}
                    src={ChevronRightIcon}
                    alt="Chevron icon"
                  />
                </TaskBodyChevronContainer>
              )}
            </>
          )}
        </>
      )}
      <RolloverPopover
        anchorEl={taskDescriptionRef.current}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        open={isPopoverOpen && !taskDrawerOpen}
        onClose={unsetPopoverOpen}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <RolloverNestedListItemText>
          {description ?? 'Unnamed task'}
          {createdDateTime !== updatedDateTime && ' (edited)'}
        </RolloverNestedListItemText>
      </RolloverPopover>
    </TaskBodyMainContainer>
  );
};

export default TaskBody;
