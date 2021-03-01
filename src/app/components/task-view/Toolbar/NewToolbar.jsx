import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, ClickAwayListener } from '@material-ui/core';
import { splitAt, isEmpty, isNil } from 'ramda';
import {
  toggleListNotifications,
  getMembersByTaskListId,
} from 'actions/task-list-actions';
import { openModal } from 'modal/actions';
import { onNotificationsToggled } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import { isMemberPending } from 'helpers/list-members-helper';
import localStorageHelper from 'helpers/local-storage-helper';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import PageContentHeader from 'components/common/NewPageContentHeader';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Spacing from 'components/common/Spacing';
import AdditionalMembersCounter from 'components/members/AdditionalMembersCounter/AdditionalMembersCounter';
import Search from 'components/task-view/Search/Search';
import Tabs from 'components/common/Tabs/Tabs';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import Member from 'components/members/Member/Member';
import InviteMemberButton from 'components/members/InviteMemberButton/InviteMemberButton';
import TipsButton from 'components/common/TipsButton';
import { showGlobalAlert } from 'alert/actions';
import MorePopover from './MorePopover';
import {
  ToolbarLabel,
  ToolbarBottomGrid,
  HeaderActionButtonsGrid,
  SearchWrapper,
  MemberWrapper,
} from './styled';
import { TABS_CONFIG, TaskListTabName } from './config';

const INBOX_FIRST_TIME_KEY = 'INBOX_FIRST_TIME_KEY';

const renderMemberAvatar = ({ taskListMembers }) => member => {
  const taskListMember =
    taskListMembers?.find(
      ({ userIdentifier }) => member?.userIdentifier === userIdentifier,
    ) || {};

  return (
    <MemberWrapper
      key={member?.userIdentifier}
      isPending={isMemberPending(member)}
    >
      <Spacing horizontal={2} />
      <Member member={taskListMember} size={45} />
    </MemberWrapper>
  );
};

const useToggleNotifications = ({
  notificationsEnabled,
  closeMorePopover,
  taskListIdentifier,
  dispatch,
}) =>
  useCallback(async () => {
    const newNotificationStatus = !notificationsEnabled;

    closeMorePopover();

    try {
      await toggleListNotifications(
        taskListIdentifier,
        newNotificationStatus,
      )(dispatch);
      onNotificationsToggled(newNotificationStatus);
      dispatch(
        showGlobalAlert(
          `Notifications are now ${newNotificationStatus ? 'on' : 'off'}`,
        ),
      );
    } catch {
      showAlert({
        status: 'error',
        text:
          'Error while changing notifications status, please try again later',
        title: 'Error',
      });
    }
  }, [closeMorePopover, dispatch, notificationsEnabled, taskListIdentifier]);

