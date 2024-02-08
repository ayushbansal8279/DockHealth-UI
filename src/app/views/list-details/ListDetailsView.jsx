import React, { useEffect, createContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TaskStatus } from 'helpers/task-helpers';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import {
  clearTaskListState,
  initializeTaskListState,
} from 'actions/task-list-actions';
import { ViewType, getViewTypeFromQueryString } from 'helpers/view-type-helper';
import ListDetailsTableView from './ListDetailsTableView/ListDetailsTableView';
import ListDetailsCalendarView from './ListDetailsCalendarView/ListDetailsCalendarView';
import ListDetailsBoardView from './ListDetailsBoardView/ListDetailsBoardView';

export const ListPageContext = createContext();
const ListDetailsView = () => {
  const parameters = useParams();
  const { taskListIdentifier: taskListIdentifierParameter, tabName } =
    parameters;
  const { search } = useLocation();
  const viewType = getViewTypeFromQueryString(search);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initializeTaskListState(
        taskListIdentifierParameter,
        tabName?.toUpperCase() || TaskStatus.INCOMPLETE,
      ),
    );
  }, [dispatch, taskListIdentifierParameter, tabName]);

  useEffect(() => {
    return () => {
      dispatch(clearTaskListState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addNewGroup, setAddNewGroup] = useState(false);
  const [changeViewType, setChangeViewType] = useState('SLIM_VIEW');

  const handleAddNewGroup = (value) => {
    setAddNewGroup(value);
  };

  const handleSetChangeViewType = (value) => {
    setChangeViewType(value);
  };

  const ListPageContextValue = {
    addNewGroup: addNewGroup,
    handleAddNewGroup: handleAddNewGroup,
    changeViewType: changeViewType,
    handleSetChangeViewType: handleSetChangeViewType,
  };

  return (
    <>
      <ListPageContext.Provider value={ListPageContextValue}>
        {viewType === ViewType.LIST_VIEW && (
          <ColumnsConfigProvider>
            <ListDetailsTableView />
          </ColumnsConfigProvider>
        )}
        {viewType === ViewType.CALENDAR_VIEW && <ListDetailsCalendarView />}
        {viewType === ViewType.BOARD_VIEW && <ListDetailsBoardView />}
      </ListPageContext.Provider>
    </>
  );
};

export default ListDetailsView;
