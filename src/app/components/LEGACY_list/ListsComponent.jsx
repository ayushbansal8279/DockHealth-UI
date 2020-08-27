import { Button, Dialog, Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close, MoreVert } from '@material-ui/icons';
import React, { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { openModal, closeModal } from 'modal/actions';
import useBoolean from 'hooks/useBoolean';
import ListPopover from 'components/common/ListPopover';
import Spacing from 'components/common/Spacing';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import HighPriorityLabel from 'img/priority-high-flag.svg';

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
    padding: '1.5rem 2rem',
  },
})(Dialog);

const DialogDivider = styled.div`
  background-color: ${palette.coolGrey3};
  height: 0.0625rem;
  left: -2rem;
  position: relative;
  width: calc(100% + 4rem);
`;

const TitleLabel = styled.div`
  color: ${palette.oPlusRed};
`;

const CloseButtonContainer = styled.div`
  color: ${palette.mediumGrey};
`;

const ListsButton = withStyles({
  contained: {
    minWidth: 'unset',
  },
})(Button);

const NewListTag = styled.div`
  background: #a4deb9;
  color: #2a4a70;
  font-size: 0.75em;
  padding: 0 0.45em;
  -webkit-border-radius: 0.45em;
  -moz-border-radius: 0.45em;
  border-radius: 0.45em;
  margin-bottom: 0.25em;
`;

const NewListNotification = styled.div`
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  background: #a4deb9;
  color: #2a4a70;
  font-size: 1em;
  padding: 1em 5em;
  -webkit-border-radius: 0.75em;
  -moz-border-radius: 0.75em;
  border-radius: 0.75em;
  margin-bottom: 1em;
`;

