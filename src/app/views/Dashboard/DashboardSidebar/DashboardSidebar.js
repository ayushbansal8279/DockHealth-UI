import React, { useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'modal/actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as InvitationActions from 'actions/invitation-actions';
import { selectCurrentOrganization as selectCurrentOrganizationAction } from 'api/user-api';
import { hashHistory } from 'react-router';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import palette from 'styles/palette';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import OrganizationList from 'components/organization/OrganizationList/OrganizationList';

import {
  TopSection,
  MenuButton,
  ListsHeader,
  ListItem,
  ListItemsWrapper,
  ListItemTitle,
  TitleText,
  ListItemInfo,
  DashboardSidebarWrapper,
  PrivateListIcon,
  ListsSection,
  InfoDot,
  RolloverPopover,
  RolloverPopoverLabel,
  ListItemWrapper,
  ListLink,
  MenuIconPlaceholder,
  AddListButton,
  NewListIndicator,
  NewListLabel,
} from './styled';
import initializeUserTourItems from './user-tour';

const DashboardSidebar = ({
  lists,
  showNavbar,
  shouldDisplayFirstListCreationMessage,
  closeListCreationSuccessMessage,
  acceptInvitation,
  modalActions,
  taskListActions,
  invitationActions,
  currentUser,
  selectCurrentOrganization,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const hoveredItemReference = useRef(null);
  const itemsMoreButtonReferences = useRef([]);

  const [popoverLabel, setPopoverLabel] = useState(null);
  const [listMenuPopupOpen, setListMenuPopupOpen] = useState(false);
  const [
    currentListMenuPopupReference,
    setCurrentListMenuPopupReference,
  ] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const { renderTourItems, setTourPopupReferences } = initializeUserTourItems({
    shouldDisplayFirstListCreationMessage,
    closeListCreationSuccessMessage,
    currentUser,
  });

  const hasAnyPendingList = lists.some(({ status }) => status === 'PENDING');

  const handleMouseEnter = (event, listName) => {
    const { target } = event;

    if (target?.scrollWidth > target?.offsetWidth) {
      hoveredItemReference.current = target;
      setPopoverLabel(listName);
    }
  };

  const filteredList = shouldDisplayFirstListCreationMessage
    ? lists?.filter(({ listType }) => listType !== 'INBOX')
    : lists;

  const openListMenuPopover = (taskList, indexOnList) => {
    setSelectedList(taskList);
    setCurrentListMenuPopupReference({
      current: itemsMoreButtonReferences.current[indexOnList],
    });
    setListMenuPopupOpen(true);
  };

  const openDeleteConfirmationModal = () => {
    const modalProps = {
      confirm: () => {
        taskListActions.deleteTaskListById(selectedList?.taskListIdentifier);
        modalActions.closeModal();
      },
    };
    modalActions.openModal('DeleteList', modalProps);
  };

  const handleInviteToList = () => {
    modalActions.openModal('InviteToList', { list: selectedList });
  };

  const handleLeaveList = () => {
    const { status } = selectedList;

    const modalProps = {
      confirm: () => {
        if (status === 'PENDING') {
          invitationActions.rejectInviteToTaskList(selectedList);
        } else {
          taskListActions.leaveList(selectedList?.taskListIdentifier);
        }
        modalActions.closeModal();
      },
    };
    modalActions.openModal('LeaveList', modalProps);
  };

  const openListEditModal = taskList => {
    modalActions.openModal('ListForm', { list: taskList });
  };

  const openListAddModal = () => {
    modalActions.openModal('ListForm');
  };

  const { userOrganizations } = currentUser;

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const currentOrganization = userOrganizations?.find(
    ({ organizationIdentifier }) =>
      currentOrganizationIdentifier === organizationIdentifier,
  );
  const availableUserOrganizations = userOrganizations?.filter(
    ({ organizationIdentifier }) =>
      organizationIdentifier !== currentOrganization?.organizationIdentifier,
  );

  return (
    <DashboardSidebarWrapper>
      <TopSection>
        <MenuButton onClick={showNavbar}>
          <img src={MenuIcon} alt="menu" />
        </MenuButton>
        {hasAnyPendingList && (
          <NewListIndicator>Hooray! You have a new list.</NewListIndicator>
        )}
      </TopSection>
      <OrganizationList
        currentOrganization={currentOrganization}
        availableUserOrganizations={availableUserOrganizations}
        shouldExpand
        selectedIdentifierConfig={{ fontColor: palette.mediumGrey, left: 16 }}
        availableIdentifierConfig={{ fontColor: palette.mediumGrey, left: 16 }}
        showShadowOnHover
        onSelect={selectCurrentOrganization}
      />
      <ListsSection>
        <ListsHeader>
          My lists
          <AddListButton onClick={openListAddModal} type="button">
            <span>+</span> Add list
          </AddListButton>
        </ListsHeader>
        <ListItemsWrapper>
          {filteredList?.map((taskList, index) => (
            <ListItemWrapper key={taskList?.taskListIdentifier}>
              <ListLink
                onClick={() => {
                  if (taskList?.status === 'PENDING')
                    acceptInvitation(taskList);

                  hashHistory.push(`/tasks/${taskList?.taskListIdentifier}`);
                }}
              >
                <ListItem
                  ref={element =>
                    setTourPopupReferences(
                      element,
                      taskList?.listType,
                      taskList?.taskListIdentifier,
                    )
                  }
                >
                  {taskList?.status === 'PENDING' && (
                    <NewListLabel>New</NewListLabel>
                  )}
                  {taskList?.isPrivate && (
                    <PrivateListIcon src={LockIcon} alt="private" />
                  )}
                  {!!taskList?.hasUpdatesForMember && <InfoDot />}
                  <ListItemTitle
                    onMouseEnter={event =>
                      handleMouseEnter(event, taskList?.listName)
                    }
                    onMouseLeave={() => setPopoverLabel(null)}
                  >
                    <TitleText>{taskList?.listName}</TitleText>
                  </ListItemTitle>
                  <ListItemInfo>{taskList?.numberOfTasks}</ListItemInfo>
                </ListItem>
              </ListLink>
              {taskList?.listType !== 'INBOX' ? (
                <IconButton
                  ref={element => {
                    if (element)
                      itemsMoreButtonReferences.current[index] = element;
                  }}
                  onClick={() => {
                    openListMenuPopover(taskList, index);
                  }}
                  size="small"
                  color="secondary"
                >
                  <MoreVert />
                </IconButton>
              ) : (
                <MenuIconPlaceholder />
              )}
            </ListItemWrapper>
          ))}
        </ListItemsWrapper>
      </ListsSection>
      <RolloverPopover
        anchorEl={hoveredItemReference?.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={!!popoverLabel}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={100}
      >
        <RolloverPopoverLabel>{popoverLabel}</RolloverPopoverLabel>
      </RolloverPopover>
      <MenuPopover
        anchorEl={currentListMenuPopupReference?.current}
        open={listMenuPopupOpen}
        onClose={() => setListMenuPopupOpen(false)}
        onAfterOptionClick={() => setListMenuPopupOpen(false)}
        options={[
          ...(['ADMIN', 'OWNER'].includes(selectedList?.role)
            ? [
                {
                  key: 'edit',
                  label: 'Edit List',
                  onClick: () => openListEditModal(selectedList),
                },
                {
                  key: 'delete',
                  label: 'Delete List',
                  onClick: () => {
                    openDeleteConfirmationModal();
                  },
                },
              ]
            : [
                {
                  key: 'leave',
                  label: 'Leave List',
                  onClick: handleLeaveList,
                },
              ]),
          {
            key: 'invite',
            label: 'Invite people to list',
            onClick: handleInviteToList,
          },
        ]}
      />
      {renderTourItems()}
    </DashboardSidebarWrapper>
  );
};

const mapDispachToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  selectCurrentOrganization: bindActionCreators(
    selectCurrentOrganizationAction,
    dispatch,
  ),
});

export default connect(null, mapDispachToProps)(DashboardSidebar);
