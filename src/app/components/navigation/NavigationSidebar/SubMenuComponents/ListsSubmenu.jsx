import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MoreVert } from '@mui/icons-material';
import { onTaskListInvitationAccepted } from 'helpers/ga-event-helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  currentTaskListIdentifierSelector,
  taskListsSelector,
  pendingTaskListsSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import AddButton from 'components/common/AddButton/AddButton';
import { openModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import palette from 'styles/palette';
import { createTaskListPath } from 'routing/helpers/paths';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import {
  isUserGuest,
  isUserViewOnly,
  checkIfUserIsOrganizationAdmin,
} from 'helpers/user-helper';
import { Box } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import move from 'ramda/src/move';
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
  DrawerListsItemLoader,
  ColorIndicator,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ListsSubmenu = () => {
  const history = useHistory();

  const activeTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const taskLists = useSelector(taskListsSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);
  const archivedTaskLists = useSelector(archivedTaskListsSelector);

  const dispatch = useDispatch();

  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);
  const { 0: archivedVisible, 3: toggleArchived } = useBoolean(false);

  const currentUser = useSelector(userProfileSelector);
  const isGuest = isUserGuest(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);
  const isAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const [activeLists, setActiveLists] = useState(null);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'list.add.adminonly.enabled',
    ) || {};
  const listAddAdminOnly = quickAddPatientEnabledItem?.value === 'true';

  useEffect(() => {
    const lists =
      taskLists && pendingTaskLists
        ? [...taskLists, ...pendingTaskLists]
        : null;
    setActiveLists(lists);
  }, [taskLists, pendingTaskLists]);

  const archivedLists = useMemo(
    () => [...(archivedTaskLists || [])],
    [archivedTaskLists],
  );

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

  const handleDragEnd = useCallback(
    ({ destination, source }) => {
      const reorderedLists = move(source.index, destination.index, activeLists);
      setActiveLists(reorderedLists);
      dispatch(TaskListActions.reorderTaskLists(reorderedLists));
    },
    [activeLists, dispatch],
  );

  const openListAddModal = () => {
    dispatch(openModal('ListForm'));
    dispatch(hideSubMenu());
  };

  const hasAnyPendingList = activeLists?.some(
    ({ status }) => status === 'PENDING',
  );

  const renderLists = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (listsList, archived = true) => {
      if (archived) {
        return listsList
          ? listsList.map((list) => (
              <DrawerListsItem
                key={`listsubmenu_${list.taskListIdentifier}`}
                data-list-id={list.taskListIdentifier}
                className="drawer-menu-list-item"
              >
                <ListOptionsMenu list={list}>
                  <MoreVert color="primary" />
                </ListOptionsMenu>
                {list.color && (
                  <Box mr={1}>
                    <ColorIndicator color={list.color} />
                  </Box>
                )}
                <ListNameText
                  color={archived ? palette.coolGrey2 : undefined}
                  isActive={
                    activeTaskListIdentifier === list?.taskListIdentifier
                  }
                  onMouseEnter={(event) =>
                    handleMouseEnter(event, list?.listName)
                  }
                  onMouseLeave={() => setPopoverLabel(null)}
                  onClick={() => {
                    if (activeTaskListIdentifier === list?.taskListIdentifier)
                      return;

                    if (list?.status === 'PENDING') {
                      onTaskListInvitationAccepted();
                      dispatch(TaskListActions.acceptInviteToTaskList(list));
                    }
                    history.push(createTaskListPath(list.taskListIdentifier));
                  }}
                >
                  {list?.listName}
                </ListNameText>
                {list?.status === 'PENDING' && (
                  <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
                )}
                <DrawerItemOptions>
                  <div>{list?.numberOfTasks ?? 0}</div>
                  {list.hasUpdatesForMember ? (
                    <Box m=" 0 5px">
                      <UpdatesForMemberIndicator />
                    </Box>
                  ) : (
                    <Box m={1} />
                  )}
                </DrawerItemOptions>
              </DrawerListsItem>
            ))
          : Array.from({ length: 6 })
              .fill()
              // eslint-disable-next-line react/no-array-index-key
              .map((_, index) => <DrawerListsItemLoader key={index} />);
      }

      return listsList
        ? listsList.map((list, index) => {
            if (list.listType === 'INBOX' || list.listType === 'PUBLIC') {
              return (
                <DrawerListsItem
                  key={`listsubmenu_${list.taskListIdentifier}`}
                  data-list-id={list.taskListIdentifier}
                  className={
                    list.listType === 'INBOX'
                      ? 'drawer-menu-list-inbox'
                      : `drawer-menu-list-item`
                  }
                >
                  {['INBOX', 'PUBLIC'].includes(list?.listType) ? (
                    <Box m={2} />
                  ) : (
                    <ListOptionsMenu list={list}>
                      <MoreVert color="primary" />
                    </ListOptionsMenu>
                  )}
                  {list.color && (
                    <Box mr={1}>
                      <ColorIndicator color={list.color} />
                    </Box>
                  )}
                  <ListNameText
                    color={archived ? palette.coolGrey2 : undefined}
                    isActive={
                      activeTaskListIdentifier === list?.taskListIdentifier
                    }
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, list?.listName)
                    }
                    onMouseLeave={() => setPopoverLabel(null)}
                    // eslint-disable-next-line sonarjs/no-identical-functions
                    onClick={() => {
                      if (activeTaskListIdentifier === list?.taskListIdentifier)
                        return;

                      if (list?.status === 'PENDING') {
                        onTaskListInvitationAccepted();
                        dispatch(TaskListActions.acceptInviteToTaskList(list));
                      }
                      history.push(createTaskListPath(list.taskListIdentifier));
                    }}
                  >
                    {list?.listName}
                  </ListNameText>
                  {list?.status === 'PENDING' && (
                    <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
                  )}
                  <DrawerItemOptions>
                    <div>{list?.numberOfTasks ?? 0}</div>
                    {list.hasUpdatesForMember ? (
                      <Box m=" 0 5px">
                        <UpdatesForMemberIndicator />
                      </Box>
                    ) : (
                      <Box m={1} />
                    )}
                  </DrawerItemOptions>
                </DrawerListsItem>
              );
            }
            return (
              <Draggable
                key={list.taskListIdentifier}
                draggableId={list.taskListIdentifier}
                index={index}
              >
                {(provided) => (
                  <DrawerListsItem
                    key={`listsubmenu_${list.taskListIdentifier}`}
                    data-list-id={list.taskListIdentifier}
                    className={
                      list.listType === 'INBOX'
                        ? 'drawer-menu-list-inbox'
                        : `drawer-menu-list-item`
                    }
                    isDraggable
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {['INBOX', 'PUBLIC'].includes(list?.listType) ? (
                      <Box m={2} />
                    ) : (
                      <ListOptionsMenu list={list}>
                        <MoreVert color="primary" />
                      </ListOptionsMenu>
                    )}
                    {list.color && (
                      <Box mr={1}>
                        <ColorIndicator color={list.color} />
                      </Box>
                    )}
                    <ListNameText
                      color={archived ? palette.coolGrey2 : undefined}
                      isActive={
                        activeTaskListIdentifier === list?.taskListIdentifier
                      }
                      onMouseEnter={(event) =>
                        handleMouseEnter(event, list?.listName)
                      }
                      onMouseLeave={() => setPopoverLabel(null)}
                      // eslint-disable-next-line sonarjs/no-identical-functions
                      onClick={() => {
                        if (
                          activeTaskListIdentifier === list?.taskListIdentifier
                        )
                          return;

                        if (list?.status === 'PENDING') {
                          onTaskListInvitationAccepted();
                          dispatch(
                            TaskListActions.acceptInviteToTaskList(list),
                          );
                        }
                        history.push(
                          createTaskListPath(list.taskListIdentifier),
                        );
                      }}
                    >
                      {list?.listName}
                    </ListNameText>
                    {list?.status === 'PENDING' && (
                      <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
                    )}
                    <DrawerItemOptions>
                      <div>{list?.numberOfTasks ?? 0}</div>
                      {list.hasUpdatesForMember ? (
                        <Box m=" 0 5px">
                          <UpdatesForMemberIndicator />
                        </Box>
                      ) : (
                        <Box m={1} />
                      )}
                    </DrawerItemOptions>
                  </DrawerListsItem>
                )}
              </Draggable>
            );
          })
        : Array.from({ length: 6 })
            .fill()
            // eslint-disable-next-line react/no-array-index-key
            .map((_, index) => <DrawerListsItemLoader key={index} />);
    },
    [activeTaskListIdentifier, dispatch, history],
  );

  return (
    <>
      <DrawerMyListsLabel>
        <div>My Lists</div>
        {!isGuest &&
          !isViewOnly &&
          (!listAddAdminOnly || (listAddAdminOnly && isAdmin)) && (
            <AddButton onClick={openListAddModal}>Add</AddButton>
          )}
      </DrawerMyListsLabel>
      <SubmenuDivider />
      {hasAnyPendingList && (
        <DrawerListsNewLabel>Hooray you have a new list!</DrawerListsNewLabel>
      )}
      <DrawerListsList>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {renderLists(activeLists, false)}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