const TaskListRow = ({
  taskList,
  setIsAdminForCurrentList,
  setCurrentListIdentifier,
  openListMenu,
  setCurrentListMenuAnchor,
  currentUser,
  onClick,
  showNewIndicator,
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
    listType,
    listDescription,
    adminIdentifiers,
  } = taskList;

  let isOwnerOrAdmin = role === 'ADMIN' || role === 'OWNER';
  const isInbox = listType === 'INBOX';

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
        {showNewIndicator && <NewListTag>NEW</NewListTag>}
        <div
          onClick={() => onClick(taskListIdentifier)}
          style={{ cursor: 'pointer', textAlign: 'left' }}
        >
          <MontserratTypography variant="h4" weight="bold">
            {listName}
          </MontserratTypography>
        </div>
        <Spacing vertical={2} />
        <MontserratTypography variant="h6" weight="500">
          {listDescription}
        </MontserratTypography>
        <Spacing vertical={2} />
        <MontserratTypography variant="h6">
          {creator.userName}
        </MontserratTypography>
      </Grid>
      {numberOfHighPriorityTasks > 0 ? (
        <UniversalTooltipContainer
          label={`${numberOfHighPriorityTasks} high priority tasks`}
        >
          <img
            src={HighPriorityLabel}
            alt="Priority icon"
            style={{ width: '16px' }}
          />
        </UniversalTooltipContainer>
      ) : (
        <div />
      )}
      <UniversalTooltipContainer label="tasks assigned to me">
        <MontserratTypography variant="h4">
          {numberOfTasks}
        </MontserratTypography>
      </UniversalTooltipContainer>
      {!isInbox && (
        <div ref={popoverReference}>
          <IconButton
            onClick={() => {
              setIsAdminForCurrentList(isOwnerOrAdmin);
              setCurrentListIdentifier(taskListIdentifier);
              setCurrentListMenuAnchor(popoverReference);
              openListMenu();
            }}
            size="small"
          >
            <MoreVert color="secondary" />
          </IconButton>
        </div>
      )}
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
    showNewIndicator,
  } = props;

  const [isLeavePopoverOpen, openLeavePopover, closeLeavePopover] = useBoolean(
    false,
  );
  const [isListMenuOpen, openListMenu, closeListMenu] = useBoolean(false);
  const [isAdminForCurrentList, setIsAdminForCurrentList] = useState(false);
  const [currentListIdentifier, setCurrentListIdentifier] = useState(null);
  const [currentListMenuAnchor, setCurrentListMenuAnchor] = useState(null);

  const dispatch = useDispatch();

  const currentList = useMemo(
    () =>
      taskLists?.find(
        ({ taskListIdentifier }) =>
          taskListIdentifier === currentListIdentifier,
      ),
    [currentListIdentifier, taskLists],
  );

  const onInviteMenuItemClick = () => {
    closeListMenu();
    dispatch(openModal('InviteToList', { list: currentList }));
  };

  const deleteTaskList = async () => {
    deleteList(currentListIdentifier).then(dispatch(closeModal()));
  };

  const openDeleteConfirmationModal = () => {
    const modalProps = {
      confirm: () => deleteTaskList(),
    };
    dispatch(openModal('DeleteList', modalProps));
  };

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
            openDeleteConfirmationModal();
            closeListMenu();
          },
        },
        {
          key: 'invite',
          button: true,
          label: (
            <Grid container wrap="nowrap" alignItems="center">
              <div>Invite to list </div>
            </Grid>
          ),
          onClick: onInviteMenuItemClick,
        },
      ]
    : [
        {
          key: 'invite',
          button: true,
          label: (
            <Grid container wrap="nowrap" alignItems="center">
              <div>Invite to list </div>
            </Grid>
          ),
          onClick: onInviteMenuItemClick,
        },
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
      {showNewIndicator && taskLists && taskLists.length > 0 && (
        <Grid
          container
          alignItems="flex-start"
          justify="center"
          direction="column"
        >
          <NewListNotification>
            {taskLists.length > 1
              ? 'Hooray! You have new lists.'
              : 'Hooray! You have a new list.'}
          </NewListNotification>
        </Grid>
      )}
      {taskLists?.map(
        renderTaskListRow({
          setIsAdminForCurrentList,
          setCurrentListIdentifier,
          openListMenu,
          setCurrentListMenuAnchor,
          currentUser,
          onClick,
          showNewIndicator,
        }),
      )}
      <ListPopover
        anchorEl={currentListMenuAnchor?.current}
        open={isListMenuOpen}
        onClose={closeListMenu}
        items={menuItems}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      />
      <ListsDialog
        open={isLeavePopoverOpen}
        onClose={closeLeavePopover}
        PaperProps={{
          elevation: 0,
          square: true,
        }}
      >
        <Grid container justify="space-between" alignItems="center">
          <TitleLabel>
            <RobotoTypography variant="h4" color="inherit">
              LEAVE LIST
            </RobotoTypography>
          </TitleLabel>
          <CloseButtonContainer>
            <IconButton size="small" edge="end" onClick={closeLeavePopover}>
              <Close />
            </IconButton>
          </CloseButtonContainer>
        </Grid>
        <Spacing vertical={4} />
        <DialogDivider />
        <Spacing vertical={5} />
        <Grid container justify="center">
          <MontserratTypography variant="h4">
            <span>You are about to leave </span>
            <b>{currentList?.listName}.</b>
            <span> Are you sure you want to leave this list?</span>
          </MontserratTypography>
        </Grid>
        <Spacing vertical={5} />
        <Grid container justify="flex-end">
          <Button variant="text" onClick={closeLeavePopover}>
            <MontserratTypography
              variant="h4"
              textDecoration="underline"
              weight="600"
            >
              NO, CANCEL
            </MontserratTypography>
          </Button>
          <Spacing horizontal={4} />
          <ListsButton
            variant="contained"
            onClick={() => {
              const taskList = taskLists?.find(
                ({ taskListIdentifier }) =>
                  taskListIdentifier === currentListIdentifier,
              );
              leaveList(taskList).then(closeLeavePopover);
            }}
          >
            YES, LEAVE LIST
          </ListsButton>
        </Grid>
      </ListsDialog>
    </span>
  );
};

export default ListsComponent;
