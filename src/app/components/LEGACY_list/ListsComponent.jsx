import { Button, Dialog, Grid, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close, MoreVert } from '@material-ui/icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  clearMembersInTaskList,
  clearMembersNotInTaskList,
  getMembersByTaskListId,
  getOrganizationUsersNotInTaskList,
} from 'actions/tasklist-actions';
import useBoolean from 'hooks/useBoolean';
import CubesLoader from 'components/common/CubesLoader';
import ListPopover from 'components/common/ListPopover';
import Spacing from 'components/common/Spacing';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import InviteMemberPopover from '../members/InviteMemberPopover';

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
            setCurrentListMenuAnchor(popoverReference);
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
  const [
    isInvitePopoverOpen,
    openInvitePopover,
    closeInvitePopover,
  ] = useBoolean(false);
  const [isListMenuOpen, openListMenu, closeListMenu] = useBoolean(false);
  const [isAdminForCurrentList, setIsAdminForCurrentList] = useState(false);
  const [currentListIdentifier, setCurrentListIdentifier] = useState(null);
  const [currentListMenuAnchor, setCurrentListMenuAnchor] = useState(null);
  const [
    areMembersLoading,
    setMembersLoading,
    unsetMembersLoading,
  ] = useBoolean(false);

  const dispatch = useDispatch();

  const currentList = useMemo(
    () =>
      taskLists?.find(
        ({ taskListIdentifier }) =>
          taskListIdentifier === currentListIdentifier,
      ),
    [currentListIdentifier, taskLists],
  );

  const { members, membersNotInTaskList } = useSelector(store => ({
    members: store.taskListState.tasklistmembers,
    membersNotInTaskList: store.taskListState.orgusersnotintasklist,
  }));

  const onInviteMenuItemClick = useCallback(() => {
    setMembersLoading();
    clearMembersInTaskList()(dispatch);
    clearMembersNotInTaskList()(dispatch);

    Promise.all([
      getMembersByTaskListId(currentListIdentifier, 'ALL')(dispatch),
      getOrganizationUsersNotInTaskList(currentListIdentifier)(dispatch),
    ])
      .then(() => {
        unsetMembersLoading();
        openInvitePopover();
        closeListMenu();
      })
      .catch(unsetMembersLoading);
  }, [
    closeListMenu,
    currentListIdentifier,
    dispatch,
    openInvitePopover,
    setMembersLoading,
    unsetMembersLoading,
  ]);

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
        {
          key: 'invite',
          button: true,
          label: (
            <Grid container wrap="nowrap" alignItems="center">
              <div>Invite to list </div>
              {areMembersLoading && (
                <>
                  <Spacing horizontal={3} />
                  <div>
                    <CubesLoader size={16} color={palette.brightBlue} />
                  </div>
                </>
              )}
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
              {areMembersLoading && (
                <>
                  <Spacing horizontal={3} />
                  <div>
                    <CubesLoader size={16} color={palette.brightBlue} />
                  </div>
                </>
              )}
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
      <InviteMemberPopover
        addMemberButtonReference={currentListMenuAnchor}
        isMemberPopoverOpen={isInvitePopoverOpen}
        closeMemberPopover={closeInvitePopover}
        taskList={currentList}
        members={members ?? []}
        membersNotInTaskList={membersNotInTaskList ?? []}
      />
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
        open={isDeletePopoverOpen}
        onClose={closeDeletePopover}
        PaperProps={{
          elevation: 0,
          square: true,
        }}
      >
        <Grid container justify="space-between" alignItems="center">
          <TitleLabel>
            <RobotoTypography variant="h4" color="inherit">
              DELETE LIST
            </RobotoTypography>
          </TitleLabel>
          <CloseButtonContainer>
            <IconButton size="small" edge="end" onClick={closeDeletePopover}>
              <Close />
            </IconButton>
          </CloseButtonContainer>
        </Grid>
        <Spacing vertical={4} />
        <DialogDivider />
        <Spacing vertical={5} />
        <Grid container justify="center">
          <MontserratTypography variant="h4">
            <span>You are about to delete </span>
            <b>{currentList?.listName}.</b>
            <span> Are you sure you want to delete this list?</span>
          </MontserratTypography>
        </Grid>
        <Spacing vertical={5} />
        <Grid container justify="flex-end">
          <Button variant="text" size="small" onClick={closeDeletePopover}>
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
            size="small"
            onClick={() => {
              deleteList(currentListIdentifier).then(closeDeletePopover);
            }}
          >
            YES, DELETE LIST
          </ListsButton>
        </Grid>
      </ListsDialog>
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
              leaveList(currentListIdentifier).then(closeLeavePopover);
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
