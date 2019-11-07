import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';

import ChevronRightIcon from '../../img/chevron-right.svg';
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
  CompletedBy,
  MemberPickerContainer,
  PatientsTasklistDate,
  PatientsTasklistDescription,
  PatientsTasklistInfo,
  PatientsTasklistNew,
  PatientsTasklistStrikeThrough,
  PatientTasklistContainer,
  PatientTasklistPatient,
} from './TaskBody.styled';
import TaskCheckbox from './TaskCheckbox';

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
}) => {
  const {
    createdDateTime,
    dueDate,
    comments,
    subtasks,
    workflowStatus,
    read,
    updated,
    description,
    creator,
    assignedTo,
    taskList,
    taskId,
    status,
    patient,
    completedDt: completedDateTime,
    completedBy,
    isNewSubtask,
  } = task;

  const formattedCreationDate = moment(createdDateTime).format(
    'MMM D, YYYY @ h:mma',
  );
  const formattedDueDate = moment(dueDate).format('ddd, MMM D');
  const formattedDueTime = moment(dueDate).format('@ h:mma');
  const completedDateTimeMoment = moment(completedDateTime);
  const formattedCompletedDateTime = completedDateTimeMoment.isValid()
    ? completedDateTimeMoment.format('MMM D, YYYY @ h:mma')
    : '';

  const isInbox = !task?.taskList?.taskListId;

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

  const completedByContent =
    formattedCompletedDateTime &&
    `Completed by ${completedBy?.userName} at ${formattedCompletedDateTime}`;

  const elementPaddingBottom = `${isSubtask ? 12 : 16}px`;

  return (
    <div
      style={{ height: '100%', cursor: 'pointer', display: 'flex' }}
      onClick={e => {
        e.stopPropagation();
        openTaskDrawer();
        /* eslint-disable no-unused-expressions */
        storeAsCurrentTask?.(task);
        markAsUnread?.(task, false);
        /* eslint-enable no-unused-expressions */
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
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              width: 60,
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
          <MemberPickerContainer>
            <MemberPicker
              task={task}
              member={assignedTo}
              disabled={disabled || isParentComplete || isInbox}
            />
          </MemberPickerContainer>

          <Grid container alignItems="flex-end" wrap="nowrap" direction="row">
            <PatientTasklistContainer
              item
              container
              alignItems="center"
              xs={12}
            >
              <Grid item xs={12}>
                {storeAsCurrentTask ? (
                  <PatientsTasklistDescription>
                    {description || (
                      <div style={{ color: '#ababb2' }}>Unnamed task</div>
                    )}
                    <PatientsTasklistStrikeThrough
                      hasDescription={Boolean(description)}
                      active={status === 'COMPLETE'}
                    />
                  </PatientsTasklistDescription>
                ) : (
                  <Link
                    to={{
                      pathname: `/tasks/${taskList.listName}${
                        taskList.taskListId ? `/${taskList.taskListId}` : ''
                      }`,
                      state: { taskId },
                    }}
                  >
                    <PatientsTasklistDescription
                      isComplete={status === 'COMPLETE'}
                    >
                      {description || (
                        <div style={{ color: '#ababb2' }}>Unnamed task</div>
                      )}
                    </PatientsTasklistDescription>
                  </Link>
                )}
              </Grid>
              <Grid item xs={12}>
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
                  {`Assigned by ${
                    creator.userName
                  } at ${formattedCreationDate}${countInfoContent}`}
                </PatientsTasklistInfo>
              </Grid>
              <Grid item xs={12}>
                <CompletedBy
                  isCompleted={status === 'COMPLETE' && completedByContent}
                >
                  <span>{completedByContent}</span>
                </CompletedBy>
              </Grid>
              {!read && <PatientsTasklistNew>NEW</PatientsTasklistNew>}
            </PatientTasklistContainer>
            {!isSubtask && (
              <PatientTasklistPatient
                elementPaddingBottom={elementPaddingBottom}
              >
                {patient && (
                  <Link
                    to={`/patient/${patient.patientId}`}
                    style={{ color: '#0ca1c7', fontSize: '0.875rem' }}
                  >
                    <div>
                      {`${patient?.lastName}, ${patient?.firstName} ${
                        patient?.mrn
                      }`}
                    </div>
                  </Link>
                )}
              </PatientTasklistPatient>
            )}
            {!taskDrawerOpen && (
              <div
                style={{
                  alignItems: 'flex-end',
                  display: 'flex',
                  lineHeight: '12px',
                  marginRight: '24px',
                  paddingBottom: elementPaddingBottom,
                  minWidth: '140px',
                  width: '140px',
                }}
              >
                {dueDate && (
                  <PatientsTasklistDate isSubtask={isSubtask}>
                    {`${formattedDueDate} ${formattedDueTime}`}
                  </PatientsTasklistDate>
                )}
              </div>
            )}
            {!taskDrawerOpen && (
              <>
                <div
                  style={{
                    paddingBottom: elementPaddingBottom,
                    minWidth: '90px',
                    width: '90px',
                  }}
                >
                  <PriorityContainer>
                    <PriorityDot color={priorityColor(workflowStatus)} />
                  </PriorityContainer>
                </div>
                <div
                  style={{
                    alignItems: 'flex-end',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginRight: isSubtask ? '18px' : '24px',
                    minWidth: '120px',
                    width: '120px',
                    paddingBottom: elementPaddingBottom,
                  }}
                >
                  <img
                    style={{
                      height: '10px',
                    }}
                    src={ChevronRightIcon}
                    alt="Chevron icon"
                  />
                </div>
              </>
            )}
          </Grid>
        </>
      )}
    </div>
  );
};

export default TaskBody;
