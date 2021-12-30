import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import { Box } from '@material-ui/core';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { userProfileSelector } from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { ToolbarContainer } from './styled';
import TaskCustomFieldsModal from '../../../modal/customModals/TaskCustomFieldsModal';

const UserTasksToolbar = () => {
  const history = useHistory();
  const userIdentifier = useSelector(userIdentifierSelector);
  const tasksStatus = useSelector(currentTasksStatusSelector);
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;

  const handleSelectTab = useCallback(
    tab => {
      history.push(
        `/core/assignedToPerson/${userIdentifier}${
          tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, userIdentifier],
  );

  return (
    <ToolbarContainer>
      <Box display="flex" flex={1} justifyContent="flex-end">
        <CustomizeToolbarButton
          openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
        />
        <Box mx={0.5} />
        <Box mx={0.5} />
        <TaskStatusToolbarSelect
          value={tasksStatus}
          onChange={event => handleSelectTab(event.target.value)}
        />
        <Box mx={0.5} />
        <TaskCustomFieldsModal
          opened={customFieldsModalOpened}
          handleClose={() => setCustomFieldsModalOpened(false)}
          isOrganizationAdmin={isOrganizationAdmin}
          isListCreator={isListCreator}
        />
      </Box>
    </ToolbarContainer>
  );
};

export default UserTasksToolbar;
