import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as CalendarTasksActions from 'actions/calendar-tasks-actions';
import * as DashboardActions from 'actions/dashboard-actions';
import { calendarDateRangeSelector } from 'selectors/calendar-tasks-selectors';
import { dashboardTabNameSelector } from 'selectors/dashboard-selectors';
import Calendar from 'components/common/Calendar/Calendar';

const DashboardCalendar = () => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector(calendarDateRangeSelector);
  const tabName = useSelector(dashboardTabNameSelector);

  useEffect(() => {
    if (tabName && startDate && endDate) {
      dispatch(DashboardActions.getDashboardCalendarTasks());
    }
  }, [tabName, startDate, endDate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(CalendarTasksActions.clearCalendarTasksState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Calendar />;
};

export default DashboardCalendar;
