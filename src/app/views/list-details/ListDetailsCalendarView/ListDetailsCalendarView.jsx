import React from 'react';
import { useSelector } from 'react-redux';
import MoreVert from '@material-ui/icons/MoreVert';
import { Box } from '@material-ui/core';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';

const ListDetailsCalendarView = () => {
  const taskList = useSelector(currentTaskListSelector);
  const { listName, listDescription, listType } = taskList || {};

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
      Calendar View
    </ViewLayout>
  );
};

export default ListDetailsCalendarView;
