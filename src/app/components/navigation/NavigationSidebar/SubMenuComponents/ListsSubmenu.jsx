import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { listsSelector } from 'selectors/task-list-selectors';
import { pendingListsSelector } from 'selectors/invitation-selectors';
import { openModal, closeModal } from 'modal/actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as InvitationActions from 'actions/invitation-actions';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
import palette from 'styles/palette';
import { locationParametersSelector } from 'location/selectors';
import {
  DrawerMyListsLabel,
  DrawerListsList,
  DrawerListsItem,
  RolloverPopover,
  RolloverPopoverLabel,
  DrawerAddButton,
  DrawerItemOptions,
  DrawerListsItemNewLabel,
  DrawerListsNewLabel,
  ListNameText,
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const PRIVILEGE_ROLES = [...MASTER_ROLES, 'MEMBER'];

const ListsSubmenu = () => {
  const history = useHistory();
  const { taskListIdentifier: activeTaskListIdentifier } = useSelector(
    locationParametersSelector,
  );
  const activeLists = useSelector(listsSelector);
  const pendingLists = useSelector(pendingListsSelector);

  const dispatch = useDispatch();

  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);
  const [listMenuPopupOpen, setListMenuPopupOpen] = useState(false);
  const [currentList, setCurrentList] = useState([]);
  const itemsMoreButtonReferences = useRef([]);
  const [
    currentListMenuPopupReference,
    setCurrentListMenuPopupReference,
  ] = useState(false);

  useEffect(() => {
    if (!listMenuPopupOpen && currentList?.length > 0) {
      setCurrentList([]);
    }
  }, [listMenuPopupOpen, currentList]);

  const lists = useMemo(() => [...activeLists, ...pendingLists], [
    activeLists,
    pendingLists,
  ]);

  useEffect(() => {
    if (lists?.length === 0) {
      dispatch(TaskListActions.getTaskListForUser());
      dispatch(InvitationActions.findPendingTaskListsForUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openListMenuPopover = (list, indexOnList) => {
    setCurrentListMenuPopupReference({
      current: itemsMoreButtonReferences.current[indexOnList],
    });
    setCurrentList(list);
    setListMenuPopupOpen(true);
  };

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
  };

  const openListEditModal = useCallback(
    list => {
      dispatch(openModal('ListForm', { list }));
    },
    [dispatch],
  );

  const openInviteToListModal = useCallback(
    list => {
      dispatch(openModal('InviteToList', { list }));
    },
    [dispatch],
  );

  const openDeleteConfirmationModal = useCallback(
    list => {
      const modalProps = {
        confirm: () => {
          dispatch(
            TaskListActions.deleteTaskListById(list?.taskListIdentifier),
          );
          dispatch(closeModal());
        },
      };
      dispatch(openModal('DeleteList', modalProps));
    },
    [dispatch],
  );

  const openLeaveListModal = useCallback(
    list => {
      const { status, taskListIdentifier } = list;

      const modalProps = {
        confirm: () => {
          if (status === 'PENDING') {
            dispatch(InvitationActions.rejectInviteToTaskList(list));
          } else {
            dispatch(TaskListActions.leaveList(taskListIdentifier));
          }
          dispatch(closeModal());
        },
      };

      dispatch(openModal('LeaveList', modalProps));
    },
    [dispatch],
  );

  const getMenuItems = useCallback(
    list => {
      let baseList = [
        {
          key: 'leave',
          label: 'Leave list',
          onClick: () => openLeaveListModal(list),
        },
      ];

      if (PRIVILEGE_ROLES.includes(list?.role)) {
        baseList = [
          ...baseList,
          {
            key: 'invite',
            button: true,
            label: 'Invite to list',
            onClick: () => openInviteToListModal(list),
          },
        ];

        if (MASTER_ROLES.includes(list?.role)) {
          baseList = [
            ...baseList,
            {
              key: 'edit',
              label: 'Edit list',
              onClick: () => openListEditModal(list),
            },
            {
              key: 'delete',
              label: 'Delete',
              onClick: () => {
                openDeleteConfirmationModal(list);
              },
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
        <DrawerAddButton onClick={openListAddModal}>
          <span>+</span> Add
        </DrawerAddButton>
      </DrawerMyListsLabel>
      {hasAnyPendingList && (
        <DrawerListsNewLabel>Hooray you have a new list!</DrawerListsNewLabel>
      )}
      <DrawerListsList>
        {lists?.map((list, index) => (
          <DrawerListsItem
            key={list.taskListIdentifier}
            data-list-id={list.taskListIdentifier}
            className={
              list.listType === 'INBOX'
                ? 'drawer-menu-list-inbox'
                : `drawer-menu-list-item`
            }
          >
            <ListNameText
              isActive={activeTaskListIdentifier === list?.taskListIdentifier}
              onMouseEnter={event => handleMouseEnter(event, list?.listName)}
              onMouseLeave={() => setPopoverLabel(null)}
              onClick={() => {
                if (activeTaskListIdentifier === list?.taskListIdentifier)
                  return;

                if (list?.status === 'PENDING') {
                  dispatch(InvitationActions.acceptInviteToTaskList(list));
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
              <IconButton
                ref={element => {
                  if (element)
                    itemsMoreButtonReferences.current[index] = element;
                }}
                size="small"
                color={palette.coolGrey1}
                onClick={() => {
                  openListMenuPopover(list, index);
                }}
              >
                <MoreVert style={{ color: palette.coolGrey1 }} />
              </IconButton>
            </DrawerItemOptions>
          </DrawerListsItem>
        ))}
        <MenuPopover
          anchorEl={currentListMenuPopupReference?.current}
          open={listMenuPopupOpen}
          onClose={() => setListMenuPopupOpen(false)}
          onAfterOptionClick={() => setListMenuPopupOpen(false)}
          options={getMenuItems(currentList)}
          itemType="secondary"
        />
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
