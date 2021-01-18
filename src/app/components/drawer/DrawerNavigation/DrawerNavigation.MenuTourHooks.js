/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState, useEffect } from 'react';
import { isNil } from 'ramda';
import localStorageHelper from 'helpers/local-storage-helper';
import TourPopper from 'components/tour-popover/TourPopper/TourPopper';
import TaskDrawerTourContent from 'components/tour-popover/content/TaskDrawerTourContent/TaskDrawerTourContent';
import { onMenuTourStepEnter } from 'helpers/ga-event-helper';

const MENU_DRAWER_FIRST_TIME_KEY = 'MENU_DRAWER_FIRST_TIME_KEY';

const menuTourHooks = ({ menuDrawerOpen, hideTour, isUserAdmin }) => {
  const [openedTourStep, setOpenedTourStep] = useState(null);

  const orgMenuReference = useRef(null);
  const settingsMenuReference = useRef(null);
  const profileMenuReference = useRef(null);

  const orgMenuStep = {
    reference: orgMenuReference,
    position: 'right-start',
    afterScrollPosition: 'center',
    title: 'Access your Organization',
    description:
      'We understand there are instances when people work with more than one oganization. If you own your own practice yet are a partner at anpther practice, you may want to use Dock at both organizations but keep your patients and people you work with separate. Here is where you add and access your organizations.',
  };

  const settingsMenuStep = {
    reference: settingsMenuReference,
    position: 'right-end',
    afterScrollPosition: 'end',
    title: 'Manage users and subscription',
    description:
      'Click the gear to see your subscription and manage your users.  Invite or remove users from your organization from here.',
  };

  const profileMenuStep = {
    reference: profileMenuReference,
    position: 'right-end',
    title: 'Access your profile',
    description:
      'Click the bubble to access your profile or to logout of Dock.',
  };

  const tourSteps = isUserAdmin
    ? [
        {
          index: 0,
          ...orgMenuStep,
        },
        {
          index: 1,
          ...settingsMenuStep,
        },
        {
          index: 2,
          ...profileMenuStep,
        },
      ]
    : [
        {
          index: 0,
          ...orgMenuStep,
        },
        {
          index: 1,
          ...profileMenuStep,
        },
      ];

  const previousHideTourValue = useRef(null);

  useEffect(() => {
    if (hideTour && !previousHideTourValue && openedTourStep !== null) {
      setOpenedTourStep(null);
    }
    previousHideTourValue.current = hideTour;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideTour]);

  useEffect(() => {
    if (openedTourStep !== null) {
      const { reference, afterScrollPosition, title } = tourSteps[
        openedTourStep
      ];

      // eslint-disable-next-line no-unused-expressions
      reference?.current?.scrollIntoView({
        behavior: 'smooth',
        block: afterScrollPosition || 'center',
      });

      onMenuTourStepEnter(title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTourStep]);

  useEffect(() => {
    if (hideTour) return;

    const menuDrawerFirstTimeValue = localStorageHelper.getItem(
      MENU_DRAWER_FIRST_TIME_KEY,
    );

    if (isNil(menuDrawerFirstTimeValue) || menuDrawerFirstTimeValue) {
      setOpenedTourStep(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuDrawerOpen]);

  const closeTour = () => {
    localStorageHelper.setItem(MENU_DRAWER_FIRST_TIME_KEY, false);
    setOpenedTourStep(null);
  };

  const renderMenuTourPopover = () => {
    return (
      <>
        {openedTourStep !== null &&
          tourSteps.map(({ reference, index, position }) => (
            <TourPopper
              key={index}
              anchorEl={reference?.current}
              position={position}
              open={openedTourStep === index}
              onClose={closeTour}
            >
              <TaskDrawerTourContent
                steps={tourSteps}
                currentStepIndex={index}
                setStep={setOpenedTourStep}
                onClose={closeTour}
              />
            </TourPopper>
          ))}
      </>
    );
  };

  return {
    orgMenuReference,
    settingsMenuReference,
    profileMenuReference,
    renderMenuTourPopover,
  };
};

export default menuTourHooks;
