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
      dispatch(CalendarTasksActions.getCalendarTasks());
    }
  }, [dispatch, currentTaskListIdentifier, status, startDate, endDate]);

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
