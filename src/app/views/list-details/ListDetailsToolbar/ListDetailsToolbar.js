import React, { useCallback } from 'react';
import TaskViewTypeToolbarSelect from 'components/tasklist/TaskViewTypeToolbarSelect/TaskViewTypeToolbarSelect';
import TaskStatusToolbarSelect from 'components/tasklist/TaskStatusToolbarSelect/TaskStatusToolbarSelect';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import { useLocation, useHistory } from 'react-router-dom';
import CustomizeToolbarButton from 'components/tasklist/CustomizeToolbarButton/CustomizeToolbarButton';
import { ToolbarContainer } from './styled';

const ListDetailsToolbar = ({ onSelectTab, selectedTab }) => {
  const { search } = useLocation();
  const history = useHistory();

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
      <CustomizeToolbarButton />
      <TaskViewTypeToolbarSelect
        value={getViewTypeFromQueryString(search)}
        onChange={handleChangeViewType}
      />
      <TaskStatusToolbarSelect
        value={selectedTab}
        onChange={event => onSelectTab(event.target.value)}
      />
    </ToolbarContainer>
  );
};

export default ListDetailsToolbar;
