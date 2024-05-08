import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MoreVert from '@mui/icons-material/MoreVert';
import { Box, Typography } from '@mui/material';

import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import Board from 'components/common/Board/Board';
import { useSelector } from 'react-redux';
import ToolbarSelect from 'components/tasklist/ToolbarSelect/ToolbarSelect';
import {
  userHasBoardViewFeatureSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { TaskOrigin } from 'helpers/task-helpers';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import { BOARD_CONTEXTS_OPTIONS } from './helpers';
import BoardContextProvider from './BoardContextProvider';

const ListDetailsBoardView = () => {
  const history = useHistory();
  const taskList = useSelector(currentTaskListSelector);
  const [boardContextName, setBoardContextName] = useState(
    BOARD_CONTEXTS_OPTIONS[0].value,
  );

  const boardViewAvailable = useSelector(userHasBoardViewFeatureSelector);
  if (!boardViewAvailable) {
    history.push(`/core/home`);
  }

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

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
        <Box mx={0.5} />
        <Typography>Organize By:</Typography>
        <ToolbarSelect
          options={BOARD_CONTEXTS_OPTIONS}
          value={boardContextName}
          name="board-context-type"
          onChange={setBoardContextName}
          iconColorActive={iconColorActiveItem?.value}
        />
      </ListDetailsToolbar>
      <BoardContextProvider contextName={boardContextName}>
        {({
          columns = [],
          getTaskContextMenuOptionsArray,
          getColumnContextMenuOptionsArray,
          handleReorderTasks,
          handleReorderColumns,
          handleAddTask,
          handleAddWorkflow,
        }) => (
          <Board
            taskList={taskList}
            getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
            getColumnContextMenuOptionsArray={getColumnContextMenuOptionsArray}
            columns={columns}
            onReorderTasks={handleReorderTasks}
            onReorderColumns={handleReorderColumns}
            onAddTask={handleAddTask}
            onAddWorkflow={handleAddWorkflow}
            iconColorActive={iconColorActiveItem?.value}
          />
        )}
      </BoardContextProvider>

      <TaskDrawer origin={TaskOrigin.LIST} />
    </ViewLayout>
  );
};

export default ListDetailsBoardView;
