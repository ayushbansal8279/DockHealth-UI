import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';
import { useBoolean } from 'hooks/useBoolean';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { useDispatch, useSelector } from 'react-redux';
import { MoreVert } from '@mui/icons-material';
import palette from 'styles/palette';
import {
  megaFilterSelector,
  quickFiltersSelector,
  addQuickFilterOptionSelector,
  selectedQuickFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  selectedUserOrganizationSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { openModal } from 'modal/actions';
import { getMembersByTaskListId } from 'actions/task-list-actions';
import splitAt from 'ramda/src/splitAt';
import equals from 'ramda/src/equals';
import {
  filterListDetailsTasks,
  getCurrentTaskListFilterOptions,
  getListCalendarTasks,
} from 'actions/list-details-actions';
import AvatarFilterMember from 'components/user/AvatarFilterMember/AvatarFilterMember';
import AdditionalMembersCounterPopover from 'components/user/AdditionalMembersCounterPopover/AdditionalMembersCounterPopover';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import { Box } from '@mui/material';
import InviteMemberButton from 'components/user/InviteMemberButton/InviteMemberButton';
import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { isMemberAdmin } from 'helpers/list-members-helper';
import {
  selectQuickFilter,
  showAddQuickFilterOption,
  createQuickFilter,
  updateQuickFilter,
  deleteQuickFilter,
  getQuickFilters,
} from 'actions/mega-filter-actions';
import MegaFilter from '@/app/components/tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
import AddGroupNameButton from '@/app/components/tasklist/list-toolbar-buttons/AddGroupNameButton/AddGroupNameButton';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import { determineTaskCounts } from './helpers';
import {
  HeaderMembersContainer,
  MainHeaderContainer,
  HeaderSearchContainer,
} from './styled';
import { TaskViewContext } from '@/app/context-api/task-view-context';
import InboxTips from '@/app/components/tasklist/list-toolbar-buttons/InboxTips/InboxTips';
import { useIsWorkspaceScopedList } from '@/app/hooks/useIsWorkspaceScopedList';
import { getWorkspaceByIdentifier } from '@/app/api/workspace-api';
import { getWorkspaceTitle } from '../../workspaces/workspace-title-helpers';

const ListDetailsHeader = (props) => {
  const {
    tasks,
    totalTasksAmount,
    isFetchingTasks,
    searchValue,
    onSearchChange,
    additionalOptions,
    clearFilter,
    setClearFilter,
    calendarView = false,
  } = props;
  const dispatch = useDispatch();
  const currentTasksStatus = useSelector(currentTaskListTasksStatusSelector);
  const listUsers = useSelector(taskListMembersSelector);
  const taskList = useSelector(currentTaskListSelector);
  const {
    listName,
    listDescription,
    listType,
    taskListIdentifier,
    color,
    restrictCustomization,
    organizationIdentifier,
  } = taskList || {};
  const { workspaceIdentifier } = useIsWorkspaceScopedList();

  const megaFilter = useSelector(megaFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier } = currentUser || {};
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const sortedUsers = useMemo(
    () =>
      listUsers?.length > 0
        ? listUsers
            .filter((u) => u?.userIdentifier === userIdentifier)
            .concat(
              listUsers.filter((u) => u?.userIdentifier !== userIdentifier),
            )
        : [],
    [listUsers, userIdentifier],
  );
  const {
    addNewGroup,
    handleAddNewGroup,
    handleScrollToAddGroupName,
    showShadow,
  } = useContext(TaskViewContext);
  const [isListOpen, openList] = useState(false);
  const [focused, setFocused, unsetFocused] = useBoolean(false);
  const [shownUsers, hiddenUsers] = splitAt(4, sortedUsers);

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const [workspace, setWorkspace] = useState();

  const isWorkspaceList =
    organizationIdentifier !== currentOrganization?.organizationIdentifier;

  useEffect(() => {
    if (isWorkspaceList && organizationIdentifier) {
      getWorkspaceByIdentifier(organizationIdentifier).then(setWorkspace);
    }
  }, [organizationIdentifier, isWorkspaceList]);

  const listTitle = getWorkspaceTitle({
    isWorkspaceScoped: isWorkspaceList,
    workspace,
    titleText: listName,
  });

  const handleFilterOpen = () => {
    dispatch(getCurrentTaskListFilterOptions());
    dispatch(getQuickFilters({ taskListIdentifier }));
  };

  const handleFilterSelect = (newFilters) => {
    dispatch(filterListDetailsTasks(newFilters));
    if (calendarView) dispatch(getListCalendarTasks());
  };

  const currentUserMember = taskList?.listUsers.find(
    (u) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictCustomizationFeatures = restrictCustomization && !isListAdmin;
  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const tasksAndSubTasksCount = determineTaskCounts({
    selectedFilters,
    isFetching: isFetchingTasks,
    tasks,
    tasksCount: totalTasksAmount,
    status: currentTasksStatus,
  });

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          (f) => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  const isDefaultDateFilterApplied = false;
  // const isDefaultDateFilterApplied =
  //   currentTasksStatus === 'COMPLETE' &&
  //   !selectedFilters?.taskCreatedDateOptions?.options &&
  //   !selectedFilters?.taskCreatedDateOptions?.dateStart &&
  //   !selectedFilters?.taskCreatedDateOptions?.dateSEnd &&
  //   !selectedFilters?.taskCompletedDateOptions?.options &&
  //   !selectedFilters?.taskCompletedDateOptions?.dateStart &&
  //   !selectedFilters?.taskCompletedDateOptions?.dateSEnd;

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(filterListDetailsTasks(filtersSetup, id));
    },
    [dispatch],
  );

  const handleQuickFilterCreate = useCallback(
    (name, selectedFilters, scope) =>
      dispatch(
        createQuickFilter(name, { taskListIdentifier }, selectedFilters, scope),
      ),
    [dispatch, taskListIdentifier],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name, selectedFilterOptions, scope) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name, selectedOptions: selectedFilterOptions },
          { taskListIdentifier },
          scope,
        ),
      ),
    [dispatch, taskListIdentifier],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const [maxWidth, setMaxWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setMaxWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showSearch = maxWidth <= 900 && (searchValue || focused);

  const showInviteMemberButton =
    !isUserGuestOrDockLite(currentUser) &&
    !isUserViewOnly(currentUser) &&
    listType &&
    listType !== 'INBOX';

  return (
    <MainHeaderContainer showShadow={showShadow}>
      <LayoutHeader horizontalSticky>
        {taskList && (
          <LayoutHeader.Title
            title={listTitle}
            description={listDescription}
            colorIndicator={color}
          >
            <ListOptionsMenu
              list={taskList}
              moreOptions
              tasks={tasks}
              onClose={() => openList(false)}
              open={isListOpen}
            >
              <MoreVert sx={{ color: palette.softSteelBlue }} />
            </ListOptionsMenu>
          </LayoutHeader.Title>
        )}
        {shownUsers && listType !== 'PUBLIC' && (
          <HeaderMembersContainer>
            {shownUsers.map((user, index) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={user.identifier}
                  pl={index === 0 ? 0 : 0.5}
                  pr={showInviteMemberButton ? 0 : 1.5}
                >
                  <AvatarFilterMember
                    member={user}
                    size={36}
                    onSelectFilters={handleFilterSelect}
                    selectedFilters={selectedFilters}
                  />
                </Box>
              );
            })}
            {hiddenUsers?.length > 0 && (
              <Box pl={0.5}>
                <AdditionalMembersCounterPopover
                  hiddenMembers={hiddenUsers}
                  size={36}
                  onSelectFilters={handleFilterSelect}
                  selectedFilters={selectedFilters}
                />
              </Box>
            )}
            {showInviteMemberButton && (
              <Box pl={0.5}>
                <InviteMemberButton
                  size={36}
                  onClick={() =>
                    dispatch(
                      openModal('InviteToList', {
                        list: taskList,
                        onMembersRefresh: () =>
                          dispatch(
                            getMembersByTaskListId(
                              taskList.taskListIdentifier,
                              'ALL',
                            ),
                          ),
                        workspaceIdentifier: workspaceIdentifier,
                      }),
                    )
                  }
                />
              </Box>
            )}
          </HeaderMembersContainer>
        )}
      </LayoutHeader>

      <ListDetailsToolbar
        additionalOptions={additionalOptions}
        searchValue={searchValue}
        focused={focused}
      >
        <Box mx={0.5} />
        <MegaFilter
          filters={filters}
          selectedFilters={selectedFilters}
          onSelectFilters={handleFilterSelect}
          tasksAndSubTasksCount={tasksAndSubTasksCount}
          activeItemsAmount={totalTasksAmount}
          isFetching={false}
          onOpen={handleFilterOpen}
          quickFiltersList={quickFiltersList}
          addQuickFilterOption={addQuickFilterOption}
          selectedQuickFilter={selectedQuickFilter}
          selectQuickFilter={handleSelectQuickFilter}
          onSaveAsNewClick={handleSaveAsQuickFilter}
          wasChangedFilters={wasChangedFilters}
          onQuickFilterCreate={handleQuickFilterCreate}
          onQuickFilterUpdate={handleQuickFilterUpdate}
          onQuickFilterDelete={handleQuickFilterDelete}
          isDefaultDateFilterApplied={isDefaultDateFilterApplied}
          clearFilter={clearFilter}
          setClearFilter={setClearFilter}
          showFilterCount
        />
        {restrictions?.editSettings !== DISABLED &&
          !restrictCustomizationFeatures && (
            <>
              <Box mx={0.5} />
              <AddGroupNameButton
                active={addNewGroup}
                onClick={() => {
                  handleAddNewGroup(true);
                  handleScrollToAddGroupName();
                }}
              />
            </>
          )}
        {taskList?.listType === 'INBOX' && <InboxTips />}
        <Box mx={0.5} />
        {!showSearch && (
          <HeaderSearch
            value={searchValue}
            onChange={onSearchChange}
            focused={focused}
            setFocused={setFocused}
            unsetFocused={unsetFocused}
            needEnterToSearch
          />
        )}
        <Box mx={0.5} />
      </ListDetailsToolbar>
      {showSearch && (
        <HeaderSearchContainer>
          <HeaderSearch
            value={searchValue}
            onChange={onSearchChange}
            focused={focused}
            setFocused={setFocused}
            unsetFocused={unsetFocused}
            needEnterToSearch
          />
        </HeaderSearchContainer>
      )}
    </MainHeaderContainer>
  );
};

export default ListDetailsHeader;
