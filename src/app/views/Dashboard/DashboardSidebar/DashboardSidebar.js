import React, { useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ModalActions from 'modal/actions';
import * as TaskListActions from 'actions/tasklist-actions';
import { Link } from 'react-router';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import ArrowIcon from 'img/arrow';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import TaskListInviteMemberContainer from 'components/taskView/TaskListInviteMemberContainer/TaskListInviteMemberContainer';
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
  Arrow,
  RolloverPopover,
  RolloverPopoverLabel,
  ListItemWrapper,
  ListLink,
  MenuIconPlaceholder,
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
  members,
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
  const [invitePopoverOpen, setInvitePopoverOpen] = useState(false);

  const { renderTourItems, setTourPopupReferences } = initializeUserTourItems({
    shouldDisplayFirstListCreationMessage,
    closeListCreationSuccessMessage,
  });

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
    const { taskListIdentifier } = selectedList;

    if (!taskListIdentifier) return;

    taskListActions
      .getMembersByTaskListId(taskListIdentifier, 'ALL')
      .then(() => {
        setInvitePopoverOpen(true);
      })
      .catch(() => {});
  };

  return (
    <DashboardSidebarWrapper>
      <TopSection>
        <MenuButton onClick={showNavbar}>
          <img src={MenuIcon} alt="menu" />
        </MenuButton>
      </TopSection>
      <ListsSection>
        <Link to="/tasks">
          <ListsHeader>
            Lists
            <Arrow src={ArrowIcon} alt="arrow" />
          </ListsHeader>
        </Link>
        <ListItemsWrapper>
          {filteredList?.map((taskList, index) => (
            <ListItemWrapper>
              <ListLink
                key={taskList?.taskListIdentifier}
                to={`/tasks/${taskList?.taskListIdentifier}`}
                onClick={() => {
                  if (taskList?.status === 'PENDING')
                    acceptInvitation(taskList);
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
                  {taskList?.isPrivate && (
                    <PrivateListIcon src={LockIcon} alt="private" />
                  )}
                  <ListItemTitle
                    onMouseEnter={event =>
                      handleMouseEnter(event, taskList?.listName)
                    }
                    onMouseLeave={() => setPopoverLabel(null)}
                  >
                    <TitleText>{taskList?.listName}</TitleText>
                  </ListItemTitle>
                  <ListItemInfo>
                    {!!taskList?.numberOfUnreadTasks && <InfoDot />}
                    {taskList?.numberOfTasks}
                  </ListItemInfo>
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
        open={popoverLabel}
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
                  label: 'Edit list',
                  onClick: () => {},
                },
                {
                  key: 'delete',
                  label: 'Delete list',
                  onClick: () => {
                    openDeleteConfirmationModal();
                  },
                },
              ]
            : [
                {
                  key: 'leave',
                  label: 'Leave List',
                  onClick: () => {
                    taskListActions.leaveList(selectedList?.taskListIdentifier);
                  },
                },
              ]),
          {
            key: 'invite',
            label: 'Invite people to list',
            onClick: handleInviteToList,
          },
        ]}
      />
      <TaskListInviteMemberContainer
        addMemberButtonReference={currentListMenuPopupReference}
        isMemberPopoverOpen={invitePopoverOpen}
        closeMemberPopover={() => setInvitePopoverOpen(false)}
        taskList={selectedList}
        members={members ?? []}
      />
      {renderTourItems()}
    </DashboardSidebarWrapper>
  );
};

const mapStateToProps = state => ({
  members: state.taskListState.tasklistmembers,
});

const mapDispachToProps = dispatch => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
});

export default connect(mapStateToProps, mapDispachToProps)(DashboardSidebar);
