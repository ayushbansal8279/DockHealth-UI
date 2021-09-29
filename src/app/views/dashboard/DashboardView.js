import React, { useState, useMemo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { isEmpty } from 'ramda';
import { updateCurrentUserPreferences } from 'actions/user-actions';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import {
  taskListsSelector,
  pendingTaskListsSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import * as TaskListActions from 'actions/task-list-actions';
import * as TaskListSagaActions from 'sagas/task-list-saga';
import * as UserAuthApi from 'api/user-auth-api';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import Spacing from 'components/common/Spacing';
import { openModal as openModalAction } from 'modal/actions';
import { onNewUserTourEnter } from 'helpers/ga-event-helper';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
// import DashboardStatistics from './DashboardStatistics/DashboardStatistics';
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
  taskLists = [],
  pendingTaskLists = [],
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

  const allLists = useMemo(() => [...taskLists, ...pendingTaskLists], [
    taskLists,
    pendingTaskLists,
  ]);

  const firstUserList = allLists?.find(
    list =>
      list.listType !== 'INBOX' &&
      list.listType !== 'PUBLIC' &&
      list.listType !== 'SHARED_SAMPLE',
  );

  const sampleList = allLists?.find(list => list.listType === 'SHARED_SAMPLE');

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
    openModal('ListForm', {
      onListCreationSuccess: taskListIdentifier => {
        onNewUserTourEnter('Create list success');
        firstListIdentifier = taskListIdentifier;
      },
      onClose: () => {
        if (firstListIdentifier) {
          fetchTasklistForUser();
          UserAuthApi.getUserByEmail(currentUser.email, currentUser);
          setFirstCreatedUserListIdentifier(firstListIdentifier);
          setOpenConfetti(true);
        }
      },
    });
  };

  useEffect(() => {
    if (currentUser && !isEmpty(currentUser) && !isNewUser) {
      const { userPreference } = currentUser || {};
      const { appFeaturesReviewed } = userPreference || {};

      if (!appFeaturesReviewed?.includes('PATIENT_CUSTOM_FIELD')) {
        dispatch(
          openModal('PatientCustomFieldTour', {
            onClose: () => {
              dispatch(
                updateCurrentUserPreferences({
                  appFeaturesReviewed: ['PATIENT_CUSTOM_FIELD'],
                }),
              );
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
    taskLists,
    isNewUser,
  });

  const location = window.location?.hash?.split('/');
  const dashboardTab = location.slice(-1)[0];

  return (
    <DashboardViewWrapper>
      {currentUserLoaded && (
        <DashboardContentWrapper>
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
                  sampleList={sampleList}
                  acceptInvitation={acceptInviteToTaskList}
                />
              </DashboardFirstVisitViewWrapper>
            ) : (
              <DashboardListWrapper fullWidth={createListViewVisible}>
                <DashboardHeaderContainer>
                  {/* <DashboardStatistics
                    dashboardTab={dashboardTab}
                    customerTypeLabel={customerTypeLabel}
                  /> */}
                </DashboardHeaderContainer>
                <DashboardList
                  currentUser={currentUser}
                  isTaskDrawerOpen={isTaskDrawerOpen}
                  dashboardTab={dashboardTab}
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
  );
};

const mapStateToProps = state => ({
  taskLists: taskListsSelector(state),
  pendingTaskLists: pendingTaskListsSelector(state),
  isTaskDrawerOpen: taskDrawerOpenSelector(state),
  isLoadingDashboard: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = {
  openModal: openModalAction,
  setTaskListAsCurrentList: TaskListActions.setTaskListAsCurrentList,
  fetchTasklistForUser: TaskListSagaActions.fetchTasklistForUser,
  acceptInviteToTaskList: TaskListActions.acceptInviteToTaskList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
