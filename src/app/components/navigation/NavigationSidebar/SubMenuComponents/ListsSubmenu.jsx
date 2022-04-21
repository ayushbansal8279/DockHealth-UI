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
import { onTaskListInvitationAccepted } from 'helpers/ga-event-helper';
import {
  currentTaskListIdentifierSelector,
  taskListsSelector,
  pendingTaskListsSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import AddButton from 'components/common/AddButton/AddButton.tsx';
import { openModal } from 'modal/actions';
import { hideSubMenu } from 'actions/template-actions';
import * as TaskListActions from 'actions/task-list-actions';
import palette from 'styles/palette';
import { createTaskListPath } from 'routing/helpers/paths';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import { Box } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
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
  const { orgUserRole } = useSelector(userProfileSelector);
  const isGuest = orgUserRole === 'GUEST';

  const activeLists = useMemo(
    () =>
      taskLists && pendingTaskLists
        ? [...taskLists, ...pendingTaskLists]
        : null,
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

  const hasAnyPendingList = activeLists?.some(
    ({ status }) => status === 'PENDING',
  );

  const renderLists = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (listsList, archived = true) => {
      return listsList
        ? listsList.map(list => (
            <DrawerListsItem
              key={`listsubmenu_${list.taskListIdentifier}`}
              data-list-id={list.taskListIdentifier}
              className={
                list.listType === 'INBOX'
                  ? 'drawer-menu-list-inbox'
                  : `drawer-menu-list-item`
              }
            >
              {!['INBOX', 'PUBLIC'].includes(list?.listType) ? (
                <ListOptionsMenu list={list}>
                  <MoreVert color="primary" />
                </ListOptionsMenu>
              ) : (
                <Box m={2} />
              )}
              {list.color && (
                <Box mr={1}>
                  <ColorIndicator color={list.color} />
                </Box>
              )}
              <ListNameText
                color={archived && palette.coolGrey2}
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
                  history.push(createTaskListPath(list.taskListIdentifier));
                }}
              >
                {list?.listName}
              </ListNameText>
              {list?.status === 'PENDING' && (
                <DrawerListsItemNewLabel>New</DrawerListsItemNewLabel>
              )}
              <DrawerItemOptions>
                <div>{list?.numberOfTasks ? list?.numberOfTasks : 0}</div>
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
        : // eslint-disable-next-line react/no-array-index-key
          new Array(6).fill().map((_, i) => <DrawerListsItemLoader key={i} />);
    },
    [activeTaskListIdentifier, dispatch, history],
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
