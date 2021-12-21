import React, { useMemo } from 'react';
import MoreVert from '@material-ui/icons/MoreVert';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { useDispatch, useSelector } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  currentTaskListSelector,
  currentTaskListTasksStatusSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { openModal } from 'modal/actions';
import {
  getCurrentTaskListFilterOptions,
  getMembersByTaskListId,
} from 'actions/task-list-actions';
import { isEmpty, splitAt } from 'ramda';
import { filterListDetailsTasks } from 'actions/list-details-actions';
import AvatarFilterMember from 'components/user/AvatarFilterMember/AvatarFilterMember';
import AdditionalMembersCounterPopover from 'components/user/AdditionalMembersCounterPopover/AdditionalMembersCounterPopover';
import ListOptionsMenu from 'components/tasklist/ListOptionsMenu/ListOptionsMenu';
import HeaderSearch from 'components/template/HeaderSearch/HeaderSearch';
import { Box } from '@material-ui/core';
import InviteMemberButton from 'components/user/InviteMemberButton/InviteMemberButton';
import { isUserGuest } from 'helpers/user-helper';
import { determineTaskCounts } from './helpers';

const ListDetailsHeader = props => {
  const {
    tasks,
    totalTasksAmount,
    isFetchingTasks,
    searchValue,
    onSearchChange,
  } = props;
  const dispatch = useDispatch();
  const currentTasksStatus = useSelector(currentTaskListTasksStatusSelector);
  const listUsers = useSelector(taskListMembersSelector);
  const taskList = useSelector(currentTaskListSelector);
  const { listName, listDescription, listType } = taskList || {};
  const megaFilter = useSelector(megaFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier } = currentUser || {};

  const sortedUsers = useMemo(
    () =>
      listUsers?.length > 0
        ? listUsers
            .filter(u => u?.userIdentifier === userIdentifier)
            .concat(listUsers.filter(u => u?.userIdentifier !== userIdentifier))
        : [],
    [listUsers, userIdentifier],
  );

  const [shownUsers, hiddenUsers] = splitAt(4, sortedUsers);

  const handleFilterOpen = () => {
    if (!selectedFilters || isEmpty(selectedFilters)) {
      dispatch(getCurrentTaskListFilterOptions());
    }
  };

  const handleFilterSelect = newFilters => {
    dispatch(filterListDetailsTasks(newFilters));
  };

  const tasksAndSubTasksCount = determineTaskCounts({
    selectedFilters,
    isFetching: isFetchingTasks,
    tasks,
    tasksCount: totalTasksAmount,
    status: currentTasksStatus,
  });

  return (
    <LayoutHeader>
      {taskList && !['INBOX', 'PUBLIC'].includes(listType) && (
        <Box position="absolute" top={listDescription ? 17 : 27} left={10}>
          <ListOptionsMenu list={taskList}>
            <MoreVert color="primary" />
          </ListOptionsMenu>
        </Box>
      )}
      <LayoutHeader.Title title={listName} description={listDescription} />
      <LayoutHeader.Spacer />
      <HeaderSearch value={searchValue} onChange={onSearchChange} />
      <LayoutHeader.Spacer />
      <MegaFilter
        filters={filters}
        selectedFilters={selectedFilters}
        onSelectFilters={handleFilterSelect}
        tasksAndSubTasksCount={tasksAndSubTasksCount}
        activeItemsAmount={totalTasksAmount}
        isFetching={isFetchingTasks}
        onOpen={handleFilterOpen}
      />
      <LayoutHeader.Spacer />
      {shownUsers && listType !== 'PUBLIC' && (
        <>
          {shownUsers.map((user, index) => {
            return (
              <Box key={user.identifier} pl={index !== 0 ? 0.5 : 0}>
                <AvatarFilterMember
                  member={user}
                  size={45}
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
                size={45}
                onSelectFilters={handleFilterSelect}
                selectedFilters={selectedFilters}
              />
            </Box>
          )}
          {!isUserGuest(currentUser) && listType && listType !== 'INBOX' && (
            <Box pl={0.5}>
              <InviteMemberButton
                size={45}
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
        </>
      )}
    </LayoutHeader>
  );
};

export default ListDetailsHeader;
