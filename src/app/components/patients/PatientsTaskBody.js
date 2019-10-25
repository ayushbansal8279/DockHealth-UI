import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';

import BellIcon from '../../img/bell.svg';
import Priority from '../common/Priority';
import MemberPicker from '../members/MemberPicker';
import TaskCheckbox from '../task/TaskCheckbox';
import {
  PatientsTasklistDate,
  PatientsTasklistDescription,
  PatientsTasklistInfo,
  PatientsTasklistNew,
  PatientsTasklistStrikeThrough,
  PatientTasklistContainer,
  CompletedBy,
} from './PatientsTasksBody.styled';

const PatientsTaskBody = ({
  isSubtask,
  task,
  handleStatusChange,
  hideDate,
  hidePriority,
  hidePatient,
  disabled,
  isParentComplete = task?.status === 'COMPLETE',
  hideCheckbox,
  storeAsCurrentTask,
}) => {
  const {
    createdDateTime,
    dueDate,
    comments,
    subtasks,
    workflowStatus,
    read,
    description,
    reminderDt,
    creator,
    assignedTo,
    taskList,
    taskId,
    status,
    patient,
    completedDt: completedDateTime,
    completedBy,
  } = task;

  const formattedCreationDate = moment(createdDateTime).format('h:mma');
  const formattedDueDate = moment(dueDate).format('ddd, MMM D');
  const formattedDueTime = moment(dueDate).format('@ h:mma');
  const completedDateTimeMoment = moment(completedDateTime);
  const formattedCompletedDateTime = completedDateTimeMoment.isValid()
    ? completedDateTimeMoment.format('h:mma')
    : '';

  const isInbox = !task?.taskList?.taskListId;

  const subtaskCount = subtasks?.length ?? 0;
  const commentsCount = comments?.length ?? 0;

  const countInfoContentArray = [];

  if (subtaskCount) {
    countInfoContentArray.push(`${subtaskCount} subtasks`);
  }

  if (commentsCount) {
    countInfoContentArray.push(`${commentsCount} comments`);
  }

  let countInfoContent = countInfoContentArray.join(' | ');

  if (countInfoContent.trim().length > 0) {
    countInfoContent = ` • ${countInfoContent.trim()}`;
  }

  const completedByContent =
    formattedCompletedDateTime &&
    `Completed by ${completedBy?.userName} at ${formattedCompletedDateTime}`;

  return (
    <div
      style={{ cursor: 'pointer', display: 'flex' }}
      onClick={e => {
        e.stopPropagation();
        // eslint-disable-next-line no-unused-expressions
        storeAsCurrentTask?.(task);
      }}
    >
      {!hideCheckbox && (
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
      )}
      <div
        style={{
          margin: '14px 8px',
          display: 'flex',
          justifyContent: 'center',
          width: '67px',
        }}
      >
        <MemberPicker
          task={task}
          member={assignedTo}
          disabled={disabled || isParentComplete || isInbox}
        />
      </div>

      <Grid container alignItems="center">
        <Grid item container xs={12} justifyContent="space-between">
          <PatientTasklistContainer>
            {storeAsCurrentTask ? (
              <PatientsTasklistDescription>
                {description || (
                  <div style={{ color: '#ababb2' }}>Unnamed task</div>
                )}
                <PatientsTasklistStrikeThrough active={status === 'COMPLETE'} />
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
                <PatientsTasklistDescription isComplete={status === 'COMPLETE'}>
                  {description || (
                    <div style={{ color: '#ababb2' }}>Unnamed task</div>
                  )}
                </PatientsTasklistDescription>
              </Link>
            )}
            <PatientsTasklistInfo>
              {`Assigned by ${
                creator.userName
              } at ${formattedCreationDate}${countInfoContent}`}
            </PatientsTasklistInfo>
            <CompletedBy
              isCompleted={status === 'COMPLETE' && completedByContent}
            >
              <span>{completedByContent}</span>
            </CompletedBy>
            {!read && <PatientsTasklistNew>NEW</PatientsTasklistNew>}
          </PatientTasklistContainer>
          {!isSubtask && !hidePatient && (
            <div
              style={{
                width: '120px',
                marginRight: '24px',
                flexShrink: 0,
              }}
            >
              {patient && (
                <Link
                  to={`/patient/${patient.patientId}`}
                  style={{ color: '#0ca1c7' }}
                >
                  <div>{`${patient?.lastName}, ${patient?.firstName}`}</div>
                  <div>{patient?.mrn}</div>
                </Link>
              )}
            </div>
          )}
          {!hideDate && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '24px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '20px',
                  marginTop: '3px',
                }}
              >
                {reminderDt && <img src={BellIcon} alt="Collapse Details" />}
              </div>
              <div style={{ width: '100px' }}>
                {dueDate && (
                  <>
                    <PatientsTasklistDate isSubtask={isSubtask}>
                      {formattedDueDate}
                    </PatientsTasklistDate>
                    <PatientsTasklistDate isSubtask={isSubtask}>
                      {formattedDueTime}
                    </PatientsTasklistDate>
                  </>
                )}
              </div>
            </div>
          )}
          {!hidePriority && (
            <Priority
              priority={workflowStatus}
              style={{ margin: '8px 23px 0 0' }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default PatientsTaskBody;
