import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  currentTaskListIdentifierSelector,
  currentTaskListSelector,
} from 'selectors/task-list-selectors';
import { calendarDateRangeSelector } from 'selectors/calendar-tasks-selectors';
import { TaskOrigin } from 'helpers/task-helpers';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as CalendarTasksActions from 'actions/calendar-tasks-actions';
import Calendar from 'components/common/Calendar/Calendar';
import ListDetailsHeader from '../ListDetailsHeader/ListDetailsHeader';
import { ListPageContext } from '../ListDetailsView';
import { userPreferenceStatusSelector } from '@/app/selectors/user-preference-selectors';

const ListDetailsCalendarView = () => {
  const dispatch = useDispatch();
  const currentTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const status = useSelector(userPreferenceStatusSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier } = taskList || {};
  const { startDate, endDate } = useSelector(calendarDateRangeSelector);
  const { handleScroll } = useContext(ListPageContext);

  useEffect(() => {
    if (currentTaskListIdentifier && status && startDate && endDate) {
      dispatch(ListDetailsActions.getListCalendarTasks());
    }
  }, [
    dispatch,
    currentTaskListIdentifier,
    status,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    return () => {
      dispatch(CalendarTasksActions.clearCalendarTasksState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewLayout
      header={
        <ListDetailsHeader
          calendarView
        />
      }
    >
      <div style={{ overflowY: 'scroll' }} onScroll={handleScroll}>
        <Calendar taskListIdentifier={taskListIdentifier} />
      </div>
      <TaskDrawer origin={TaskOrigin.LIST} />
    </ViewLayout>
  );
};

export default ListDetailsCalendarView;