const Toolbar = ({
  members,
  showMembers = true,
  onSelectTab,
  printData: { openedTasks = [], completedTasks = [], taskListMembers = [] },
  selectedTab,
  showNotifications = true,
  taskList,
  openTasksAmount,
  completedTasksAmount,
  onSearchChange,
  searchValue,
  haveTasks,
  tasksAndSubTasksCount,
  onSelectFilters,
  pdfTitle,
  megaFilter = {},
  listNameColumnVisible = false,
  patientColumnVisible = true,
  tipsContent,
  isFetching,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const moreButtonReference = useRef(null);
  const tipsButtonReference = useRef(null);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [tipsOpened, setTipsOpened] = useState(false);
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );

  const notificationsEnabled = taskList?.notifications;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const dispatch = useDispatch();

  const { filters, selectedFilters } = megaFilter;

  const toggleNotifications = useToggleNotifications({
    notificationsEnabled,
    closeMorePopover,
    taskListIdentifier,
    dispatch,
  });

  const [shownMembers, hiddenMembers] = splitAt(4, members ?? []);

  useEffect(() => {
    if (!tipsContent || taskList?.listType !== 'INBOX') {
      return;
    }

    const inboxFirstTimeValue = localStorageHelper.getItem(
      INBOX_FIRST_TIME_KEY,
    );

    if (isNil(inboxFirstTimeValue) || inboxFirstTimeValue === true) {
      setTipsOpened(true);
      localStorageHelper.setItem(INBOX_FIRST_TIME_KEY, false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTasksAmount, tipsContent, taskList]);

  return (
    <PageContentHeader>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Tabs
            completedTasksAmount={completedTasksAmount}
            config={TABS_CONFIG({
              selectedTab,
              onSelectTab,
              openTasksAmount,
              completedTasksAmount,
            })}
          />
        </Grid>
        <Grid item>
          <HeaderActionButtonsGrid
            container
            alignItems="center"
            direction="row"
            wrap="nowrap"
            justify="flex-end"
          >
            <Button
              variant="text"
              ref={moreButtonReference}
              onClick={openMorePopover}
              size="small"
            >
              <ToolbarLabel variant="body1" component="span">
                ACTIONS
              </ToolbarLabel>
              <Spacing horizontal={3} />
              <RotatableChevron
                rotated={isMorePopoverOpen}
                color={palette.brightBlue}
              />
            </Button>
            <Spacing horizontal={4} />
            {showMembers && (
              <>
                {shownMembers?.map(renderMemberAvatar({ taskListMembers }))}
                {hiddenMembers?.length > 0 && (
                  <>
                    <Spacing horizontal={1} />
                    <AdditionalMembersCounter
                      hiddenMembers={hiddenMembers}
                      size={45}
                      color={palette.brightBlue}
                    />
                  </>
                )}
                <Spacing horizontal={2} />
                {taskList?.listType !== 'INBOX' && (
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
                )}
              </>
            )}
          </HeaderActionButtonsGrid>
        </Grid>
        <MorePopover
          moreButtonReference={moreButtonReference}
          closeMorePopover={closeMorePopover}
          isMorePopoverOpen={isMorePopoverOpen}
          tasks={openedTasks}
          completedTasks={completedTasks}
          taskListMembers={taskListMembers}
          notificationsEnabled={notificationsEnabled}
          toggleNotifications={toggleNotifications}
          showNotifications={showNotifications}
          listNameColumnVisible={listNameColumnVisible}
          patientColumnVisible={patientColumnVisible}
          pdfTitle={pdfTitle}
        />
      </Grid>
      {(haveTasks ||
        searchValue ||
        !isEmpty(selectedFilters) ||
        taskList?.listType === 'INBOX') && (
        <ToolbarBottomGrid container direction="row" justify="flex-start">
          <>
            <MegaFilter
              filters={filters}
              selectedFilters={selectedFilters}
              onSelectFilters={onSelectFilters}
              taskList={taskList}
              taskStatus={
                selectedTab === TaskListTabName.OPEN ? 'INCOMPLETE' : 'COMPLETE'
              }
              tasksAndSubTasksCount={tasksAndSubTasksCount}
              activeItemsAmount={
                selectedTab === TaskListTabName.OPEN
                  ? openTasksAmount
                  : completedTasksAmount
              }
              isFetching={isFetching}
            />
            <Spacing horizontal={5} />
            <SearchWrapper fullWidth={isSearchFocused || searchValue}>
              <Search
                fullWidth
                noBackground
                value={searchValue}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={event => onSearchChange(event?.target?.value)}
                placeholder={
                  isSearchFocused ? 'Search Tasks and Comments' : 'Search'
                }
              />
              <Spacing horizontal={5} />
            </SearchWrapper>
          </>
          {tipsContent && (
            <>
              {haveTasks && <Spacing horizontal={5} />}
              <TipsButton
                tipsButtonReference={tipsButtonReference}
                active={tipsOpened}
                toggleTips={() => setTipsOpened(!tipsOpened)}
              />
            </>
          )}
        </ToolbarBottomGrid>
      )}
      {tipsContent && tipsOpened && (
        <ClickAwayListener onClickAway={() => setTipsOpened(false)}>
          <div>{tipsContent({ arrowAnchorElement: tipsButtonReference })}</div>
        </ClickAwayListener>
      )}
    </PageContentHeader>
  );
};

export default Toolbar;
