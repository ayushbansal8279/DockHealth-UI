import moment from 'moment';
import React from 'react';
import { Link } from 'react-router';

import BellIcon from '../../img/bell.svg';
import MemberPicker from '../home/MemberPicker';
import Priority from '../home/Priority';
import TaskCheckbox from '../TaskCheckbox';
import {
  PatientsTasklistComments,
  PatientsTasklistDate,
  PatientsTasklistDescription,
  PatientsTasklistInfo,
  PatientsTasklistNew,
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
  } = task;

  const formattedCreationDate = moment(createdDateTime).format('h:mma');
  const formattedDueDate = moment(dueDate).format('ddd, MMM D');
  const formattedDueTime = moment(dueDate).format('@ h:mma');

  const isInbox = !task?.taskList?.taskListId;

  return (
    <div
      style={{ cursor: 'pointer', display: 'flex' }}
      onClick={() => {
        // eslint-disable-next-line no-unused-expressions
        storeAsCurrentTask?.(task);
      }}
    >
      {!hideCheckbox && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TaskCheckbox
            checked={status === 'COMPLETE'}
            onChange={handleStatusChange}
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
      <div
        style={{
          flex: 1,
          width: 0,
        }}
      >
        <div
          style={{
            height: '22px',
            marginBottom: '-7px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!read && <PatientsTasklistNew>NEW</PatientsTasklistNew>}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              minWidth: 0,
              flexGrow: 1,
              paddingRight: '24px',
            }}
          >
            {storeAsCurrentTask ? (
              <PatientsTasklistDescription isComplete={status === 'COMPLETE'}>
                {description || <div style={{ color: '#ababb2' }}>Unnamed task</div>}
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
                  {description || <div style={{ color: '#ababb2' }}>Unnamed task</div>}
                </PatientsTasklistDescription>
              </Link>
            )}
            <PatientsTasklistInfo>
              {`Assigned by ${creator.userName} • ${formattedCreationDate}`}
            </PatientsTasklistInfo>
            {comments.length > 0 && (
              <PatientsTasklistComments>{`${comments.length} comments`}</PatientsTasklistComments>
            )}
          </div>
          {!isSubtask && !hidePatient && (
            <div
              style={{
                width: '120px',
                marginRight: '24px',
                flexShrink: 0,
              }}
            >
              {patient && (
                <Link to={`/patient/${patient.patientId}`} style={{ color: '#0ca1c7' }}>
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
            <Priority priority={workflowStatus} style={{ margin: '8px 23px 0 0 ' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsTaskBody;
