import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
} from 'selectors/task-list-selectors';
import AddButton from 'components/common/AddButton/AddButton.tsx';
import { openModal, closeModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import palette from 'styles/palette';
import { locationParametersSelector } from 'location/selectors';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
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
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const PRIVILEGE_ROLES = [...MASTER_ROLES, 'MEMBER'];

const ListsSubmenu = () => {
  const history = useHistory();
  const { taskListIdentifier: activeTaskListIdentifier } = useSelector(
    locationParametersSelector,
  );
  const taskLists = useSelector(taskListsSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);

  const dispatch = useDispatch();

  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);

  const lists = useMemo(
    () => [...(taskLists || []), ...(pendingTaskLists || [])],
    [taskLists, pendingTaskLists],
  );

  useEffect(() => {
    dispatch(TaskListActions.getTaskListForUser());
    dispatch(TaskListActions.getPendingTaskListsForUser());
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
        baseList = [
          ...baseList,
          {
            key: 'invite',
            button: true,
            name: 'Invite to list',
            onClick: () => openInviteToListModal(list),
          },
        ];

        if (MASTER_ROLES.includes(list?.role) && list?.listType !== 'INBOX') {
          baseList = [
            ...baseList,
            {
              key: 'edit',
              name: 'Edit list',
              onClick: () => openListEditModal(list),
            },
            {
              key: 'delete',
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
      openInviteToListModal,
      openLeaveListModal,
      openListEditModal,
      openDeleteConfirmationModal,
    ],
  );

  const hasAnyPendingList = lists.some(({ status }) => status === 'PENDING');

  return (
    <>
      <DrawerMyListsLabel>
        <div>My Lists </div>
        <AddButton onClick={openListAddModal}>Add</AddButton>
      </DrawerMyListsLabel>
      <SubmenuDivider />
      {hasAnyPendingList && (
        <DrawerListsNewLabel>Hooray you have a new list!</DrawerListsNewLabel>
      )}
      <DrawerListsList>
        {lists?.map((list, index) => (
          <DrawerListsItem
            // eslint-disable-next-line react/no-array-index-key
            key={`listsubmenu_${list.taskListIdentifier}_${index}`}
            data-list-id={list.taskListIdentifier}
            className={
              list.listType === 'INBOX'
                ? 'drawer-menu-list-inbox'
                : `drawer-menu-list-item`
            }
          >
            {list.hasUpdatesForMember && <UpdatesForMemberIndicator />}
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
            {list?.status === 'PENDING' && (
              <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
            )}
            <DrawerItemOptions>
              <div>{list?.numberOfTasks ? list?.numberOfTasks : 0}</div>
              <OptionsMenu disablePortal options={getMenuItems(list)}>
                <MoreVert style={{ color: palette.coolGrey1 }} />
              </OptionsMenu>
            </DrawerItemOptions>
          </DrawerListsItem>
        ))}
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
    </>
  );
};

export default ListsSubmenu;
