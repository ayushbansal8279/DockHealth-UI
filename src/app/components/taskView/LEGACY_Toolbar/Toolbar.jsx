import { Button, Grid } from '@material-ui/core';
import { Add, Close } from '@material-ui/icons';
import { splitAt } from 'ramda';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleListNotifications } from 'actions/tasklist-actions';
import { onNotificationsToggled } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import Search from 'components/taskView/Search/Search';
import * as AlertActions from 'alert/actions';
import AdornedButton from '../../common/AdornedButton';
import PageContentHeader from '../../common/PageContentHeader';
import RotatableChevron from '../../common/RotatableChevron';
import Spacing from '../../common/Spacing';
import TipsButton from '../../common/TipsButton';
import UniversalTooltip from '../../common/UniversalTooltip';
import Member from '../../members/Member';
import FilterPopover, { filterOptions } from './Toolbar.FilterPopover';
import MorePopover from '../Toolbar/MorePopover';
import {
  MoreMembersButtonContainer,
  SlimViewToggle,
  ToolbarLabel,
} from './Toolbar.Styled';

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
        AlertActions.showGlobalAlert(
          `Notifications are now ${newNotificationStatus ? 'on' : 'off'}`,
          'success',
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

export default ({
  addingNewSubtask,
  handleSearch,
  onAddTaskButtonClick,
  initialSearchValue,
  searchValue,
  preferencesInitialized,
  selectedTask,
  showAddTaskButton = true,
  slimView,
  switchSlimView,
  taskDrawerOpen,
  taskList,
  members,
  clearFilter,
  isInbox,
  filterBy,
  isSpecialList,
  isMultiList,
  onFilterChange,
  paneled = false,
  showFilterStats = true,
  showNotifications = true,
  showMembers = true,
  showTipsButton = false,
  tipsPanelOpen = false,
  tipsButtonReference = null,
  toggleTips,
  printData: { tasks = [], completedTasks = [], taskListMembers = [] },
}) => {
  const [isMorePopoverOpen, openMorePopover, closeMorePopover] = useBoolean(
    false,
  );
  const [
    isFilterPopoverOpen,
    openFilterPopover,
    closeFilterPopover,
  ] = useBoolean(false);

  const currentFilterDescription =
    filterOptions.find(({ value }) => value === filterBy)?.description ?? '';

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
  const addTaskButtonReference = useRef(null);
  const filterButtonReference = useRef(null);
  const moreMembersButtonReference = useRef(null);

  const [
    isShowMoreMembersTooltipOpen,
    showMoreMembersTooltip,
    hideMoreMembersTooltip,
  ] = useBoolean(false);

  const [shownMembers, hiddenMembers] = splitAt(4, members ?? []);
  const hiddenMembersCount = hiddenMembers?.length;

  const isMainTaskDrawerOpen =
    taskDrawerOpen && !selectedTask?.taskIdentifier && !addingNewSubtask;

  return (
    <PageContentHeader paneled={paneled}>
      <div id="toolbar-left-container">
        <Grid container alignItems="center" direction="row" wrap="nowrap">
          <SlimViewToggle
            onClick={switchSlimView}
            slimView={slimView}
            variant="outlined"
          />
          <Spacing horizontal={3} />
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
          {currentFilterDescription && (
            <>
              <Spacing horizontal={3} />
              <ToolbarLabel
                variant="body1"
                component="span"
                style={{ color: palette.coolGrey1 }}
              >
                {currentFilterDescription}
              </ToolbarLabel>
              <Spacing horizontal={3} />
              <ToolbarLabel
                variant="body1"
                component="span"
                onClick={clearFilter}
                style={{ cursor: 'pointer' }}
              >
                Clear
              </ToolbarLabel>
            </>
          )}
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
      </div>
      <div>
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
                </>
              )}
            </>
          )}
          {showAddTaskButton && <Spacing horizontal={5} />}
          <div ref={addTaskButtonReference}>
            {!isMultiList && showAddTaskButton && (
              <AdornedButton
                adornment={isMainTaskDrawerOpen ? <Close /> : <Add />}
                onClick={onAddTaskButtonClick}
              >
                ADD A TASK
              </AdornedButton>
            )}
          </div>
        </Grid>
      </div>
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
