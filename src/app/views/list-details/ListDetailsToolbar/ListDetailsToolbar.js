import React, { useCallback, useState } from 'react';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import { Box } from '@material-ui/core';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import CompleteTasksVisibilitySwitch from 'components/tasklist/CompleteTasksVisibilitySwitch/CompleteTasksVisibilitySwitch';
import InboxTips from 'components/tasklist/InboxTips/InboxTips';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { ToolbarContainer } from './styled';
import TaskCustomFieldsModal from '../../../modal/customModals/TaskCustomFieldsModal';

const ListDetailsToolbar = ({
  onSelectTab,
  selectedTab,
  onColumnSetupChange,
  additionalOptions,
}) => {
  const { search } = useLocation();
  const history = useHistory();
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;

  const handleChangeViewType = useCallback(
    event => {
      const queryParameters = new URLSearchParams(search);
      const value = event?.target.value ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  // TODO: change for visibility state
  const [visible, setVisible] = useState(false);

  return (
    <ToolbarContainer>
      <Box>{taskList?.listType === 'INBOX' && <InboxTips />}</Box>
      <Box display="flex" flex={1} justifyContent="flex-end">
        <CompleteTasksVisibilitySwitch
          visible={visible}
          onChange={setVisible}
        />
        <Box mx={0.5} />
        <CustomizeToolbarButton
          onChange={onColumnSetupChange}
          openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
          additionalOptions={additionalOptions}
        />
        <Box mx={0.5} />
        <TaskViewTypeToolbarSelect
          value={getViewTypeFromQueryString(search)}
          onChange={handleChangeViewType}
        />
        <Box mx={0.5} />
        <TaskStatusToolbarSelect
          value={selectedTab}
          onChange={event => onSelectTab(event.target.value)}
        />
        <Box mx={0.5} />
        <TaskCustomFieldsModal
          opened={customFieldsModalOpened}
          handleClose={() => setCustomFieldsModalOpened(false)}
          taskListIdentifier={taskList?.taskListIdentifier}
          isOrganizationAdmin={isOrganizationAdmin}
          isListCreator={isListCreator}
        />
      </Box>
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
