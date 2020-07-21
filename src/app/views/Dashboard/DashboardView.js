import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useMount } from 'react-use';
import { isNil, isEmpty } from 'ramda';
import MenuIcon from 'img/menu-icon';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import { listsSelector } from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TemplateActions from 'actions/template-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as TaskListSagaActions from 'sagas/tasklist-saga';
import * as UserApi from 'api/user-api';
import localStorageHelper from 'helpers/local-storage-helper';
import Spacing from 'components/common/Spacing';
import Tour from 'components/tour-wizard/Tour/Tour';
import { openModal as openModalAction } from 'modal/actions';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardList from './DashboardList/DashboardList';
import DashboardFirstVisitView from './DashboardFirstVisitView/DashboardFirstVisitView';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
  DashboardTourWrapper,
  DashboardTourBackground,
  DashboardHeaderContainer,
  MenuButton,
  DashboardFirstVisitViewWrapper,
} from './styled';
import { FIRST_TOUR_STEPS, SECOND_TOUR_STEPS } from './dashboard-tour-steps';
import DashboardHeader from './DashboardHeader/DashboardHeader';

const DASHBOARD_FIRST_TIME_KEY = 'STORAGE_DASHBOARD_FIRST_TIME';
const DASHBOARD_SECOND_TIME_KEY = 'STORAGE_DASHBOARD_SECOND_TIME';

const DashboardView = ({
  isTaskDrawerOpen,
  isLoadingDashboard,
  lists,
  showNavbar,
  currentUser,
  openModal,
  setTaskListAsCurrentList,
  fetchTasklistForUser,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [openedTour, setOpenendTour] = useState(null);

  const currentUserLoaded = currentUser && !isEmpty(currentUser);
  const { usageState } = currentUser ?? {};
  const { hasExistingLists, hasOnlyInvitedLists } = usageState ?? {};

  const createListView = !hasExistingLists || hasOnlyInvitedLists;

  const shouldHideSidebar = isTaskDrawerOpen && window.innerWidth < 1920;

  const openTourModal = () => {
    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );
    if (isNil(dashboardFirstTimeValue) || dashboardFirstTimeValue) {
      setOpenendTour(1);
    } else {
      const dashboardSecondTimeValue = localStorageHelper.getItem(
        DASHBOARD_SECOND_TIME_KEY,
      );

      if (isNil(dashboardSecondTimeValue) || dashboardSecondTimeValue) {
        setOpenendTour(2);
      }
    }
  };

  const closeFirstTour = () => {
    setOpenendTour(null);
    localStorageHelper.setItem(DASHBOARD_FIRST_TIME_KEY, false);
  };

  const closeSecondTour = () => {
    setOpenendTour(null);
    localStorageHelper.setItem(DASHBOARD_SECOND_TIME_KEY, false);
  };

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

  const handleCreateList = () => {
    setTaskListAsCurrentList(null);
    openModal('CreateList', {
      test: 'test',
      onClose: () => {
        UserApi.getUserByEmail(currentUser.email, currentUser);
        fetchTasklistForUser();
      },
    });
  };

  useEffect(() => {
    if (!isLoadingDashboard && currentUserLoaded && !createListView)
      openTourModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDashboard, createListView, currentUserLoaded]);

  return (
    <DashboardViewWrapper>
      <ViewLoader isFetchingData={!currentUserLoaded}>
        <>
          {hasExistingLists && (
            <DashboardSidebarWrapper isHidden={shouldHideSidebar}>
              <DashboardSidebar lists={lists} showNavbar={showNavbar} />
            </DashboardSidebarWrapper>
          )}
          <DashboardContentWrapper
            fullWidth={createListView}
            hasRightPadding={shouldHideSidebar}
          >
            <DashboardHeaderContainer>
              {!hasExistingLists && (
                <MenuButton onClick={showNavbar}>
                  <img src={MenuIcon} alt="menu" />
                </MenuButton>
              )}
              <DashboardHeader
                isUserFirstTime={createListView}
                currentUser={currentUser}
              />
            </DashboardHeaderContainer>
            <Spacing vertical={3} />
            {createListView ? (
              <DashboardFirstVisitViewWrapper>
                <DashboardFirstVisitView
                  hasInvitedLists={hasOnlyInvitedLists}
                  onCreateList={handleCreateList}
                  onTakeATour={() => {}}
                  list={lists.find(list => list.listType !== 'INBOX')}
                />
              </DashboardFirstVisitViewWrapper>
            ) : (
              <DashboardList
                currentUser={currentUser}
                isTaskDrawerOpen={isTaskDrawerOpen}
              />
            )}
          </DashboardContentWrapper>
          {openedTour && (
            <>
              <DashboardTourWrapper>
                {openedTour === 1 && (
                  <Tour steps={FIRST_TOUR_STEPS} onClose={closeFirstTour} />
                )}
                {openedTour === 2 && (
                  <Tour
                    darkTheme
                    steps={SECOND_TOUR_STEPS}
                    onClose={closeSecondTour}
                  />
                )}
              </DashboardTourWrapper>
              <DashboardTourBackground
                onClick={openedTour === 1 ? closeFirstTour : closeSecondTour}
              />
            </>
          )}
        </>
      </ViewLoader>
    </DashboardViewWrapper>
  );
};

const mapStateToProps = state => ({
  lists: listsSelector(state),
  isTaskDrawerOpen: state.taskDrawerState.open,
  isLoadingDashboard: dashboardTasksIsLoadingSelector(state),
  currentUser: userProfileSelector(state),
});

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
  openModal: openModalAction,
  setTaskListAsCurrentList: TaskListActions.setTaskListAsCurrentList,
  fetchTasklistForUser: TaskListSagaActions.fetchTasklistForUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
