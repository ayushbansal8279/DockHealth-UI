import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVert from '@material-ui/icons/MoreVert';
import { Box } from '@material-ui/core';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector,
  currentTaskListSelector,
} from 'selectors/task-list-selectors';
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

  useEffect(() => {
    dispatch(CalendarTasksActions.getCalendarTasks());
  }, [dispatch, currentTaskListIdentifier, status]);

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
      <Calendar
        taskList={[]}
        taskListIdentifier={taskListIdentifier}
        // showInCompleteTasksOnly={selectedTab === TaskListTabName.OPEN}
      />
    </ViewLayout>
  );
};

export default ListDetailsCalendarView;
