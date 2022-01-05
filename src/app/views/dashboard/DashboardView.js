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
import { userProfileSelector } from 'selectors/user-selectors';
import { clearFiltersForMegaFilter } from 'actions/mega-filter-actions';
import * as TaskListActions from 'actions/task-list-actions';
import * as UserAuthApi from 'api/user-auth-api';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import Spacing from 'components/common/Spacing';
import { openModal } from 'modal/actions';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import { ColumnsConfigProvider } from 'context-api/ColumnsConfigContext';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import {
  DashboardViewWrapper,
  DashboardContentWrapper,
  DashboardFirstVisitViewWrapper,
  DashboardScrollableList,
  DashboardListWrapper,
  StyledConfetti,
} from './styled';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import newUserTourHooks from './new-user-tour-hooks';

const DashboardView = ({ tabName }) => {
  const pusher = useRef(initializePusher());
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const [
    firstCreatedUserListIdentifier,
    setFirstCreatedUserListIdentifier,
  ] = useState(null);
  const [openConfetti, setOpenConfetti] = useState(false);

  const { usageState } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};

  const createListViewVisible = !hasExistingLists || hasOnlyInvitedLists;

  useEffect(() => {
    dispatch(initializeDashboardState(tabName));

    return () => {
      dispatch(clearFiltersForMegaFilter());
    };
  }, [dispatch, tabName]);

  useEffect(() => {
    return () => {
      dispatch(clearDashboardState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const callback = ({ eventType, task }) => {
      if (
        task.assignedToUsers?.some(
          ({ userIdentifier }) => userIdentifier === currentUserIdentifier,
        )
      ) {
        if (
          eventType?.startsWith('CREATE_TASK') ||
          eventType?.startsWith('DUPLICATE_TASK')
        ) {
          dispatch(TaskActions.insertCreatedTask(task.taskIdentifier));
        } else {
          dispatch(TaskActions.refreshTask(task.taskIdentifier));
        }
      }
    };

    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
    let ch;

    if (currentUserIdentifier) {
      ch = pusher.current.subscribe(channelName);
      ch.bind('task-update', callback);
    }

    return () => {
      if (ch) {
        ch.unbind('task-update', callback);
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

  const refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

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
    refreshAccessToken(currentUser);
  });

  const handleCreateFirstList = () => {
    let firstListIdentifier;
    onNewUserTourEnter('Opened create list modal');
    dispatch(
      openModal('ListForm', {
        onListCreationSuccess: taskListIdentifier => {
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

  const {
    tourModalIsOpen,
    forceOpenTourModal,
    renderNewUserTour,
  } = newUserTourHooks({
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
              <div>
                <DashboardHeader />
                <Spacing vertical={3} />
              </div>
              {createListViewVisible ? (
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
                    acceptInvitation={list =>
                      dispatch(TaskListActions.acceptInviteToTaskList(list))
                    }
                  />
                </DashboardFirstVisitViewWrapper>
              ) : (
                <DashboardListWrapper fullWidth={createListViewVisible}>
                  <DashboardList
                    currentUser={currentUser}
                    tourModalIsOpen={tourModalIsOpen}
                    openTourModal={forceOpenTourModal}
                    customerTypeLabel={customerTypeLabel}
                  />
                </DashboardListWrapper>
              )}
            </DashboardScrollableList>
          </DashboardContentWrapper>
        )}
        {renderNewUserTour()}
      </DashboardViewWrapper>
    </ColumnsConfigProvider>
  );
};

export default DashboardView;
