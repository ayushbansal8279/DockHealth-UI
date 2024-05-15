import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { Box } from '@mui/material';
import { userProfileSelector } from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import TaskCustomFieldsModal from 'modal/customModals/TaskCustomFieldsModal';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect';
import { ToolbarContainer } from './styled';
import UserDetailsFilters from '../UserDetailsFilters/UserDetailsFilters';
import { onSearchChanged } from '@/app/helpers/ga-event-helper';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';

const UserTasksToolbar = ({ searchValue, setSearchValue }) => {
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
    (tab) => {
      history.push(
        `/core/assignedToPerson/${userIdentifier}${
          tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, userIdentifier],
  );

  const handleSearchValueChange = (newValue) => {
    setSearchValue(newValue);
    onSearchChanged();
  };

  return (
    <ToolbarContainer>
      <Box display="flex" flex={1}>
        <CustomizeToolbarButton
          openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
          showCustomColumnCreate={false}
        />
        <Box mx={0.5} />
        <TaskStatusToolbarSelect
          value={tasksStatus}
          onChange={(event) => handleSelectTab(event.target.value)}
        />
        <Box mx={0.5} />
        <TaskCustomFieldsModal
          opened={customFieldsModalOpened}
          handleClose={() => setCustomFieldsModalOpened(false)}
          isOrganizationAdmin={isOrganizationAdmin}
          isListCreator={isListCreator}
        />
        <UserDetailsFilters />
        <Box mx={0.5} />
        <HeaderSearch value={searchValue} onChange={handleSearchValueChange} />
      </Box>
    </ToolbarContainer>
  );
};

export default UserTasksToolbar;
