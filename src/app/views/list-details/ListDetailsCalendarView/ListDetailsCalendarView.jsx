import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVert from '@material-ui/icons/MoreVert';
import { Box } from '@material-ui/core';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector,
  currentTaskListSelector,
} from 'selectors/task-list-selectors';
import { calendarDateRangeSelector } from 'selectors/calendar-tasks-selectors';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as CalendarTasksActions from 'actions/calendar-tasks-actions';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import Calendar from 'components/common/Calendar/Calendar';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';

const ListDetailsCalendarView = () => {
  const dispatch = useDispatch();
  const currentTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const status = useSelector(currentTaskListTasksStatusSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier, listName, listDescription, listType } =
    taskList || {};
  const { startDate, endDate } = useSelector(calendarDateRangeSelector);

  useEffect(() => {
    if (currentTaskListIdentifier && status && startDate && endDate) {
      dispatch(ListDetailsActions.getListCalendarTasks());
    }
  }, [dispatch, currentTaskListIdentifier, status, startDate, endDate]);

  useEffect(() => {
    return () => {
      dispatch(CalendarTasksActions.clearCalendarTasksState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ViewLayout
      header={
        <LayoutHeader horizontalSticky>
          {taskList && !['INBOX', 'PUBLIC'].includes(listType) && (
            <Box position="absolute" top={listDescription ? 17 : 27} left={10}>
              <ListOptionsMenu list={taskList}>
                <MoreVert color="primary" />
              </ListOptionsMenu>
            </Box>
          )}
          <LayoutHeader.Title title={listName} description={listDescription} />
        </LayoutHeader>
      }
    >
      <ListDetailsToolbar />
      <Calendar taskListIdentifier={taskListIdentifier} />
      <TaskDrawer />
    </ViewLayout>
  );
};

export default ListDetailsCalendarView;
