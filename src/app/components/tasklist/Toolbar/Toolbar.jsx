/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, ClickAwayListener, Popper, Paper } from '@material-ui/core';
import { splitAt, isEmpty, isNil } from 'ramda';
import OutlinedSelect from 'components/common/OutlinedSelect/OutlinedSelect';
import {
  toggleListNotifications,
  getMembersByTaskListId,
} from 'actions/task-list-actions';
import { openModal } from 'modal/actions';
import { onNotificationsToggled } from 'helpers/ga-event-helper';
import { showAlert } from 'helpers/utility-functions';
import { isMemberPending } from 'helpers/list-members-helper';
import localStorageHelper from 'helpers/local-storage-helper';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron.tsx';
import Spacing from 'components/common/Spacing.tsx';
import AdditionalMembersCounterPopover from 'components/user/AdditionalMembersCounterPopover/AdditionalMembersCounterPopover';
import Search from 'components/task-view/Search/Search';
import Tabs from 'components/common/Tabs/Tabs';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import AvatarFilterMember from 'components/user/AvatarFilterMember/AvatarFilterMember';
import InviteMemberButton from 'components/user/InviteMemberButton/InviteMemberButton';
import TipsPopover from 'components/tasklist/TipsPopover/TipsPopover.tsx';
import Button from 'components/common/Button/Button';
import { showGlobalAlert } from 'alert/actions';
import { MoreVert } from '@material-ui/icons';
import zIndex from 'styles/z-index';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { userProfileSelector } from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import ColumnDisplaySettings from 'components/common/ColumnDisplaySettings/ColumnDisplaySettings';
import {
  VIEW_TYPE_OPTIONS,
  ViewType,
  getViewTypeFromQueryString,
} from 'helpers/view-type-helper';
import TipsButton from './TipsButton';
import MorePopover from './MorePopover.tsx';
import {
  ToolbarLabel,
  ToolbarBottomGrid,
  HeaderActionButtonsGrid,
  SearchWrapper,
  MemberWrapper,
  ToolbarContainer,
  MenuText,
  StyledIconButton,
  LabelBox,
  LeftContainer,
} from './styled';
import { TABS_CONFIG } from './config';
import TaskCustomFieldsModal from '../../../modal/customModals/TaskCustomFieldsModal';

