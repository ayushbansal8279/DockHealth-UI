import { Button, Fade, Grid } from '@material-ui/core';
import React from 'react';
import NotificationsCheck from '../../img/toolbar-notifications-check';
import ListPopover from '../common/ListPopover';
import RotatableChevron from '../common/RotatableChevron';
import Spacing from '../common/Spacing';
import { ToolbarLabel } from './Toolbar.Styled';
import { printTaskPdf } from '../task-pdf/TaskPdfDocument';

interface OnPrintClickProps {
  tasks: Array<object>;
  completedTasks: Array<object>;
  taskListMembers: Array<object>;
  closeMorePopover: () => void;
}

interface MorePopoverProps extends OnPrintClickProps {
  moreButtonReference: React.MutableRefObject<HTMLElement>;
  isMorePopoverOpen: boolean;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  isSpecialList?: boolean;
}

const onPrintClick = ({
  closeMorePopover,
  tasks,
  completedTasks,
  taskListMembers,
}: OnPrintClickProps) => () => {
  closeMorePopover();

  return printTaskPdf({
    tasks: [...tasks, ...completedTasks],
    taskListMembers,
  });
};

const MorePopover = ({
  moreButtonReference,
  closeMorePopover,
  isMorePopoverOpen,
  tasks,
  completedTasks,
  taskListMembers,
  notificationsEnabled,
  toggleNotifications,
  isSpecialList,
}: MorePopoverProps) => {
  const { left: filterButtonX = 0, top: filterButtonY = 0 } =
    moreButtonReference?.current?.getBoundingClientRect() || {};

  const moreButtonElement = {
    key: 'filter',
    label: (
      <Button variant="text" onClick={closeMorePopover} size="small">
        <ToolbarLabel variant="body1">ACTIONS</ToolbarLabel>
        <Spacing horizontal={3} />
        <RotatableChevron rotated={isMorePopoverOpen} />
      </Button>
    ),
    disableHover: true,
    button: false,
    style: {
      padding: '0.25rem 1.375rem',
    },
  };

  const dividerElement = {
    key: 'divider',
    label: '',
    button: false,
    style: {
      borderBottom: '0.0625rem solid #e5e9f2',
      margin: '0.25rem 0',
      padding: 0,
    },
  };

  const popoverItems = [
    moreButtonElement,
    dividerElement,
    {
      key: 'print',
      label: 'Print',
      onClick: onPrintClick({
        closeMorePopover,
        tasks,
        completedTasks,
        taskListMembers,
      }),
    },
    isSpecialList
      ? null
      : {
          key: 'notifications',
          label: (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              <div>Notifications</div>
              <Grid
                container
                wrap="nowrap"
                alignItems="center"
                justify="flex-end"
              >
                <NotificationsCheck />
                <Spacing horizontal={2} />
                <span>{notificationsEnabled ? 'On' : 'Off'}</span>
              </Grid>
            </Grid>
          ),
          onClick: toggleNotifications,
        },
  ];

  return (
    <ListPopover
      anchorReference="anchorPosition"
      anchorPosition={{
        left: filterButtonX - 23,
        top: filterButtonY - 5.5,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isMorePopoverOpen}
      onClose={closeMorePopover}
      TransitionComponent={Fade}
      items={popoverItems}
    />
  );
};

export default MorePopover;
