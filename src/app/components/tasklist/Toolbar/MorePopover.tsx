/* eslint-disable react/require-default-props */
import { Fade, Grid } from '@material-ui/core';
import React from 'react';
import NotificationsCheck from 'img/toolbar-notifications-check';
import palette from 'styles/palette';
import { onPrint } from 'helpers/ga-event-helper';
import Button from 'components/common/Button/Button';
import ListPopover from 'components/common/ListPopover/ListPopover';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import { printTaskPdf } from 'components/task-pdf/TaskPdfDocument';
import { ToolbarLabel } from './styled';

interface OnPrintClickProps {
  tasks: Array<object>;
  completedTasks: Array<object>;
  taskListMembers: Array<object>;
  listNameColumnVisible: boolean;
  patientColumnVisible: boolean;
  closeMorePopover: () => void;
  pdfTitle?: string;
}

interface MorePopoverProps extends OnPrintClickProps {
  moreButtonReference: React.MutableRefObject<HTMLElement>;
  isMorePopoverOpen: boolean;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  isSpecialList?: boolean;
  showNotifications?: boolean;
  onAddCustomFieldsClick: () => void | null;
}

const onPrintClick = ({
  closeMorePopover,
  tasks,
  completedTasks,
  taskListMembers,
  listNameColumnVisible,
  patientColumnVisible,
  pdfTitle,
}: OnPrintClickProps) => () => {
  closeMorePopover();

  onPrint();
  return printTaskPdf({
    title: pdfTitle,
    tasks: [...tasks, ...completedTasks],
    taskListMembers,
    isListNameVisible: listNameColumnVisible,
    isPatientVisible: patientColumnVisible,
  });
};

const MorePopover = ({
  moreButtonReference,
  onAddCustomFieldsClick,
  closeMorePopover,
  isMorePopoverOpen,
  tasks,
  completedTasks,
  taskListMembers,
  notificationsEnabled,
  toggleNotifications,
  isSpecialList,
  showNotifications,
  listNameColumnVisible,
  patientColumnVisible,
  pdfTitle,
}: MorePopoverProps) => {
  const { left: filterButtonX = 0, top: filterButtonY = 0 } =
    moreButtonReference?.current?.getBoundingClientRect() || {};

  const moreButtonElement = {
    key: 'filter',
    label: (
      <Button
        variant="text"
        width="200px"
        onClick={closeMorePopover}
        endIcon={
          <RotatableChevron
            rotated={isMorePopoverOpen}
            color={palette.brightBlue}
            onClick={() => {}}
          />
        }
      >
        <ToolbarLabel variant="body1" component="span">
          ACTIONS
        </ToolbarLabel>
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
      borderBottom: `0.0625rem solid ${palette.coolGrey3}`,
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
        listNameColumnVisible,
        patientColumnVisible,
        pdfTitle,
      }),
    },
    isSpecialList || !showNotifications
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
                {notificationsEnabled && (
                  <>
                    <NotificationsCheck />
                    <Spacing horizontal={2} />
                  </>
                )}
                <span>{notificationsEnabled ? 'On' : 'Off'}</span>
              </Grid>
            </Grid>
          ),
          onClick: toggleNotifications,
        },
  ];

  if (onAddCustomFieldsClick && typeof onAddCustomFieldsClick === 'function') {
    popoverItems.push({
      key: 'addCustomField',
      label: <span>Custom Fields</span>,
      onClick: onAddCustomFieldsClick,
    });
  }

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
