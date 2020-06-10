import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import { splitAt } from 'ramda';
import { toggleListNotifications } from 'actions/tasklist-actions';
import { onNotificationsToggled } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import PageContentHeader from 'components/common/NewPageContentHeader';
import RotatableChevron from 'components/common/RotatableChevron';
import Spacing from 'components/common/Spacing';
import UniversalTooltip from 'components/common/UniversalTooltip';
import Search from 'components/taskView/Search/Search';
import Tabs from 'components/common/Tabs/Tabs';
import MegaFilter from 'components/common/MegaFilter/MegaFilter';
import { InviteMemberPopoverWithButton } from 'components/members/InviteMemberPopover';
import Member from 'components/members/Member';
import { showGlobalAlert } from 'alert/actions';
import MorePopover from '../Toolbar.MorePopover';
import {
  MoreMembersButtonContainer,
  ToolbarLabel,
  ToolbarBottomGrid,
  HeaderActionButtonsGrid,
  SearchWrapper,
} from './styled';
import { TABS_CONFIG } from './config';

const renderMemberAvatar = ({ taskListMembers }) => member => {
  const taskListMember =
    taskListMembers?.find(
      ({ userIdentifier }) => member?.userIdentifier === userIdentifier,
    ) || {};

  return (
    <>
      <Spacing horizontal={2} />
      <Member member={taskListMember} size={40} />
    </>
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
          `Notifications are now ${
            newNotificationStatus ? 'enabled' : 'disabled'
          }`,
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

const getMembersNames = ({ members }) =>
  members?.map(member => {
    if (!member) {
      return null;
    }

    const { firstName, lastName, userIdentifier } = member;

    return (
      <div key={userIdentifier}>
        {`${firstName ?? ''} ${lastName ?? ''}`.trim()}
      </div>
    );
  });

const Toolbar = ({
  members,
  showMembers = true,
  membersNotInTaskList,
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
  onSelectFilters,
  megaFilter = {},
}) => {
  const moreButtonReference = useRef(null);
  const moreMembersButtonReference = useRef(null);
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );
  const [
    isShowMoreMembersTooltipOpen,
    showMoreMembersTooltip,
    hideMoreMembersTooltip,
  ] = useBoolean(false);

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
  const hiddenMembersCount = hiddenMembers?.length;

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
                {hiddenMembersCount > 0 && (
                  <>
                    <Spacing horizontal={1} />
                    <UniversalTooltip
                      placement="bottom"
                      open={isShowMoreMembersTooltipOpen}
                      anchorEl={moreMembersButtonReference.current}
                    >
                      {getMembersNames({ members: hiddenMembers })}
                    </UniversalTooltip>
                    <MoreMembersButtonContainer
                      onMouseEnter={showMoreMembersTooltip}
                      onMouseLeave={hideMoreMembersTooltip}
                      ref={moreMembersButtonReference}
                    >
                      +{hiddenMembersCount}
                    </MoreMembersButtonContainer>
                  </>
                )}
                <Spacing horizontal={2} />
                <InviteMemberPopoverWithButton
                  size={40}
                  members={members}
                  membersNotInTaskList={membersNotInTaskList}
                  taskList={taskList}
                />
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
        />
      </Grid>
      {haveTasks && (
        <ToolbarBottomGrid container direction="row" justify="flex-start">
          {megaFilter.isInitialized && (
            <MegaFilter
              filters={filters}
              selectedFilters={selectedFilters}
              onSelectFilters={onSelectFilters}
              taskList={taskList}
              taskStatus={
                selectedTab === 'incomplete' ? 'INCOMPLETE' : 'COMPLETE'
              }
              activeItemsAmount={
                selectedTab === 'incomplete'
                  ? openTasksAmount
                  : completedTasksAmount
              }
            />
          )}
          <Spacing horizontal={5} />
          <SearchWrapper>
            <Search
              fullWidth
              noBackground
              initialValue=""
              value={searchValue}
              onChange={event => onSearchChange(event?.target?.value)}
            />
            <Spacing horizontal={5} />
          </SearchWrapper>
        </ToolbarBottomGrid>
      )}
    </PageContentHeader>
  );
};

export default Toolbar;
