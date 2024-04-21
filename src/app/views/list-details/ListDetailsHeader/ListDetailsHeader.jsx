import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';
import { useBoolean } from 'hooks/useBoolean';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  megaFilterSelector,
  quickFiltersSelector,
  addQuickFilterOptionSelector,
  selectedQuickFilterSelector,
} from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
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
} from 'actions/list-details-actions';
import AvatarFilterMember from 'components/user/AvatarFilterMember/AvatarFilterMember';
import AdditionalMembersCounterPopover from 'components/user/AdditionalMembersCounterPopover/AdditionalMembersCounterPopover';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import { Box } from '@mui/material';
import InviteMemberButton from 'components/user/InviteMemberButton/InviteMemberButton';
import { isUserGuestOrDockLite, isUserViewOnly } from 'helpers/user-helper';
import {
  selectQuickFilter,
  showAddQuickFilterOption,
  createQuickFilter,
  updateQuickFilter,
  deleteQuickFilter,
  getQuickFilters,
} from 'actions/mega-filter-actions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddGroupNameButton from 'components/tasklist/AddGroupNameButton/AddGroupNameButton';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import { determineTaskCounts } from './helpers';
import {
  HeaderMembersContainer,
  MainHeaderContainer,
  HeaderSearchContainer,
} from './styled';
import { ListPageContext } from '../ListDetailsView';

const ListDetailsHeader = (props) => {
  const {
    tasks,
    totalTasksAmount,
    isFetchingTasks,
    searchValue,
    onSearchChange,
    additionalOptions,
  } = props;
  const dispatch = useDispatch();
  const currentTasksStatus = useSelector(currentTaskListTasksStatusSelector);
  const listUsers = useSelector(taskListMembersSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { listName, listDescription, listType, taskListIdentifier, color } =
    taskList || {};
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
  } = useContext(ListPageContext);
  const [isListOpen, openList] = useState(false);
  const [focused, setFocused, unsetFocused] = useBoolean(false);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [shownUsers, hiddenUsers] = splitAt(4, sortedUsers);

  const handleFilterOpen = () => {
    dispatch(getCurrentTaskListFilterOptions());
    dispatch(getQuickFilters({ taskListIdentifier }));
  };

  const handleFilterSelect = (newFilters) => {
    dispatch(filterListDetailsTasks(newFilters));
  };

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

  const isDefaultDateFilterApplied =
    currentTasksStatus === 'COMPLETE' &&
    !selectedFilters?.taskCreatedDateOptions?.options &&
    !selectedFilters?.taskCreatedDateOptions?.dateStart &&
    !selectedFilters?.taskCreatedDateOptions?.dateSEnd &&
    !selectedFilters?.taskCompletedDateOptions?.options &&
    !selectedFilters?.taskCompletedDateOptions?.dateStart &&
    !selectedFilters?.taskCompletedDateOptions?.dateSEnd;

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    (selectedFilters) =>
      dispatch(
        updateQuickFilter(
          selectedQuickFilter,
          {
            selectedOptions: selectedFilters,
          },
          { taskListIdentifier },
        ),
      ),
    [dispatch, selectedFilters, selectedQuickFilter, taskListIdentifier],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(filterListDetailsTasks(filtersSetup));
    },
    [dispatch],
  );

  const handleQuickFilterCreate = useCallback(
    (name,selectedFilters) =>
      dispatch(
        createQuickFilter(name, { taskListIdentifier }, selectedFilters),
      ),
    [dispatch, selectedFilters, taskListIdentifier],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name },
          { taskListIdentifier },
        ),
      ),
    [dispatch, taskListIdentifier],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  // const boxComponentStyles = {
  //   mx: '4px',
  //   '@media (max-width: 867px)': {
  //     mx: searchValue || focused ? '0px' : '4px',
  //   },
  // };
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

  return (
    <MainHeaderContainer showShadow={showShadow}>
      <LayoutHeader horizontalSticky>
        {taskList && (
          <LayoutHeader.Title
            title={listName}
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
              {isListOpen ? (
                <ExpandLessIcon
                  color="primary"
                  fontSize="large"
                  onClick={() => openList(false)}
                />
              ) : (
                <ExpandMoreIcon
                  color="primary"
                  fontSize="large"
                  onClick={() => openList(true)}
                />
              )}
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
            {!isUserGuestOrDockLite(currentUser) &&
              !isUserViewOnly(currentUser) &&
              listType &&
              listType !== 'INBOX' && (
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
        // boxComponentStyles={boxComponentStyles}
      >
        {/* <LayoutHeader.Spacer /> */}
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
          handleSaveQuickFilter={handleSaveQuickFilter}
          onSaveAsNewClick={handleSaveAsQuickFilter}
          wasChangedFilters={wasChangedFilters}
          onQuickFilterCreate={handleQuickFilterCreate}
          onQuickFilterUpdate={handleQuickFilterUpdate}
          onQuickFilterDelete={handleQuickFilterDelete}
          isDefaultDateFilterApplied={isDefaultDateFilterApplied}
        />
        {/* <LayoutHeader.Spacer /> */}
        <Box mx={0.5} />
        <AddGroupNameButton
          active={addNewGroup}
          onClick={() => {
            handleAddNewGroup(true);
            handleScrollToAddGroupName();
          }}
        />
        <Box mx={0.5} />
        {!showSearch && (
          <HeaderSearch
            value={searchValue}
            onChange={onSearchChange}
            focused={focused}
            setFocused={setFocused}
            unsetFocused={unsetFocused}
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
          />
        </HeaderSearchContainer>
      )}
    </MainHeaderContainer>
  );
};

export default ListDetailsHeader;
