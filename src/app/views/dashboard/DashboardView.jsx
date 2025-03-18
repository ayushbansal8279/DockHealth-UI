/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import { initializePusher } from 'helpers/pusher-instance';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import * as TaskActions from 'actions/task-actions';
import {
  clearDashboardState,
  initializeDashboardState,
} from 'actions/dashboard-actions';
import {
  userProfileSelector,
  userHasShareTaskFeatureSelector,
} from 'selectors/user-selectors';
import { clearFiltersForMegaFilter } from 'actions/mega-filter-actions';
import * as TaskListActions from 'actions/task-list-actions';
import * as UserAuthApi from 'api/user-auth-api';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { openModal } from 'modal/actions';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { DashboardTasksTab } from 'helpers/dashboard-helpers';
import { UserOrganizationRole } from 'helpers/user-helper';
import { hasAccessToElement } from 'helpers/access-helpers';
import { HOME_ALL_TASKS_PATH, HOME_PATH } from 'routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import {
  DashboardViewWrapper,
  DashboardContentWrapper,
  DashboardFirstVisitViewWrapper,
  DashboardScrollableList,
  StyledConfetti,
} from './styled';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import newUserTourHooks from './new-user-tour-hooks';
import { organizationSelector } from '@/app/selectors/organization-selectors';
import { getDashboardTaskViewFilter } from '@/app/helpers/local-storage-helper';

const { ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE, DOCK_PRO } = UserOrganizationRole;

