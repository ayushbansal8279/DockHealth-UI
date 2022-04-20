/* eslint-disable unicorn/no-nested-ternary */
import React, { useEffect } from 'react';
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

const ListDetailsView = () => {
  const parameters = useParams();
  const {
    taskListIdentifier: taskListIdentifierParameter,
    tabName,
  } = parameters;
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

  return viewType === ViewType.CALENDAR_VIEW ? (
    <ListDetailsCalendarView />
  ) : (
    <ColumnsConfigProvider>
      <ListDetailsTableView />
    </ColumnsConfigProvider>
  );
};

export default ListDetailsView;
