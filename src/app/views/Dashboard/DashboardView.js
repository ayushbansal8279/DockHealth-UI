import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { useMount } from 'react-use';
import { isNil } from 'ramda';
import MenuIcon from 'img/menu-icon';
import { dashboardTasksIsLoadingSelector } from 'selectors/dashboard-tasks-selectors';
import { listsSelector } from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import * as TemplateActions from 'actions/template-actions';
import localStorageHelper from 'helpers/local-storage-helper';
import Spacing from 'components/common/Spacing';
import Tour from 'components/tour-wizard/Tour/Tour';
import * as userApi from 'api/user-api';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardContent from './DashboardContent/DashboardContent';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
  DashboardTourWrapper,
  DashboardTourBackground,
  DashboardHeaderContainer,
  MenuButton,
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [openedTour, setOpenendTour] = useState(null);
  const currentUser = useSelector(store => store.userState.user);

  const shouldHideSidebar = isTaskDrawerOpen && window.innerWidth < 1920;
  const hasAnyList = lists?.length > 0;
  const firstTour = false;

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
      // console.log('refresh token on timeout');
      userApi.refreshAccessToken(user.username);
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

  useEffect(() => {
    if (!isLoadingDashboard) openTourModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDashboard]);

  return (
    <DashboardViewWrapper>
      {hasAnyList && (
        <DashboardSidebarWrapper isHidden={shouldHideSidebar}>
          <DashboardSidebar lists={lists} showNavbar={showNavbar} />
        </DashboardSidebarWrapper>
      )}
      <DashboardContentWrapper hasRightPadding={shouldHideSidebar}>
        <DashboardHeaderContainer>
          {!hasAnyList && (
            <MenuButton onClick={showNavbar}>
              <img src={MenuIcon} alt="menu" />
            </MenuButton>
          )}
          <DashboardHeader currentUser={currentUser} />
        </DashboardHeaderContainer>
        <Spacing vertical={3} />
        {firstTour ? (
          <div>first tour</div>
        ) : (
          <DashboardContent
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
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
