import React, { useCallback, useState } from 'react';
import MoreVert from '@material-ui/icons/MoreVert';
import { Box, Typography } from '@material-ui/core';
import {
  reorderTaskListGroups,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
} from 'actions/list-details-actions';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import Board from 'components/common/Board/Board';
import { useDispatch, useSelector } from 'react-redux';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import { BOARD_CONTEXTS_OPTIONS } from './helpers';
import BoardContextProvider from './BoardContextProvider';

const ListDetailsBoardView = () => {
  const dispatch = useDispatch();
  const taskList = useSelector(currentTaskListSelector);
  const [boardContextName, setBoardContextName] = useState(
    BOARD_CONTEXTS_OPTIONS[0].value,
  );

  const handleReorderTasks = useCallback(
    (source, destination) => {
      if (source?.droppableId === destination?.droppableId) {
        dispatch(reorderTasksInGroup({ destination, source }));
      } else {
        dispatch(reassignTasksToAnotherGroup({ destination, source }));
      }
    },
    [dispatch],
  );

  const handleReorderColumns = useCallback(
    (sourceIndex, destinationIndex) => {
      dispatch(reorderTaskListGroups(sourceIndex, destinationIndex));
    },
    [dispatch],
  );

  return (
    <ViewLayout
      header={
        <LayoutHeader horizontalSticky>
          {taskList && (
            <Box
              position="absolute"
              top={taskList?.listDescription ? 17 : 27}
              left={10}
            >
              <ListOptionsMenu list={taskList}>
                <MoreVert color="primary" />
              </ListOptionsMenu>
            </Box>
          )}
          <LayoutHeader.Title
            title={taskList?.listName}
            description={taskList?.listDescription}
            colorIndicator={taskList?.color}
          />
        </LayoutHeader>
      }
    >
      <ListDetailsToolbar>
        <Typography>Organize By:</Typography>
        <ToolbarSelect
          options={BOARD_CONTEXTS_OPTIONS}
          value={boardContextName}
          name="board-context-type"
          onChange={setBoardContextName}
        />
      </ListDetailsToolbar>
      <BoardContextProvider contextName={boardContextName}>
        {({
          columns = [],
          getTaskContextMenuOptionsArray,
          getColumnContextMenuOptionsArray,
        }) => (
          <>
            <Board
              getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
              getColumnContextMenuOptionsArray={
                getColumnContextMenuOptionsArray
              }
              columns={columns}
              onReorderTasks={handleReorderTasks}
              onReorderColumns={handleReorderColumns}
            />
          </>
        )}
      </BoardContextProvider>

      <TaskDrawer />
    </ViewLayout>
  );
};

export default ListDetailsBoardView;
