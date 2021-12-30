import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import { ToolbarContainer } from './styled';

const UserTasksToolbar = () => {
  const userIdentifier = useSelector(userIdentifierSelector);
  const tasksStatus = useSelector(currentTasksStatusSelector);
  const history = useHistory();

  const handleSelectTab = tab => {
    history.push(
      `/core/assignedToPerson/${userIdentifier}${
        tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  return (
    <ToolbarContainer>
      <TaskStatusToolbarSelect
        value={tasksStatus}
        onChange={event => handleSelectTab(event.target.value)}
      />
    </ToolbarContainer>
  );
};

export default UserTasksToolbar;
