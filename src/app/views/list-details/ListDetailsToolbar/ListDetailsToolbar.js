import React, { useCallback, useState } from 'react';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
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
}) => {
  const { search } = useLocation();
  const history = useHistory();
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const taskList = useSelector(currentTaskListSelector);
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;

  console.log('taskList', taskList);

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

  return (
    <ToolbarContainer>
      {taskList?.listType === 'INBOX' && <InboxTips />}
      <CustomizeToolbarButton
        onChange={onColumnSetupChange}
        openCustomFieldModal={() => setCustomFieldsModalOpened(true)}
      />
      <TaskViewTypeToolbarSelect
        value={getViewTypeFromQueryString(search)}
        onChange={handleChangeViewType}
      />
      <TaskStatusToolbarSelect
        value={selectedTab}
        onChange={event => onSelectTab(event.target.value)}
      />
      <TaskCustomFieldsModal
        opened={customFieldsModalOpened}
        handleClose={() => setCustomFieldsModalOpened(false)}
        taskListIdentifier={taskList?.taskListIdentifier}
        isOrganizationAdmin={isOrganizationAdmin}
        isListCreator={isListCreator}
      />
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
