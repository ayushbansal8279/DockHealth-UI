import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import BellIcon from '../../img/bell.svg';
import Priority from '../home/Priority';
import MemberAssignment from '../home/MemberAssignment';

const PatientsTasklistCount = styled.div`
  font-size: 16px;
  color: #2e3a43;
  margin-bottom: 11px;
`;

const PatientsTasklistTask = styled.div`
  border-radius: 3px;
  border: solid 1px #a6dcea;
  background-color: #ffffff;
  
  margin-left: -20px;
  margin-right: -23px;
  margin-bottom: 4px;
`;

const PatientsTasklistFlag = styled.div`
  width: 5px;
  background-color: #fb7c06;
  flex-shrink: 0;
`;

const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
  
`;

const PatientsTasklistDescription = styled.div`
  font-size: 20px;
  color: #303538;
`;

const PatientsTasklistInfo = styled.div`
  font-size: 14px;
  color: #5e6366;
`;

const PatientsTasklistComments = styled.div`
  font-size: 14px;
  color: #0ca1c7;
`;

const PatientsTasklistDate = styled.div`
  font-size: ${({ isSubtask }) => (isSubtask ? '18px' : '20px')};
  color: #303538;
`;

const PatientsTasklistSubtasks = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: flex-start;
    width: 560px;
    height: 44px;
    border-radius: 1px;
    border: solid 3px #f5f8fa;
    ${({ isCollapsed }) => !isCollapsed && 'border-color: transparent;'}
  
    font-size: 20px;
    line-height: 38px;
    color: #2e3a43;
    margin: 18px auto 12px auto;
    padding-left: 15px;
  }
`;

const PatientsTasklistShowCompleted = styled(ButtonBase)`
  && {
    display: block;
    width: 344px;
    height: 37px;
    border-radius: 57.4px;
    background-color: #0ca1c7;

    font-size: 20px;
    color: #ffffff;

    text-align: center;
    margin: 36px auto 0 auto;
    line-height: 36px;
  }
`;

const PatientsTaskBody = ({
  isSubtask, createdDateTime, dueDate, comments, priority, read, description, reminderDt, creator, assignedTo,
}) => {
  const formattedCreationDate = moment(createdDateTime).format('h:ma');
  const formattedDueDate = moment(dueDate).format('ddd, MMM D');
  const formattedDueTime = moment(dueDate).format('@ h:ma');

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '14px 8px 0 8px', width: '67px', height: '67px' }}>
        <MemberAssignment member={assignedTo} disabled large />
      </div>
      <div style={{ flex: 1 }}>
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
          <div>
            <PatientsTasklistDescription>
              {description || <div style={{ color: '#ababb2' }}>Unnamed task</div>}
            </PatientsTasklistDescription>
            <PatientsTasklistInfo>
              {`Assigned by ${creator.userName} • ${formattedCreationDate}`}
            </PatientsTasklistInfo>
            <PatientsTasklistComments>{`${comments.length} comments`}</PatientsTasklistComments>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '20px', marginTop: '3px' }}>
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
          <Priority priority={priority} style={{ margin: '0 23px 0 0 ' }} />
        </div>
      </div>
    </div>
  );
};

const PatientsTask = (props) => {
  const {
    subtasks, isSubtask, style, priority,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleIsCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [setIsCollapsed, isCollapsed]);

  return (
    <PatientsTasklistTask style={style}>
      <div style={{ display: 'flex' }}>
        {priority !== 'LOW' && <PatientsTasklistFlag />}
        <div style={{ flex: 1 }}>
          <PatientsTaskBody {...props} />
          {!isSubtask && subtasks.length > 0 && (
            <>
              <PatientsTasklistSubtasks onClick={toggleIsCollapsed} isCollapsed={isCollapsed}>
                {`Subtasks (${subtasks.length}) ${isCollapsed ? '▸' : '▾'}`}
              </PatientsTasklistSubtasks>
              {!isCollapsed && (
                <div>
                  {subtasks.map(subtask => <PatientsTask {...subtask} isSubtask style={{ marginLeft: '14px', marginRight: 0, borderColor: 'transparent' }} />)}
                </div>)}
            </>
          )}
        </div>
      </div>
    </PatientsTasklistTask>
  );
};

const PatientsTasklist = ({ tasks, completedTasks }) => {
  const [isShowingCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = useCallback(() => {
    setShowCompleted(!isShowingCompleted);
  }, [isShowingCompleted]);

  return (
    <div>
      <PatientsTasklistCount>{`${tasks.length} tasks`}</PatientsTasklistCount>
      {tasks.map(task => <PatientsTask {...task} key={task.taskId} />)}
      {completedTasks.length > 0 && (
        <PatientsTasklistShowCompleted onClick={toggleShowCompleted}>
          {`${isShowingCompleted ? 'Hide' : 'Show'} completed tasks (${completedTasks.length})`}
        </PatientsTasklistShowCompleted>)}
      {isShowingCompleted && (
        <div style={{ marginTop: '22px' }}>
          {completedTasks.map(task => <PatientsTask {...task} key={task.taskId} />)}
        </div>)}
    </div>
  );
};

export default PatientsTasklist;
