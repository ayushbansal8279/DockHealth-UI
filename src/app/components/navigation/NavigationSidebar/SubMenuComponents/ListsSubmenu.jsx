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
import AddIcon from '@mui/icons-material/Add';
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
import { Box, Collapse } from '@mui/material';
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
  MenuWrapper,
  ListNameLabel,
} from './styled';
import {
  NumericalBadgeContainer,
  TaskCount,
} from '@/app/views/dashboard/DashboardList/styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import RotatableChevron from '@/app/components/common/RotatableChevron/RotatableChevron';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';

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
  const [myLists, setMyLists] = useState([]);
  const [orgLevelLists, setOrgLevelLists] = useState([]);
  const { 0: orgListsVisible, 3: toggleOrgLists } = useBoolean(true);
  const { 0: archivedVisible, 3: toggleArchived } = useBoolean(false);
  const { 0: myListsVisible, 3: toggleMyLists } = useBoolean(true);

  const currentUser = useSelector(userProfileSelector);
  const isGuest = isUserGuest(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);
  const isAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  // const [activeLists, setActiveLists] = useState(null);

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
    const myLevelLists = lists?.filter(
      (list) => list.listType !== 'INBOX' && list.listType !== 'PUBLIC',
    );
    const orgLists = lists?.filter(
      (list) => list.listType === 'INBOX' || list.listType === 'PUBLIC',
    );
    // setActiveLists(lists);
    setMyLists(myLevelLists);
    setOrgLevelLists(orgLists);
  }, [taskLists, pendingTaskLists]);

  const [isOverflowing, setIsOverflowing] = useState(false);

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
      setIsOverflowing(true);
    }
  };

  const handleDragEnd = useCallback(
    ({ destination, source }) => {
      const reorderedLists = move(source.index, destination.index, myLists);
      setMyLists(reorderedLists);
      dispatch(TaskListActions.reorderTaskLists(reorderedLists));
    },
    [myLists, dispatch],
  );

  const openListAddModal = () => {
    dispatch(openModal('ListForm'));
    dispatch(hideSubMenu());
  };

  const hasAnyPendingList = myLists?.some(({ status }) => status === 'PENDING');

  const renderLists = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (listsList, archived = true, isTextOverflowing) => {
      if (archived) {
        return listsList
          ? listsList.map((list) => (
              <DrawerListsItem
                key={`listsubmenu_${list.taskListIdentifier}`}
                data-list-id={list.taskListIdentifier}
                className="drawer-menu-list-item"
                isListSubMenu
              >
                <ListOptionsMenu list={list}>
                  <MoreVert color="primary" />
                </ListOptionsMenu>
                {list.color && (
                  <Box mr={1}>
                    <ColorIndicator color={list.color} />
                  </Box>
                )}
                <Tooltip
                  placement="top"
                  title={isTextOverflowing ? list?.listName : ''}
                >
                  <ListNameText
                    color={archived ? palette.coolGrey2 : undefined}
                    isActive={
                      activeTaskListIdentifier === list?.taskListIdentifier
                    }
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, list?.listName)
                    }
                    onMouseLeave={() => setIsOverflowing(false)}
                    onClick={() => {
                      if (activeTaskListIdentifier === list?.taskListIdentifier)
                        return;

                      if (list?.status === 'PENDING') {
                        onTaskListInvitationAccepted();
                        dispatch(TaskListActions.acceptInviteToTaskList(list));
                      }
                      history.push(createTaskListPath(list.taskListIdentifier));
                    }}
                    isListSubMenu
                  >
                    <ListNameLabel
                      isNewList={
                        list.hasUpdatesForMember || list?.status === 'PENDING'
                      }
                    >
                      {list?.listName}
                    </ListNameLabel>
                  </ListNameText>
                </Tooltip>
                <DrawerItemOptions>
                  <div>
                    <NumericalBadgeContainer
                      areNewTasksAdded={
                        list.hasUpdatesForMember || list?.status === 'PENDING'
                      }
                    >
                      <TaskCount
                        areNewTasksAdded={
                          list.hasUpdatesForMember || list?.status === 'PENDING'
                        }
                      >
                        {list?.numberOfTasks ?? 0}
                      </TaskCount>
                    </NumericalBadgeContainer>
                  </div>
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
                  isListSubMenu
                >
                  <Box ml={1} />
                  {['INBOX', 'PUBLIC'].includes(list?.listType) ? (
                    <Box ml={2} />
                  ) : (
                    <MenuWrapper>
                      <ListOptionsMenu list={list}>
                        <MoreVert color="primary" />
                      </ListOptionsMenu>
                    </MenuWrapper>
                  )}
                  {list.color && (
                    <Box mr={2}>
                      <ColorIndicator color={list.color} />
                    </Box>
                  )}
                  <Tooltip
                    placement="top"
                    title={isTextOverflowing ? list?.listName : ''}
                  >
                    <ListNameText
                      color={archived ? palette.coolGrey2 : undefined}
                      isActive={
                        activeTaskListIdentifier === list?.taskListIdentifier
                      }
                      onMouseEnter={(event) =>
                        handleMouseEnter(event, list?.listName)
                      }
                      onMouseLeave={() => setIsOverflowing(false)}
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
                      isListSubMenu
                    >
                      <ListNameLabel
                        isNewList={
                          list.hasUpdatesForMember || list?.status === 'PENDING'
                        }
                      >
                        {list?.listName}
                      </ListNameLabel>
                    </ListNameText>
                  </Tooltip>
                  <DrawerItemOptions>
                    <div>
                      <NumericalBadgeContainer
                        areNewTasksAdded={
                          list.hasUpdatesForMember || list?.status === 'PENDING'
                        }
                      >
                        <TaskCount
                          areNewTasksAdded={
                            list.hasUpdatesForMember ||
                            list?.status === 'PENDING'
                          }
                        >
                          {list?.numberOfTasks ?? 0}
                        </TaskCount>
                      </NumericalBadgeContainer>
                    </div>
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
                {(provided, snapshot) => (
                  <DrawerListsItem
                    key={`listsubmenu_${list.taskListIdentifier}`}
                    data-list-id={list.taskListIdentifier}
                    className={
                      list.listType === 'INBOX'
                        ? 'drawer-menu-list-inbox'
                        : `drawer-menu-list-item`
                    }
                    isListSubMenu
                    isDraggable
                    isDragging={snapshot?.isDragging}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Box ml={1} />
                    {['INBOX', 'PUBLIC'].includes(list?.listType) ? (
                      <Box ml={3} />
                    ) : (
                      <MenuWrapper>
                        <ListOptionsMenu list={list}>
                          <MoreVert color="primary" />
                        </ListOptionsMenu>
                      </MenuWrapper>
                    )}
                    {list.color && (
                      <Box mr={1}>
                        <ColorIndicator color={list.color} />
                      </Box>
                    )}
                    <Tooltip
                      placement="top"
                      title={isTextOverflowing ? list?.listName : ''}
                    >
                      <ListNameText
                        color={archived ? palette.coolGrey2 : undefined}
                        isActive={
                          activeTaskListIdentifier === list?.taskListIdentifier
                        }
                        onMouseEnter={(event) =>
                          handleMouseEnter(event, list?.listName)
                        }
                        onMouseLeave={() => setIsOverflowing(false)}
                        // eslint-disable-next-line sonarjs/no-identical-functions
                        onClick={() => {
                          if (
                            activeTaskListIdentifier ===
                            list?.taskListIdentifier
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
                        isListSubMenu
                      >
                        <ListNameLabel
                          isNewList={
                            list.hasUpdatesForMember ||
                            list?.status === 'PENDING'
                          }
                        >
                          {list?.listName}
                        </ListNameLabel>
                      </ListNameText>
                    </Tooltip>
                    <DrawerItemOptions>
                      <div style={{ marginRight: '9px' }}>
                        <NumericalBadgeContainer
                          areNewTasksAdded={
                            list.hasUpdatesForMember ||
                            list?.status === 'PENDING'
                          }
                        >
                          <TaskCount
                            areNewTasksAdded={
                              list.hasUpdatesForMember ||
                              list?.status === 'PENDING'
                            }
                          >
                            {list?.numberOfTasks ?? 0}
                          </TaskCount>
                        </NumericalBadgeContainer>
                      </div>
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
      {/* <DrawerMyListsLabel>
        <div style={{ marginLeft: '-10px' }}>
          <ArrowDropUpIcon sx={{ color: palette.shadowBlue }} />
        </div>
        <div style={{ marginRight: '65px' }}>My Lists</div>
        {!isGuest &&
          !isViewOnly &&
          (!listAddAdminOnly || (listAddAdminOnly && isAdmin)) && (
            <AddButton onClick={openListAddModal}>Add a List</AddButton>
          )}
      </DrawerMyListsLabel> */}
      <LabeledCollapse
        name="Org Level Lists"
        isOpened={orgListsVisible}
        onClick={toggleOrgLists}
        noBorder
        isListSubMenu
      >
        <div
          style={{
            borderBottom: `1px solid ${palette.whiteSmoke}`,
            paddingBottom: '20px',
          }}
        >
          {renderLists(orgLevelLists, false, isOverflowing)}
        </div>
      </LabeledCollapse>
      {/* <Spacing vertical={3} /> */}
      <DrawerMyListsLabel isListSubMenu isOpen={myListsVisible}>
        <div style={{ marginLeft: '-3px' }} onClick={toggleMyLists}>
          <RotatableChevron color={palette.darkGrey} rotated={myListsVisible} />
        </div>
        <div style={{ marginRight: '65px' }}>My Lists</div>
        {!isGuest &&
          !isViewOnly &&
          (!listAddAdminOnly || (listAddAdminOnly && isAdmin)) && (
            <div style={{ marginRight: '-2px' }}>
              <ToolbarButton
                icon={
                  <span style={{ marginLeft: '-5px' }}>
                    <AddIcon />
                  </span>
                }
                onClick={openListAddModal}
              >
                <span style={{ marginLeft: '-5px' }}>Add a List</span>
              </ToolbarButton>
            </div>
          )}
      </DrawerMyListsLabel>
      <DrawerListsList isListSubMenu isOpen={myListsVisible}>
        <Collapse in={myListsVisible}>
          {hasAnyPendingList && (
            <DrawerListsNewLabel>
              Hooray you have a new list!
            </DrawerListsNewLabel>
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {renderLists(myLists, false, isOverflowing)}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Collapse>
      </DrawerListsList>
      {/* <RolloverPopover
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
        </RolloverPopover> */}
      {/* </LabeledCollapse>
      </DrawerListsList>  */}
      <Spacing vertical={myListsVisible ? 4 : 0} />
      <LabeledCollapse
        name="Archived Lists"
        isOpened={archivedVisible}
        onClick={toggleArchived}
        noBorder
        isListSubMenu
      >
        {renderLists(archivedLists, true, isOverflowing)}
      </LabeledCollapse>
    </>
  );
};

export default ListsSubmenu;
