import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { MoreVert } from '@material-ui/icons';
import {
  onTaskListDeleted,
  onTaskListInvitationAccepted,
  onTaskListInvitationRejected,
  onTaskListLeave,
} from 'helpers/ga-event-helper';
import {
  taskListsSelector,
  pendingTaskListsSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import AddButton from 'components/common/AddButton/AddButton.tsx';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import palette from 'styles/palette';
import { TASK_LIST_PATH } from 'routing/helpers/paths';
import { locationParametersSelector } from 'location/selectors';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import { Box } from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import Spacing from 'components/common/Spacing';
import {
  SubmenuDivider,
  DrawerListsList,
  DrawerListsItem,
  RolloverPopover,
  RolloverPopoverLabel,
  DrawerItemOptions,
  DrawerListsItemNewLabel,
  DrawerListsNewLabel,
  ListNameText,
  UpdatesForMemberIndicator,
  DrawerMyListsLabel,
  GreyedOutListNameText,
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const PRIVILEGE_ROLES = [...MASTER_ROLES, 'MEMBER'];

// eslint-disable-next-line sonarjs/cognitive-complexity
const ListsSubmenu = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const { taskListIdentifier: taskListIdentifierParameter } = useSelector(
    locationParametersSelector,
  );
  const activeTaskListIdentifier = pathname?.startsWith(TASK_LIST_PATH)
    ? taskListIdentifierParameter
    : null;
  const taskLists = useSelector(taskListsSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);
  const archivedTaskLists = useSelector(archivedTaskListsSelector);

  const dispatch = useDispatch();

  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);
  const { 0: archivedVisible, 3: toggleArchived } = useBoolean(false);
  // const [listMenuPopupOpen, setListMenuPopupOpen] = useState(false);
  // const [currentList, setCurrentList] = useState([]);
  // const itemsMoreButtonReferences = useRef([]);
  // const [
  //   currentListMenuPopupReference,
  //   setCurrentListMenuPopupReference,
  // ] = useState(false);

  const { orgUserRole } = useSelector(userProfileSelector);
  const isGuest = orgUserRole === 'GUEST';

  // useEffect(() => {
  //   if (!listMenuPopupOpen && currentList?.length > 0) {
  //     setCurrentList([]);
  //   }
  // }, [listMenuPopupOpen, currentList]);

  const activeLists = useMemo(
    () => [...(taskLists || []), ...(pendingTaskLists || [])],
    [taskLists, pendingTaskLists],
  );

  const archivedLists = useMemo(() => [...(archivedTaskLists || [])], [
    archivedTaskLists,
  ]);

  useEffect(() => {
    dispatch(TaskListActions.getTaskListForUser());
    dispatch(TaskListActions.getPendingTaskListsForUser());
    dispatch(TaskListActions.getArchivedTaskListForUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = (event, listName) => {
    const { target } = event;
    const { scrollWidth, offsetWidth } = target;

    if (scrollWidth > offsetWidth) {
      hoveredItemReference.current = target;
      setPopoverLabel(listName);
    }
  };

  const openListAddModal = () => {
    dispatch(openModal('ListForm'));
    dispatch(hideSubMenu());
  };

  const openListEditModal = useCallback(
    list => {
      dispatch(openModal('ListForm', { list }));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const openInviteToListModal = useCallback(
    list => {
      dispatch(openModal('InviteToList', { list }));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const openDeleteConfirmationModal = useCallback(
    list => {
      const modalProps = {
        confirm: () => {
          onTaskListDeleted();
          dispatch(
            TaskListActions.deleteTaskListById(list?.taskListIdentifier),
          );
          if (list?.taskListIdentifier === activeTaskListIdentifier) {
            history.push(`/`);
          }
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteList', modalProps));
      dispatch(hideSubMenu());
    },
    [activeTaskListIdentifier, dispatch, history],
  );

  const openLeaveListModal = useCallback(
    list => {
      const { status, taskListIdentifier } = list;

      const modalProps = {
        confirm: () => {
          if (status === 'PENDING') {
            onTaskListInvitationRejected();
            dispatch(TaskListActions.rejectInviteToTaskList(list));
          } else {
            onTaskListLeave();
            dispatch(TaskListActions.leaveList(taskListIdentifier));
          }
          dispatch(closeModal());
        },
      };

      dispatch(openModal('LeaveList', modalProps));
      dispatch(hideSubMenu());
    },
    [dispatch],
  );

  const isListArchived = useCallback(
    list => {
      return !!archivedLists.find(
        taskList => taskList.taskListIdentifier === list.taskListIdentifier,
      );
    },
    [archivedLists],
  );

  const handleArchiveList = useCallback(
    list => {
      dispatch(TaskListActions.archiveTaskListById(list?.taskListIdentifier));
      if (list?.taskListIdentifier === activeTaskListIdentifier)
        history.push(`/`);
    },
    [activeTaskListIdentifier, dispatch, history],
  );

  const handleUnarchiveList = useCallback(
    list => {
      dispatch(TaskListActions.unarchiveTaskListById(list?.taskListIdentifier));
    },
    [dispatch],
  );

  const getMenuItems = useCallback(
    list => {
      let baseList = [];
      if (list?.listType !== 'INBOX' && list?.listType !== 'PUBLIC') {
        baseList = [
          ...baseList,
          {
            key: 'leave',
            name: 'Leave list',
            onClick: () => openLeaveListModal(list),
          },
        ];
      }

      if (PRIVILEGE_ROLES.includes(list?.role) && list?.listType !== 'INBOX') {
        if (!isGuest) {
          baseList = [
            ...baseList,
            {
              name: 'Invite to list',
              onClick: () => openInviteToListModal(list),
            },
          ];
        }

        if (MASTER_ROLES.includes(list?.role) && list?.listType !== 'INBOX') {
          baseList = [
            ...baseList,
            {
              name: 'Edit list',
              onClick: () => openListEditModal(list),
            },
          ];
        }

        if (MASTER_ROLES.includes(list?.role) && !isListArchived(list)) {
          baseList = [
            ...baseList,
            {
              name: 'Archive List',
              onClick: () => {
                handleArchiveList(list);
              },
            },
          ];
        }
        if (MASTER_ROLES.includes(list?.role) && isListArchived(list)) {
          baseList = [
            ...baseList,
            {
              name: 'Unarchive List',
              onClick: () => {
                handleUnarchiveList(list);
              },
            },
          ];
        }
        if (MASTER_ROLES.includes(list?.role) && list?.listType !== 'INBOX') {
          baseList = [
            ...baseList,
            {
              name: 'Delete',
              onClick: () => {
                openDeleteConfirmationModal(list);
              },
              color: palette.oPlusRed,
            },
          ];
        }
      }

      return baseList;
    },
    [
      openLeaveListModal,
      isGuest,
      isListArchived,
      openInviteToListModal,
      openListEditModal,
      handleArchiveList,
      handleUnarchiveList,
      openDeleteConfirmationModal,
    ],
  );

  const hasAnyPendingList = activeLists.some(
    ({ status }) => status === 'PENDING',
  );

  const renderLists = useCallback(
    (listsList, archived = true) => {
      return listsList?.map(list => (
        <DrawerListsItem
          key={`listsubmenu_${list.taskListIdentifier}`}
          data-list-id={list.taskListIdentifier}
          className={
            list.listType === 'INBOX'
              ? 'drawer-menu-list-inbox'
              : `drawer-menu-list-item`
          }
        >
          {list.hasUpdatesForMember && <UpdatesForMemberIndicator />}
          {!archived ? (
            <ListNameText
              isActive={activeTaskListIdentifier === list?.taskListIdentifier}
              onMouseEnter={event => handleMouseEnter(event, list?.listName)}
              onMouseLeave={() => setPopoverLabel(null)}
              onClick={() => {
                if (activeTaskListIdentifier === list?.taskListIdentifier)
                  return;

                if (list?.status === 'PENDING') {
                  onTaskListInvitationAccepted();
                  dispatch(TaskListActions.acceptInviteToTaskList(list));
                }
                history.push(`/tasks/${list.taskListIdentifier}`);
              }}
            >
              {list?.listName}
            </ListNameText>
          ) : (
            <GreyedOutListNameText
              isActive={activeTaskListIdentifier === list?.taskListIdentifier}
              onMouseEnter={event => handleMouseEnter(event, list?.listName)}
              onMouseLeave={() => setPopoverLabel(null)}
              // eslint-disable-next-line sonarjs/no-identical-functions
              onClick={() => {
                if (activeTaskListIdentifier === list?.taskListIdentifier)
                  return;
                if (list?.status === 'PENDING') {
                  onTaskListInvitationAccepted();
                  dispatch(TaskListActions.acceptInviteToTaskList(list));
                }
                history.push(`/tasks/${list.taskListIdentifier}`);
              }}
            >
              {list?.listName}
            </GreyedOutListNameText>
          )}
          {list?.status === 'PENDING' && (
            <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
          )}
          <DrawerItemOptions>
            <div>{list?.numberOfTasks ? list?.numberOfTasks : 0}</div>
            {!['INBOX', 'PUBLIC'].includes(list?.listType) ? (
              <OptionsMenu disablePortal options={getMenuItems(list)}>
                <MoreVert color="primary" />
              </OptionsMenu>
            ) : (
              <Box m={2} />
            )}
          </DrawerItemOptions>
        </DrawerListsItem>
      ));
    },
    [activeTaskListIdentifier, dispatch, getMenuItems, history],
  );

  return (
    <>
      <DrawerMyListsLabel>
        <div>My Lists</div>
        {!isGuest && <AddButton onClick={openListAddModal}>Add</AddButton>}
      </DrawerMyListsLabel>
      <SubmenuDivider />
      {hasAnyPendingList && (
        <DrawerListsNewLabel>Hooray you have a new list!</DrawerListsNewLabel>
      )}
      <DrawerListsList>
        {renderLists(activeLists, false)}
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
      </DrawerListsList>
      <Spacing vertical={3} />
      <LabeledCollapse
        name="Archived Lists"
        isOpened={archivedVisible}
        onClick={toggleArchived}
        noBorder
      >
        {renderLists(archivedLists, true)}
      </LabeledCollapse>
    </>
  );
};

export default ListsSubmenu;
