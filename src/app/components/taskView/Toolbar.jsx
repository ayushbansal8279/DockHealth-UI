import { Button, Grid } from '@material-ui/core';
import { splitAt } from 'ramda';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleListNotifications } from 'actions/tasklist-actions';
import { onNotificationsToggled } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import PageContentHeader from '../common/PageContentHeader';
import RotatableChevron from '../common/RotatableChevron';
import Spacing from '../common/Spacing';
// import TipsButton from '../common/TipsButton';
import UniversalTooltip from '../common/UniversalTooltip';
import { InviteMemberPopoverWithButton } from '../members/InviteMemberPopover';
import Member from '../members/Member';
// import Search from './Search';
// import FilterPopover, { filterOptions } from './Toolbar.FilterPopover';
import FilterPopover from './Toolbar.FilterPopover';
import MorePopover from './Toolbar.MorePopover';
import { MoreMembersButtonContainer, ToolbarLabel } from './Toolbar.Styled';

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
      toggleAlert(
        `Notifications are now ${
          newNotificationStatus ? 'enabled' : 'disabled'
        }`,
        'success',
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

export default ({
  // handleSearch,
  // initialSearchValue,
  // searchValue,
  // preferencesInitialized,
  taskList,
  members,
  membersNotInTaskList,
  clearFilter,
  isInbox,
  filterBy,
  isSpecialList,
  onFilterChange,
  paneled = false,
  showFilterStats = true,
  showNotifications = true,
  showMembers = true,
  // showTipsButton = false,
  // tipsPanelOpen = false,
  // tipsButtonReference = null,
  // toggleTips,
  printData: { tasks = [], completedTasks = [], taskListMembers = [] },
}) => {
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );
  const [
    isFilterPopoverOpen,
    // openFilterPopover,
    closeFilterPopover,
  ] = useBoolean(false);

  // const currentFilterDescription =
  //   filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

  const notificationsEnabled = taskList?.notifications;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const dispatch = useDispatch();

  const toggleNotifications = useToggleNotifications({
    notificationsEnabled,
    closeMorePopover,
    taskListIdentifier,
    dispatch,
  });
  const moreButtonReference = useRef(null);
  const filterButtonReference = useRef(null);
  const moreMembersButtonReference = useRef(null);

  const [
    isShowMoreMembersTooltipOpen,
    showMoreMembersTooltip,
    hideMoreMembersTooltip,
  ] = useBoolean(false);

  const [shownMembers, hiddenMembers] = splitAt(4, members ?? []);
  const hiddenMembersCount = hiddenMembers?.length;

  return (
    <PageContentHeader paneled={paneled}>
      {/* <div id="toolbar-left-container">
        <Grid container alignItems="center" direction="row" wrap="nowrap">
          <Button
            variant="text"
            onClick={openFilterPopover}
            ref={filterButtonReference}
            size="small"
          >
            <ToolbarLabel variant="body1" component="span">
              FILTER
            </ToolbarLabel>
            <Spacing horizontal={3} />
            <RotatableChevron
              rotated={isFilterPopoverOpen}
              color={palette.brightBlue}
            />
          </Button>
          {preferencesInitialized && (
            <>
              <Spacing horizontal={4} />
              <Search
                initialValue={initialSearchValue}
                value={searchValue}
                onChange={handleSearch}
              />
            </>
          )}
          {showTipsButton && (
            <>
              <Spacing horizontal={3} />
              <TipsButton
                active={tipsPanelOpen}
                tipsButtonReference={tipsButtonReference}
                toggleTips={toggleTips}
              />
            </>
          )}
        </Grid>
      </div> */}
      <Grid
        container
        alignItems="center"
        direction="row"
        wrap="nowrap"
        justify="flex-end"
      >
        {!isInbox && (
          <>
            <Spacing horizontal={3} />
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
            {!isSpecialList && showMembers && (
              <>
                <Spacing horizontal={4} />
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
          </>
        )}
      </Grid>
      <MorePopover
        moreButtonReference={moreButtonReference}
        closeMorePopover={closeMorePopover}
        isMorePopoverOpen={isMorePopoverOpen}
        tasks={tasks}
        completedTasks={completedTasks}
        taskListMembers={taskListMembers}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
        isSpecialList={isSpecialList}
        showNotifications={showNotifications}
      />
      <FilterPopover
        isFilterPopoverOpen={isFilterPopoverOpen}
        closeFilterPopover={closeFilterPopover}
        filterBy={filterBy}
        onFilterChange={onFilterChange}
        clearFilter={clearFilter}
        filterButtonReference={filterButtonReference}
        showFilterStats={showFilterStats}
      />
    </PageContentHeader>
  );
};
