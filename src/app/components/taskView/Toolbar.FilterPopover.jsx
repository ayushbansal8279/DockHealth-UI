import { Button, Fade } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ListPopover from '../common/ListPopover';
import RotatableChevron from '../common/RotatableChevron';
import Spacing from '../common/Spacing';
import { ToolbarLabel } from './Toolbar.Styled';

export const filterOptions = [
  {
    value: 'ASSIGNED_TO_ME',
    description: 'Assigned to me',
    statsKey: 'AssignedToMe_TaskList_Count',
  },
  // {
  //   value: 'CREATED_BY_ME',
  //   description: 'Created by me',
  // },
  {
    value: 'FLAGGED',
    description: 'Flagged',
    statsKey: 'HighPriority_TaskList_Count',
  },
  {
    value: 'OVERDUE',
    description: 'Overdue',
    statsKey: 'OverDue_TaskList_Count',
  },
  {
    value: 'DUE_TODAY',
    description: 'Due Today',
    statsKey: 'DueToday_TaskList_Count',
  },
  // {
  //   value: 'DUE_THIS_WEEK',
  //   description: 'Due This Week',
  // },
  // {
  //   value: 'DUE_NEXT_WEEK',
  //   description: 'Due Next Week',
  // },
];

const FilterPopover = ({
  isFilterPopoverOpen,
  closeFilterPopover,
  filterBy,
  onFilterChange,
  clearFilter,
  filterButtonReference,
  showFilterStats,
}) => {
  const currentFilterDescription =
    filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

  const taskListStats = useSelector(store => store.taskListState.taskListStats);

  const mappedFilterOptions = filterOptions.map(
    ({ value, description, statsKey }) => {
      const filterTaskCount =
        taskListStats?.stats?.find(({ metricName }) => metricName === statsKey)
          ?.metricValue ?? '?';

      const optionLabel = showFilterStats
        ? `${description} (${filterTaskCount})`
        : description;

      return {
        key: value,
        label: optionLabel,
        onClick: () => {
          onFilterChange({ value })();
          closeFilterPopover();
        },
      };
    },
  );

  const onClearClick = useCallback(() => {
    clearFilter();
    closeFilterPopover();
  }, [clearFilter, closeFilterPopover]);

  const filterButton = {
    key: 'filter',
    label: (
      <>
        <Button variant="text" onClick={closeFilterPopover} size="small">
          <ToolbarLabel variant="body1" component="span">
            FILTER
          </ToolbarLabel>
          <Spacing horizontal={3} />
          <RotatableChevron rotated={isFilterPopoverOpen} />
        </Button>
        {currentFilterDescription && (
          <>
            <Spacing horizontal={3} />
            <ToolbarLabel
              variant="body1"
              component="span"
              style={{ color: '#8492a4' }}
            >
              {currentFilterDescription}
            </ToolbarLabel>
            <Spacing horizontal={3} />
            <ToolbarLabel
              variant="body1"
              component="span"
              onClick={onClearClick}
              style={{ cursor: 'pointer' }}
            >
              Clear
            </ToolbarLabel>
          </>
        )}
      </>
    ),
    disableHover: true,
    button: false,
    style: {
      padding: '0.25rem 1.375rem',
    },
  };

  const divider = {
    key: 'divider',
    label: '',
    button: false,
    style: {
      borderBottom: '0.0625rem solid #e5e9f2',
      margin: '0.25rem 0',
      padding: 0,
    },
  };

  const { left: filterButtonX = 0, top: filterButtonY = 0 } =
    filterButtonReference.current?.getBoundingClientRect() || {};

  return (
    <ListPopover
      open={isFilterPopoverOpen}
      anchorReference="anchorPosition"
      anchorPosition={{
        left: filterButtonX - 23,
        top: filterButtonY - 5.5,
      }}
      onClose={closeFilterPopover}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      transformOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      TransitionComponent={Fade}
      items={[filterButton, divider, ...mappedFilterOptions]}
    />
  );
};

export default FilterPopover;
