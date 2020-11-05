/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef } from 'react';
import { isNil } from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDashboardPrefs } from 'api/user-api';
import { userProfileSelector } from 'selectors/user-selectors';
import { openModal } from 'modal/actions';
import localStorageHelper from 'helpers/local-storage-helper';
import Tour from 'components/tour-wizard/Tour/Tour';
import { DashboardTourWrapper, DashboardTourBackground } from './styled';
import { FIRST_TOUR_STEPS } from './dashboard-tour-steps';

export const DASHBOARD_FIRST_TIME_KEY = 'STORAGE_DASHBOARD_FIRST_TIME';
export const STORAGE_DASHBOARD_TOUR_INBOX_KEY =
  'STORAGE_DASHBOARD_TOUR_INBOX_KEY';

const existingUserTourHooks = ({
  isLoadingDashboard,
  createListViewVisible,
  currentUserLoaded,
  lists,
}) => {
  const dispatch = useDispatch();
  const [openedTour, setOpenendTour] = useState(null);
  const isModalAutoTriggered = useRef(true);

  const hasAnyTask = lists?.some(list => list.numberOfTasks > 0);

  const userProfile = useSelector(userProfileSelector);

  const checkNewFeaturesModals = () => {
    if (userProfile && userProfile.userPreference) {
      const { userPreference: { appFeaturesReviewed } = {} } = userProfile;

      if (!appFeaturesReviewed?.includes('NOTIFICATION_SETTINGS')) {
        dispatch(
          openModal('NotificationSettingsTour', {
            onClose: () => {
              updateUserDashboardPrefs({
                appFeaturesReviewed: ['NOTIFICATION_SETTINGS'],
              });
            },
          }),
        );
      }
    }
  };

  const openTourModal = () => {
    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );
    if (isNil(dashboardFirstTimeValue) || dashboardFirstTimeValue) {
      setOpenendTour(1);
    } else {
      checkNewFeaturesModals();
    }
  };

  const closeFirstTour = () => {
    isModalAutoTriggered.current = true;
    setOpenendTour(null);
    localStorageHelper.setItem(DASHBOARD_FIRST_TIME_KEY, false);
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
                <Tour
                  modalName="Home tour modal"
                  modalAutoTriggered={isModalAutoTriggered?.current}
                  steps={FIRST_TOUR_STEPS}
                  onClose={closeFirstTour}
                />
              )}
            </DashboardTourWrapper>
            <DashboardTourBackground onClick={closeFirstTour} />
          </>
        )}
      </>
    );
  };

  const forceOpenTourModal = () => {
    if (!openedTour) {
      isModalAutoTriggered.current = false;
      setOpenendTour(1);
    }
  };

  return {
    openedTour,
    closeFirstTour,
    renderExistingUserTour,
    tourModalIsOpen: openedTour === 1,
    forceOpenTourModal,
  };
};

export default existingUserTourHooks;
