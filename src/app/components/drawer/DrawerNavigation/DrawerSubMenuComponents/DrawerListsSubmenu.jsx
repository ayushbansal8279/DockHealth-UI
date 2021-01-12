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
import { openModal, closeModal } from 'modal/actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as InvitationActions from 'actions/invitation-actions';
import MenuPopover from 'components/common/MenuPopover/MenuPopover';
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
} from './styled';

const MASTER_ROLES = ['ADMIN', 'OWNER'];
const PRIVILEGE_ROLES = [...MASTER_ROLES, 'MEMBER'];

const MAX_LABEL_LENGTH = 24;

const DrawerListsSubmenu = () => {
  const history = useHistory();
  const { activeLists, pendingLists } = useSelector(store => ({
    activeLists: listsSelector(store),
    pendingLists: store.invitationState.pendingTasklists,
  }));
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

  const openListMenuPopover = (list, indexOnList) => {
    setCurrentListMenuPopupReference({
      current: itemsMoreButtonReferences.current[indexOnList],
    });
    setCurrentList(list);
    setListMenuPopupOpen(true);
  };

  const handleMouseEnter = (event, listName) => {
    const { target } = event;

    if (listName?.length > MAX_LABEL_LENGTH) {
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
          <DrawerListsItem>
            <div
              onMouseEnter={event => handleMouseEnter(event, list?.listName)}
              onMouseLeave={() => setPopoverLabel(null)}
              onClick={() => {
                if (list?.status === 'PENDING') {
                  dispatch(InvitationActions.acceptInviteToTaskList(list));
                }
                history.push(`/tasks/${list.taskListIdentifier}`);
              }}
            >
              {list?.listName?.length > MAX_LABEL_LENGTH
                ? `${list.listName?.slice(0, 21)}...`
                : list?.listName}
            </div>
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
                color="secondary"
                onClick={() => {
                  openListMenuPopover(list, index);
                }}
              >
                <MoreVert />
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

export default DrawerListsSubmenu;
