import { Button, Dialog, Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MoreVert } from '@material-ui/icons';
import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import palette from '../../palette';
import { MontserratTypography } from '../../theme-montserrat';
import ListPopover from '../common/ListPopover';
import Spacing from '../common/Spacing';
import UniversalTooltipContainer from '../common/UniversalTooltipContainer';

const RowContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  display: grid;
  grid-template-columns: 2rem 1fr 2rem 2rem 2rem;
  grid-gap: 0.5rem;
  padding: 1rem;

  &:not(:last-child) {
    border-bottom: 0.0625rem solid ${palette.coolGrey4};
  }

  > * {
    justify-self: center;
  }
`;

const UnreadTasksIndicator = styled.div`
  background-color: ${palette.brightBlue};
  border-radius: 0.75rem;
  height: 0.75rem;
  width: 0.75rem;
`;

const ListsDialog = withStyles({
  paper: {
    borderRadius: 0,
    padding: '2rem',
  },
})(Dialog);

const ListsButton = withStyles({
  contained: {
    minWidth: 'unset',
  },
})(Button);

const TaskListRow = ({
  taskList,
  setIsAdminForCurrentList,
  setCurrentListIdentifier,
  openListMenu,
  setCurrentListMenuAnchor,
  currentUser,
  onClick,
}) => {
  const popoverReference = useRef(null);

  const {
    numberOfHighPriorityTasks,
    numberOfTasks,
    numberOfUnreadTasks,
    taskListIdentifier,
    creator,
    role,
    listName,
    listDescription,
    adminIdentifiers,
  } = taskList;

  let isOwnerOrAdmin = role === 'ADMIN' || role === 'OWNER';
  // double check against admins list
  if (
    role === 'MEMBER' &&
    adminIdentifiers.includes(currentUser.userIdentifier)
  ) {
    isOwnerOrAdmin = true;
  }

  return (
    <RowContainer key={`taskList${taskListIdentifier}`}>
      {numberOfUnreadTasks > 0 ? (
        <UniversalTooltipContainer label={`${numberOfUnreadTasks} new tasks`}>
          <UnreadTasksIndicator />
        </UniversalTooltipContainer>
      ) : (
        <div />
      )}
      <Grid
        container
        alignItems="flex-start"
        justify="center"
        direction="column"
      >
        <div
          onClick={() => onClick(taskListIdentifier)}
          style={{ cursor: 'pointer', textAlign: 'left' }}
        >
          <MontserratTypography variant="h4" weight="bold">
            {listName}
          </MontserratTypography>
        </div>
        <Spacing vertical={2} />
        <MontserratTypography variant="h5" weight="500">
          {listDescription}
        </MontserratTypography>
        <Spacing vertical={2} />
        <MontserratTypography variant="h5">
          {creator.userName}
        </MontserratTypography>
      </Grid>
      {numberOfHighPriorityTasks > 0 ? (
        <UniversalTooltipContainer
          label={`${numberOfHighPriorityTasks} high priority tasks`}
        >
          <svg className="icon medium flag">
            <use xlinkHref="#icon-flag" />
          </svg>
        </UniversalTooltipContainer>
      ) : (
        <div />
      )}
      <UniversalTooltipContainer label="tasks assigned to me">
        <MontserratTypography variant="h4">
          {numberOfTasks}
        </MontserratTypography>
      </UniversalTooltipContainer>
      <div ref={popoverReference}>
        <IconButton
          onClick={() => {
            setIsAdminForCurrentList(isOwnerOrAdmin);
            setCurrentListIdentifier(taskListIdentifier);
            setCurrentListMenuAnchor(popoverReference.current);
            openListMenu();
          }}
          size="small"
        >
          <MoreVert color="secondary" />
        </IconButton>
      </div>
    </RowContainer>
  );
};

const renderTaskListRow = taskListMethods => taskList => {
  return <TaskListRow taskList={taskList} {...taskListMethods} />;
};

const ListsComponent = props => {
  const {
    deleteList,
    editForm,
    leaveList,
    taskLists,
    currentUser,
    onClick,
  } = props;

  const [isLeavePopoverOpen, openLeavePopover, closeLeavePopover] = useBoolean(
    false,
  );
  const [
    isDeletePopoverOpen,
    openDeletePopover,
    closeDeletePopover,
  ] = useBoolean(false);
  const [isListMenuOpen, openListMenu, closeListMenu] = useBoolean(false);
  const [isAdminForCurrentList, setIsAdminForCurrentList] = useState(false);
  const [currentListIdentifier, setCurrentListIdentifier] = useState(null);
  const [currentListMenuAnchor, setCurrentListMenuAnchor] = useState(null);

  const currentList = useMemo(
    () =>
      taskLists?.find(
        ({ taskListIdentifier }) =>
          taskListIdentifier === currentListIdentifier,
      ),
    [currentListIdentifier, taskLists],
  );

  const menuItems = isAdminForCurrentList
    ? [
        {
          key: 'edit',
          button: true,
          label: 'Edit',
          onClick: () => {
            editForm(currentList);
            closeListMenu();
          },
        },
        {
          key: 'delete',
          button: true,
          label: 'Delete',
          onClick: () => {
            openDeletePopover();
            closeListMenu();
          },
        },
      ]
    : [
        {
          key: 'leave',
          button: true,
          label: 'Leave',
          onClick: () => {
            openLeavePopover();
            closeListMenu();
          },
        },
      ];

  return (
    <span>
      {taskLists?.map(
        renderTaskListRow({
          setIsAdminForCurrentList,
          setCurrentListIdentifier,
          openListMenu,
          setCurrentListMenuAnchor,
          currentUser,
          onClick,
        }),
      )}
      <ListPopover
        anchorEl={currentListMenuAnchor}
        open={isListMenuOpen}
        onClose={closeListMenu}
        items={menuItems}
      />
      <ListsDialog open={isDeletePopoverOpen} onClose={closeDeletePopover}>
        <Grid container justify="center">
          <MontserratTypography variant="h3">
            {`Are you sure you want to delete '${currentList?.listName}'?`}
          </MontserratTypography>
        </Grid>
        <Spacing vertical={4} />
        <Grid container justify="center">
          <Button variant="text" size="small" onClick={closeDeletePopover}>
            Cancel
          </Button>
          <Spacing horizontal={3} />
          <ListsButton
            variant="contained"
            size="small"
            onClick={() => {
              deleteList(currentListIdentifier).then(closeDeletePopover);
            }}
          >
            Delete
          </ListsButton>
        </Grid>
      </ListsDialog>
      <ListsDialog open={isLeavePopoverOpen} onClose={closeLeavePopover}>
        <Grid container justify="center">
          <MontserratTypography variant="h3">
            {`Are you sure you want to leave '${currentList?.listName}'?`}
          </MontserratTypography>
        </Grid>
        <Spacing vertical={4} />
        <Grid container justify="center">
          <Button variant="text" onClick={closeDeletePopover}>
            Cancel
          </Button>
          <Spacing horizontal={3} />
          <ListsButton
            variant="contained"
            onClick={() => {
              leaveList(currentListIdentifier).then(closeLeavePopover);
            }}
          >
            Leave
          </ListsButton>
        </Grid>
      </ListsDialog>
    </span>
  );
};

export default ListsComponent;
