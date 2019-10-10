import styled from 'styled-components';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { ButtonBase } from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Priority from '../home/Priority';
import BellIcon from '../../img/bell.svg';
import MemberPicker from '../home/MemberPicker';
import TaskCheckbox, { Confirmation, useConfirmation } from '../TaskCheckbox';
import Flag from '../home/Flag';
import AddSubtask from '../home/AddSubtask';

const PatientsTasklistTask = styled.div`
  border-radius: 3px;
  border: solid 1px #a6dcea;
  background-color: ${({ isSelected, isCollapsed }) => (isSelected ? '#ddf2f7' : isCollapsed ? '#fff' : '#E6ECF0')};
  margin-left: -20px;
  margin-right: -23px;
  margin-bottom: 4px;
`;

const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
  
`;

const PatientsTasklistDescription = styled.div`
  font-size: 16px;
  color: #303538;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ isComplete }) => isComplete && 'text-decoration: line-through;'}
`;

const PatientsTasklistInfo = styled.div`
  font-size: 12px;
  color: #5e6366;
`;

const PatientsTasklistComments = styled.div`
  font-size: 12px;
  color: #0ca1c7;
`;

const PatientsTasklistDate = styled.div`
  font-size: 16px;
  color: #303538;
`;

const PatientsTasklistSubtasks = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    height: 44px;
    border-radius: 1px;
    border: solid 3px ${({ isCollapsed }) => (isCollapsed ? '#f5f8fa' : 'transparent')};
  
    font-size: 16px;
    line-height: 38px;
    color: #2e3a43;
    padding-left: 15px;
  }
`;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const PatientsTaskBody = ({
  isSubtask, task, handleStatusChange, hideDate, hidePriority, hidePatient, disabled, isParentComplete = task?.status === 'COMPLETE', hideCheckbox, storeAsCurrentTask,
}) => {
  const {
    createdDateTime, dueDate, comments, workflowStatus, read, description, reminderDt, creator, assignedTo, taskList, taskId, status, patient,
  } = task;

  const formattedCreationDate = moment(createdDateTime)
    .format('h:mma');
  const formattedDueDate = moment(dueDate)
    .format('ddd, MMM D');
  const formattedDueTime = moment(dueDate)
    .format('@ h:mma');

  const isInbox = !(task?.taskList?.taskListId);

  return (
    <div style={{ display: 'flex' }}>
      {!hideCheckbox && (
        <div style={{
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
      <div style={{
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
      <div style={{
        flex: 1,
        width: 0,
      }}
      >
        <div style={{
          height: '22px',
          marginBottom: '-7px',
          display: 'flex',
          alignItems: 'center',
        }}
        >
          {!read && <PatientsTasklistNew>NEW</PatientsTasklistNew>}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        >
          <div style={{
            minWidth: 0,
            flexGrow: 1,
            paddingRight: '24px',
          }}
          >
            {storeAsCurrentTask
              ? (
                <PatientsTasklistDescription isComplete={status === 'COMPLETE'} onClick={() => { storeAsCurrentTask(task); }}>
                  {description || <div style={{ color: '#ababb2' }}>Unnamed task</div>}
                </PatientsTasklistDescription>
              )
              : (
                <Link to={{
                  pathname: `/tasks/${taskList.listName}${taskList.taskListId ? `/${taskList.taskListId}` : ''}`,
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
            <PatientsTasklistComments>{`${comments.length} comments`}</PatientsTasklistComments>
          </div>
          {!isSubtask && !hidePatient && (
            <div style={{
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
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: '24px',
              flexShrink: 0,
            }}
            >
              <div style={{
                width: '20px',
                marginTop: '3px',
              }}
              >
                {reminderDt && <img src={BellIcon} alt="Collapse Details" />}
              </div>
              <div style={{ width: '100px' }}>
                {dueDate && (<>
                  <PatientsTasklistDate isSubtask={isSubtask}>
                    {formattedDueDate}
                  </PatientsTasklistDate>
                  <PatientsTasklistDate isSubtask={isSubtask}>
                    {formattedDueTime}
                  </PatientsTasklistDate>
                </>)}
              </div>
            </div>
          )}
          {!hidePriority && <Priority priority={workflowStatus} style={{ margin: '8px 23px 0 0 ' }} />}
        </div>
      </div>
    </div>
  );
};

export const PatientsTask = (props) => {
  const {
    style,
    task,
    isSubtask,
    markComplete,
    hideDate,
    hidePriority,
    selectedTaskId,
    hidePatient,
    disabled,
    hideCheckbox,
    storeAsCurrentTask,
  } = props;
  const {
    subtasks, priority, taskList,
  } = task;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleIsCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [setIsCollapsed, isCollapsed]);

  const previousSelectedTaskId = usePrevious(selectedTaskId);

  useEffect(() => {
    if (isSubtask) {
      return;
    }

    if (selectedTaskId !== previousSelectedTaskId
      && isCollapsed
      && subtasks.find(subtask => subtask.taskId == selectedTaskId)) {
      setIsCollapsed(false);
    }
  }, [isCollapsed, isSubtask, previousSelectedTaskId, selectedTaskId, subtasks]);

  // Check all subtasks confirmation dialog
  const {
    isOpen, close, handleStatusChange, confirm,
  } = useConfirmation(task, markComplete);

  return (
    <PatientsTasklistTask
      style={style}
      isCollapsed={isCollapsed}
      isSelected={selectedTaskId === task.taskId}
    >
      {!isSubtask && (<Confirmation isOpen={isOpen} close={close} confirm={confirm} />)}
      <div style={{ display: 'flex' }}>
        <Flag priority={priority} />
        <div style={{ flex: 1 }}>
          <PatientsTaskBody {...props} handleStatusChange={handleStatusChange} />
          {!isSubtask && subtasks.length > 0 && (
            <div style={{
              padding: '0 22px',
              margin: '6px auto 12px auto',
            }}
            >
              <PatientsTasklistSubtasks onClick={toggleIsCollapsed} isCollapsed={isCollapsed}>
                {`Subtasks (${subtasks.length}) ${isCollapsed ? '▸' : '▾'}`}
                <div
                  style={{ marginLeft: 'auto' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {!disabled && task.status !== 'COMPLETE' && !isCollapsed
                  && <AddSubtask taskId={task.taskId} disabled={task.status === 'COMPLETE'} />}
                </div>
              </PatientsTasklistSubtasks>
              {!isCollapsed && (
                <div>
                  {subtasks.map(subtask => (
                    <PatientsTask
                      task={{
                        ...subtask,
                        taskList,
                      }}
                      isSubtask
                      isParentComplete={task.status === 'COMPLETE'}
                      selectedTaskId={selectedTaskId}
                      markComplete={markComplete}
                      style={{
                        marginLeft: '14px',
                        marginRight: '4px',
                        border: 'none',
                      }}
                      hideDate={hideDate}
                      hidePriority={hidePriority}
                      hideCheckbox={hideCheckbox}
                      disabled={disabled}
                      storeAsCurrentTask={storeAsCurrentTask}
                    />
                  ))}
                </div>)}
            </div>
          )}
        </div>
      </div>
    </PatientsTasklistTask>
  );
};

export default PatientsTask;
