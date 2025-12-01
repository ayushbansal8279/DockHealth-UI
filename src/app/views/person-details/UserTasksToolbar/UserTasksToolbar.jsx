import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { Box } from '@mui/material';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { TaskOrigin } from 'helpers/task-helpers';
import TaskCustomFieldsModal from 'modal/customModals/TaskCustomFieldsModal';
import CustomizeToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/CustomizeToolbarButton/CustomizeToolbarButton';
import TaskStatusToolbarSelect from '@/app/components/tasklist/list-toolbar-buttons/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
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
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;

  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const handleSelectTab = useCallback(
    (tab) => {
      let route = `/core/assignedToPerson/${userIdentifier}`;
      if (tab === 'COMPLETE') {
        route += `/${TaskListTabName.COMPLETE}`;
      } else if (tab === '') {
        route += `/${TaskListTabName.ALL}`;
      }

      history.push(route);
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
          value={tasksStatus === 'ALL' ? '' : tasksStatus}
          onChange={(status) => handleSelectTab(status)}
          iconColorFilterActive={iconColorActiveItem?.value}
          taskListIdentifier={userIdentifier}
          origin={TaskOrigin.PERSON}
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
        <HeaderSearch
          value={searchValue}
          onChange={handleSearchValueChange}
          needEnterToSearch
        />
      </Box>
    </ToolbarContainer>
  );
};

export default UserTasksToolbar;
