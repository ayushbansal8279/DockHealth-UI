import React, { useState, useMemo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { isEmpty } from 'ramda';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import { listsSelector } from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TaskListActions from 'actions/tasklist-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as TaskListSagaActions from 'sagas/tasklist-saga';
import * as UserApi from 'api/user-api';
import Spacing from 'components/common/Spacing';
import { openModal as openModalAction } from 'modal/actions';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import DashboardStatistics from './DashboardStatistics/DashboardStatistics';
import {
  DashboardViewWrapper,
  DashboardContentWrapper,
  DashboardHeaderContainer,
  DashboardFirstVisitViewWrapper,
  DashboardScrollableList,
  DashboardListWrapper,
  StyledConfetti,
} from './styled';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import newUserTourHooks from './new-user-tour-hooks';

const DashboardView = ({
  isTaskDrawerOpen,
  lists = [],
  pendingLists = [],
  currentUser,
  openModal,
  fetchTasklistForUser,
  acceptInviteToTaskList,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const [
    firstCreatedUserListIdentifier,
    setFirstCreatedUserListIdentifier,
  ] = useState(null);
  const [openConfetti, setOpenConfetti] = useState(false);

  const currentUserLoaded = currentUser && !isEmpty(currentUser);
  const { usageState } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};

  const createListViewVisible = !hasExistingLists || hasOnlyInvitedLists;

  const allLists = useMemo(() => [...lists, ...pendingLists], [
    lists,
    pendingLists,
  ]);

  const firstUserList = allLists?.find(list => list.listType !== 'INBOX');

  const shouldHideSidebar = isTaskDrawerOpen && window.innerWidth < 1920;

  const isNewUser = currentUser?.usageState?.loginCount <= 5;

  const refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserApi.refreshAccessToken(user.username);
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
    openModal('ListForm', {
      onListCreationSuccess: taskListIdentifier => {
        onNewUserTourEnter('Create list success');
        firstListIdentifier = taskListIdentifier;
      },
      onClose: () => {
        fetchTasklistForUser();
        UserApi.getUserByEmail(currentUser.email, currentUser);
        setFirstCreatedUserListIdentifier(firstListIdentifier);
        setOpenConfetti(true);
      },
    });
  };

  useEffect(() => {
    if (currentUser && !isEmpty(currentUser) && !isNewUser) {
      const { userPreference: { appFeaturesReviewed } = {} } = currentUser;

      if (!appFeaturesReviewed?.includes('TASK_DENSITY')) {
        dispatch(
          openModal('TaskDensityTour', {
            onClose: () => {
              UserApi.updateUserDashboardPrefs({
                appFeaturesReviewed: ['TASK_DENSITY'],
              });
            },
          }),
        );
      }
    }
  }, [currentUser, dispatch, isNewUser, openModal]);

  const {
    tourModalIsOpen,
    forceOpenTourModal,
    renderNewUserTour,
  } = newUserTourHooks({
    firstCreatedUserListIdentifier,
    setFirstCreatedUserListIdentifier,
    lists,
    isNewUser,
  });

  const location = window.location?.hash?.split('/');
  const dashboardTab = location.slice(-1)[0];

  return (
    <DashboardViewWrapper>
      <ViewLoader isFetchingData={!currentUserLoaded}>
        <DashboardContentWrapper hasRightPadding={shouldHideSidebar}>
          {openConfetti && <StyledConfetti recycle={false} />}
          <DashboardScrollableList>
            <div>
              <DashboardHeaderContainer>
                <DashboardHeader
                  isUserFirstTime={
                    createListViewVisible || firstCreatedUserListIdentifier
                  }
                  currentUser={currentUser}
                />
              </DashboardHeaderContainer>
              <Spacing vertical={3} />
            </div>
            {createListViewVisible ? (
              <DashboardFirstVisitViewWrapper>
                <DashboardFirstVisitView
                  hasInvitedLists={hasOnlyInvitedLists}
                  onCreateList={handleCreateFirstList}
                  onTakeATour={() => {
                    onNewUserTourEnter('Video tutorial');
                    openModal('Video', {
                      title: 'Emailing a Task to Dock Health',
                      url: 'https://www.youtube.com/embed/FlScR9Rjq1E',
                    });
                  }}
                  list={firstUserList}
                  acceptInvitation={acceptInviteToTaskList}
                />
              </DashboardFirstVisitViewWrapper>
            ) : (
              <DashboardListWrapper fullWidth={createListViewVisible}>
                <DashboardHeaderContainer>
                  <DashboardStatistics dashboardTab={dashboardTab} />
                </DashboardHeaderContainer>
                <DashboardList
                  currentUser={currentUser}
                  isTaskDrawerOpen={isTaskDrawerOpen}
                  dashboardTab={dashboardTab}
                  tourModalIsOpen={tourModalIsOpen}
                  openTourModal={forceOpenTourModal}
                />
              </DashboardListWrapper>
            )}
          </DashboardScrollableList>
        </DashboardContentWrapper>
      </ViewLoader>
      {renderNewUserTour()}
    </DashboardViewWrapper>
  );
};

const mapStateToProps = state => ({
  lists: listsSelector(state),
  pendingLists: state.invitationState.pendingTasklists,
  isTaskDrawerOpen: state.taskDrawerState.open,
  isLoadingDashboard: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = {
  openModal: openModalAction,
  setTaskListAsCurrentList: TaskListActions.setTaskListAsCurrentList,
  fetchTasklistForUser: TaskListSagaActions.fetchTasklistForUser,
  acceptInviteToTaskList: InvitationActions.acceptInviteToTaskList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
