import Grid from '@material-ui/core/Grid';
import React from 'react';

import FilterActiveIcon from '../../img/filter-active.svg';
import FilterIcon from '../../img/filter.svg';
import PrintIcon from '../../img/print.svg';
import SortingStatsActiveIcon from '../../img/sorting-stats-active.svg';
import SortingStatsIcon from '../../img/sorting-stats.svg';
import {
  StyledSlimViewSwitch,
  StyledToolbar,
  ToolbarContainer,
} from '../../views/TaskView.Styled';
import Search from './Search';
import { AddTaskButton } from './TaskDrawerButtons';
import TaskListAction from './TaskListAction';

export default ({
  clearFilter,
  displayHUD,
  downloadPDF,
  filterButton,
  filterBy,
  handleSearch,
  onAddTaskButtonClick,
  openFilterPopover,
  initialSearchValue,
  preferencesInitialized,
  selectedTask,
  showAddTaskButton = true,
  showSortingStats,
  slimView,
  switchSlimView,
  taskDrawerOpen,
  toggleHUD,
  toolbarContainerVisible,
}) => (
  <StyledToolbar>
    <Grid
      container
      alignItems="center"
      justify={toolbarContainerVisible ? 'space-between' : 'flex-end'}
    >
      {toolbarContainerVisible && (
        <ToolbarContainer>
          <StyledSlimViewSwitch
            onClick={switchSlimView}
            slimView={slimView}
            variant="contained"
          />
          <TaskListAction
            alt="Filter"
            activeIcon={FilterActiveIcon}
            backgroundColor="#fff"
            icon={FilterIcon}
            active={Boolean(filterBy)}
            onClick={filterBy ? clearFilter : openFilterPopover}
            ref={filterButton}
          >
            Filter
          </TaskListAction>
          {showSortingStats && (
            <TaskListAction
              alt="Sorting & stats"
              active={displayHUD}
              activeIcon={SortingStatsActiveIcon}
              backgroundColor="#fff"
              icon={SortingStatsIcon}
              onClick={toggleHUD}
            >
              Sorting & Stats
            </TaskListAction>
          )}
          {preferencesInitialized && (
            <Search initialValue={initialSearchValue} onChange={handleSearch} />
          )}
          <TaskListAction
            alt="Print"
            backgroundColor="#fff"
            icon={PrintIcon}
            onClick={downloadPDF}
          >
            Print
          </TaskListAction>
        </ToolbarContainer>
      )}
      {(selectedTask || !taskDrawerOpen) && showAddTaskButton && (
        <AddTaskButton onClick={onAddTaskButtonClick} />
      )}
    </Grid>
  </StyledToolbar>
);