const DashboardView = ({ tabName }) => {
  const pusher = useRef(initializePusher());
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const [firstCreatedUserListIdentifier, setFirstCreatedUserListIdentifier] =
    useState(null);
  const [openConfetti, setOpenConfetti] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [isAddTaskDrawer, setAddTaskDrawer] = useState(false);
  const { usageState, orgUserRole } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};
  const organization = useSelector(organizationSelector);

  const shareTaskAvailable = useSelector(userHasShareTaskFeatureSelector);

  const createListViewVisible = !shareTaskAvailable && hasOnlyInvitedLists;

  const TAB_RESTRICTIONS = {
    [DashboardTasksTab.MY_TASKS]: {
      allowedToRoles: [ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE, DOCK_PRO],
      path: HOME_PATH,
    },
    [DashboardTasksTab.ALL_TASKS]: {
      allowedToRoles: [ADMIN, OWNER, MEMBER, GUEST, DOCK_LITE, DOCK_PRO],
      path: HOME_ALL_TASKS_PATH,
    },
  };

  const hasAccessToCurrentTab = hasAccessToElement(
    orgUserRole,
    TAB_RESTRICTIONS[tabName]?.allowedToRoles,
  );

  useEffect(() => {
    if (hasAccessToCurrentTab) {
      dispatch(
        initializeDashboardState(
          tabName,
          getDashboardTaskViewFilter(organization?.organizationIdentifier),
        ),
      );
    }

    return () => {
      dispatch(clearFiltersForMegaFilter());
    };
  }, [
    dispatch,
    history,
    tabName,
    hasAccessToCurrentTab,
    organization?.organizationIdentifier,
  ]);

  useEffect(() => {
    return () => {
      dispatch(clearDashboardState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const taskCallback = ({ eventType, task }) => {
      if (
        task.assignedToUsers?.some(
          ({ userIdentifier }) => userIdentifier === currentUserIdentifier,
        )
      ) {
        if (
          eventType?.startsWith('CREATE_TASK') ||
          eventType?.startsWith('DUPLICATE_TASK') ||
          eventType?.startsWith('ADD_EXISTING_TASK_TO_LIST')
        ) {
          dispatch(TaskActions.insertCreatedTask(task.taskIdentifier));
        } else {
          dispatch(TaskActions.refreshTask(task.taskIdentifier));
        }
      }
    };
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const taskBundleCallback = ({ eventType, taskBundle }) => {
      if (
        eventType?.startsWith('CREATE_TASK_BUNDLE') ||
        eventType?.startsWith('UPDATE_TASK_BUNDLE') ||
        eventType?.startsWith('DUPLICATE_TASK_BUNDLE') ||
        eventType?.startsWith('MORE_TASKS_TASK_BUNDLE')
      ) {
        dispatch(TaskActions.refreshTaskBundle(taskBundle.identifier));
      }
    };

    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
    let ch;

    if (currentUserIdentifier) {
      ch = pusher.current.subscribe(channelName);
      ch.bind('task-update', taskCallback);
      ch.bind('task-bundle-update', taskBundleCallback);
    }

    return () => {
      if (ch) {
        ch.unbind('task-update', taskCallback);
        ch.unbind('task-bundle-update', taskBundleCallback);
        ch.unsubscribe(channelName);
      }
    };
  }, [currentUserIdentifier, dispatch]);

  useEffect(() => {
    dispatch(TaskListActions.getTaskListForUser());
    dispatch(TaskListActions.getPendingTaskListsForUser());
  }, [dispatch]);

  const isNewUser = currentUser?.usageState?.loginCount <= 5;

  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const refreshAccessToken = (user) => {
    const systemTimeout = Number.parseInt(
      import.meta.env.VITE_HEALTHCHECK_INTERVAL,
      10,
    );

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserAuthApi.refreshAccessToken(user.username);
      refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  useMount(() => {
    // refreshAccessToken(currentUser);
  });

  const handleCreateFirstList = () => {
    let firstListIdentifier;
    onNewUserTourEnter('Opened create list modal');
    dispatch(
      openModal('ListForm', {
        onListCreationSuccess: (taskListIdentifier) => {
          onNewUserTourEnter('Create list success');
          firstListIdentifier = taskListIdentifier;
        },
        onClose: () => {
          if (firstListIdentifier) {
            dispatch(TaskListActions.getTaskListForUser());
            UserAuthApi.getUserByEmail(currentUser.email, currentUser);
            setFirstCreatedUserListIdentifier(firstListIdentifier);
            setOpenConfetti(true);
          }
        },
      }),
    );
  };

  const { tourModalIsOpen, forceOpenTourModal, renderNewUserTour } =
    newUserTourHooks({
      firstCreatedUserListIdentifier,
      setFirstCreatedUserListIdentifier,
      isNewUser,
    });

  return (
    <ColumnsConfigProvider>
      <DashboardViewWrapper>
        {currentUserIdentifier && (
          <DashboardContentWrapper>
            {openConfetti && <StyledConfetti recycle={false} />}
            <DashboardScrollableList>
              <HorizontallyScrolledViewLayout>
                <StickyContainer>
                  <DashboardHeader
                    clearSearch={clearSearch}
                    setClearSearch={setClearSearch}
                    clearFilter={clearFilter}
                    setClearFilter={setClearFilter}
                    currentUser={currentUser}
                    isAddTaskDrawer={isAddTaskDrawer}
                    setAddTaskDrawer={setAddTaskDrawer}
                  />
                  {/* <Spacing vertical={3} /> */}
                </StickyContainer>
                {createListViewVisible ? (
                  <StickyContainer>
                    <DashboardFirstVisitViewWrapper>
                      <DashboardFirstVisitView
                        hasInvitedLists={hasOnlyInvitedLists}
                        onCreateList={handleCreateFirstList}
                        onTakeATour={() => {
                          onNewUserTourEnter('Video tutorial');
                          dispatch(
                            openModal('Video', {
                              title: 'Emailing a Task to Dock Health',
                              url: 'https://www.youtube.com/embed/FlScR9Rjq1E',
                            }),
                          );
                        }}
                        acceptInvitation={(list) =>
                          dispatch(TaskListActions.acceptInviteToTaskList(list))
                        }
                      />
                    </DashboardFirstVisitViewWrapper>
                  </StickyContainer>
                ) : (
                  <DashboardList
                    currentUser={currentUser}
                    tourModalIsOpen={tourModalIsOpen}
                    openTourModal={forceOpenTourModal}
                    customerTypeLabel={customerTypeLabel}
                    setClearSearch={setClearSearch}
                    clearFilter={clearFilter}
                    setClearFilter={setClearFilter}
                    isAddTaskDrawer={isAddTaskDrawer}
                    setAddTaskDrawer={setAddTaskDrawer}
                  />
                )}
              </HorizontallyScrolledViewLayout>
            </DashboardScrollableList>
          </DashboardContentWrapper>
        )}
        {renderNewUserTour()}
      </DashboardViewWrapper>
    </ColumnsConfigProvider>
  );
};

export default DashboardView;
