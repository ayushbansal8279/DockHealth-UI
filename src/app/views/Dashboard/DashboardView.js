import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import localStorageHelper from 'helpers/local-storage-helper';
import Tour from 'components/tour-wizard/Tour/Tour';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardContent from './DashboardContent/DashboardContent';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
  DashboardTourWrapper,
} from './styled';
import { FIRST_TOUR_STEPS, SECOND_TOUR_STEPS } from './dashboard-tour-steps';

const DASHBOARD_FIRST_TIME_KEY = 'STORAGE_DASHBOARD_FIRST_TIME';
const DASHBOARD_SECOND_TIME_KEY = 'STORAGE_DASHBOARD_SECOND_TIME';

const DashboardView = () => {
  const [openedTour, setOpenendTour] = useState(null);
  const isTaskDrawerOpen = useSelector(store => store.taskDrawerState.open);

  const openTourModal = () => {
    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );
    if (dashboardFirstTimeValue === undefined || dashboardFirstTimeValue) {
      setOpenendTour(1);
      localStorage.setItem(DASHBOARD_FIRST_TIME_KEY, false);
    } else {
      const dashboardSecondTimeValue = localStorageHelper.getItem(
        DASHBOARD_SECOND_TIME_KEY,
      );

      if (dashboardSecondTimeValue === undefined || dashboardSecondTimeValue) {
        setOpenendTour(2);
        localStorage.setItem(DASHBOARD_SECOND_TIME_KEY, false);
      }
    }
  };

  useEffect(() => {
    openTourModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardViewWrapper>
      <DashboardSidebarWrapper isHidden={isTaskDrawerOpen}>
        <DashboardSidebar />
      </DashboardSidebarWrapper>
      <DashboardContentWrapper hasRightPadding={isTaskDrawerOpen}>
        <DashboardContent isTaskDrawerOpen={isTaskDrawerOpen} />
      </DashboardContentWrapper>
      {openedTour && (
        <DashboardTourWrapper>
          {openedTour === 1 && (
            <Tour
              steps={FIRST_TOUR_STEPS}
              onClose={() => setOpenendTour(null)}
            />
          )}
          {openedTour === 2 && (
            <Tour
              steps={SECOND_TOUR_STEPS}
              onClose={() => setOpenendTour(null)}
            />
          )}
        </DashboardTourWrapper>
      )}
    </DashboardViewWrapper>
  );
};

export default DashboardView;
