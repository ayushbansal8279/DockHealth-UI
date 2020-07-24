/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { isNil } from 'ramda';
import localStorageHelper from 'helpers/local-storage-helper';
import Tour from 'components/tour-wizard/Tour/Tour';
import { DashboardTourWrapper, DashboardTourBackground } from './styled';
import { FIRST_TOUR_STEPS, SECOND_TOUR_STEPS } from './dashboard-tour-steps';

export const DASHBOARD_FIRST_TIME_KEY = 'STORAGE_DASHBOARD_FIRST_TIME';
export const DASHBOARD_SECOND_TIME_KEY = 'STORAGE_DASHBOARD_SECOND_TIME';
export const STORAGE_DASHBOARD_THIRD_TIME_KEY =
  'STORAGE_DASHBOARD_THIRD_TIME_KEY';

const existingUserTourHooks = ({
  isLoadingDashboard,
  createListViewVisible,
  currentUserLoaded,
  lists,
}) => {
  const [openedTour, setOpenendTour] = useState(null);

  const hasAnyTask = lists.some(list => list.numberOfTasks > 0);

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

  useEffect(() => {
    if (
      !isLoadingDashboard &&
      currentUserLoaded &&
      !createListViewVisible &&
      hasAnyTask
    )
      openTourModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingDashboard,
    createListViewVisible,
    currentUserLoaded,
    hasAnyTask,
  ]);

  const renderExistingUserTour = () => {
    return (
      <>
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
    );
  };

  return {
    openedTour,
    closeFirstTour,
    closeSecondTour,
    renderExistingUserTour,
  };
};

export default existingUserTourHooks;