const INBOX_FIRST_TIME_KEY = 'INBOX_FIRST_TIME_KEY';

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
  moreOptions,
  onColumnSetupChange,
}) => {
  const { search } = useLocation();
  const history = useHistory();
  const moreButtonReference = useRef(null);
  const tipsButtonReference = useRef(null);
  const menuReference = useRef(null);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [tipsOpened, setTipsOpened] = useState(false);
  const [customFieldsModalOpened, setCustomFieldsModalOpened] = useState(false);
  const [menuOpen, , unsetMenuOpen, toggleMenuOpen] = useBoolean(false);
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
  const { userIdentifier, orgUserRole } = useSelector(userProfileSelector);
  const currentMember = useMemo(
    () => members?.filter(member => member?.userIdentifier === userIdentifier),
    [members, userIdentifier],
  );
  const anotherMembers = useMemo(
    () => members?.filter(member => member?.userIdentifier !== userIdentifier),
    [members, userIdentifier],
  );
  const [shownMembers, hiddenMembers] = splitAt(3, anotherMembers ?? []);
  const shownMembersWithCurrent = currentMember
    ? [...currentMember, ...shownMembers]
    : [];

  const isGuest = orgUserRole === 'GUEST';

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
  }, [openTasksAmount, tipsContent, taskList]);

  const showNotificationsOption =
    taskList?.listType === 'INBOX' || taskList?.listType === 'PUBLIC'
      ? false
      : showNotifications;

  const handleAddCustomFieldClick = useCallback(() => {
    setCustomFieldsModalOpened(true);
  }, []);

  const currentUser = useSelector(userProfileSelector);
  const isOrganizationAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const isListCreator =
    taskList?.creator?.identifier === currentUser.identifier;

  const handleChangeViewType = useCallback(
    event => {
      const queryParameters = new URLSearchParams(search);
      const value = event?.target.value ?? ViewType.LIST_VIEW;
      if (value === ViewType.LIST_VIEW) {
        queryParameters.delete('viewType');
      } else {
        queryParameters.set('viewType', value.toLowerCase());
      }
      history.push({ search: queryParameters.toString() });
    },
    [search, history],
  );

  return (
    <ToolbarContainer>
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
              width="200px"
              reference={moreButtonReference}
              onClick={openMorePopover}
              endIcon={
                <RotatableChevron
                  rotated={isMorePopoverOpen}
                  color={palette.brightBlue}
                />
              }
            >
              <div>
                <ToolbarLabel variant="body1" component="span">
                  ACTIONS
                </ToolbarLabel>
              </div>
            </Button>
            <Spacing horizontal={4} />
            {showMembers && (
              <>
                {shownMembersWithCurrent?.map(member => {
                  const isSelected = selectedFilters?.assignedTo?.includes(
                    member?.identifier,
                  );
                  return (
                    <MemberWrapper
                      key={member?.identifier}
                      isPending={isMemberPending(member)}
                    >
                      <Spacing horizontal={2} />
                      <AvatarFilterMember
                        member={member}
                        size={45}
                        isSelected={isSelected}
                        onSelectFilters={onSelectFilters}
                        selectedFilters={selectedFilters}
                      />
                    </MemberWrapper>
                  );
                })}
                {hiddenMembers?.length > 0 && (
                  <>
                    <Spacing horizontal={2} />
                    <AdditionalMembersCounterPopover
                      hiddenMembers={hiddenMembers}
                      size={45}
                      onSelectFilters={onSelectFilters}
                      selectedFilters={selectedFilters}
                    />
                  </>
                )}
                <Spacing horizontal={2} />
                {!isGuest &&
                  taskList?.listType !== 'INBOX' &&
                  taskList?.listType !== 'PUBLIC' && (
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
          showNotifications={showNotificationsOption}
          listNameColumnVisible={listNameColumnVisible}
          patientColumnVisible={patientColumnVisible}
          pdfTitle={pdfTitle}
          onAddCustomFieldsClick={
            isOrganizationAdmin || isListCreator
              ? handleAddCustomFieldClick
              : null
          }
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
              tasksAndSubTasksCount={tasksAndSubTasksCount}
              activeItemsAmount={
                selectedTab === TaskListTabName.OPEN
                  ? openTasksAmount
                  : completedTasksAmount
              }
              isFetching={isFetching}
            />
            <>
              <Spacing horizontal={5} />
              <OutlinedSelect
                width={170}
                name="viewType"
                value={getViewTypeFromQueryString(search)}
                onChange={handleChangeViewType}
                options={VIEW_TYPE_OPTIONS}
              />
            </>
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
                ref={tipsButtonReference}
                active={tipsOpened}
                toggleTips={() => setTipsOpened(!tipsOpened)}
              />
            </>
          )}
          <LeftContainer>
            <ColumnDisplaySettings onChange={onColumnSetupChange} />
            {moreOptions && (
              <>
                <Spacing horizontal={3} />
                <StyledIconButton ref={menuReference} onClick={toggleMenuOpen}>
                  <MoreVert />
                </StyledIconButton>
                <Popper
                  anchorEl={menuReference?.current}
                  placement="bottom-end"
                  disablePortal
                  open={menuOpen}
                  style={{
                    zIndex: zIndex.optionsMenu,
                  }}
                >
                  {menuOpen && (
                    <ClickAwayListener onClickAway={unsetMenuOpen}>
                      <Paper>
                        {moreOptions.map(option => (
                          <LabelBox
                            key={option.key}
                            display="flex"
                            alignItems="center"
                            p={2}
                            py={1}
                            onClick={() => {
                              if (
                                typeof option.onClick === 'function' &&
                                !option.disabled
                              )
                                option.onClick(option.key);
                            }}
                          >
                            <Checkbox
                              isDisabled={option.disabled}
                              isChecked={option.checked}
                            />
                            <Spacing horizontal={3} />
                            <MenuText isDisabled={option.disabled}>
                              {option.name}
                            </MenuText>
                          </LabelBox>
                        ))}
                      </Paper>
                    </ClickAwayListener>
                  )}
                </Popper>
              </>
            )}
          </LeftContainer>
        </ToolbarBottomGrid>
      )}
      {tipsContent && tipsOpened && (
        <TipsPopover arrowAnchorElement={tipsButtonReference.current}>
          <ClickAwayListener onClickAway={() => setTipsOpened(false)}>
            {tipsContent()}
          </ClickAwayListener>
        </TipsPopover>
      )}
      <TaskCustomFieldsModal
        opened={customFieldsModalOpened}
        handleClose={() => setCustomFieldsModalOpened(false)}
        taskListIdentifier={taskList?.taskListIdentifier}
        isOrganizationAdmin={isOrganizationAdmin}
        isListCreator={isListCreator}
      />
    </ToolbarContainer>
  );
};

export default Toolbar;
