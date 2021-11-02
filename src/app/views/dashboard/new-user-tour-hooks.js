/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as TemplateActions from 'actions/template-actions';
import { SubmenuKey } from 'components/navigation/NavigationSidebar/NavigationSidebar';
import TourPopover from 'components/tour-popover/TourPopper/TourPopper';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
import localStorageHelper from 'helpers/local-storage-helper';
import { isNil } from 'ramda';
import {
  onNewUserTourEnter,
  onInboxTourEnter,
  onHomeTipsOpened,
} from 'helpers/ga-event-helper';
import Tour from 'components/tour-wizard/Tour/Tour';
import { DashboardTourWrapper, DashboardTourBackground } from './styled';
import { FIRST_TOUR_STEPS } from './dashboard-tour-steps';

export const DASHBOARD_FIRST_TIME_KEY = 'STORAGE_DASHBOARD_FIRST_TIME';
export const STORAGE_DASHBOARD_TOUR_INBOX_KEY =
  'STORAGE_DASHBOARD_TOUR_INBOX_KEY';

const newUserTourHooks = ({
  firstCreatedUserListIdentifier,
  setFirstCreatedUserListIdentifier,
  lists,
  isNewUser,
}) => {
  const dispatch = useDispatch();

  const [openedModalTour, setOpenendModalTour] = useState(null);
  const isModalAutoTriggered = useRef(true);

  const [firstListElement, setFirstListElement] = useState(null);
  const [firstListIdentifier, setFirstListIdentifier] = useState(null);
  const [inboxListElement, setInboxListElement] = useState(null);
  const [inboxPopoverOpen, setInboxPopoverOpen] = useState(false);
  const history = useHistory();

  const hasAnyTask = lists?.some(list => list.numberOfTasks > 0);
  const hasInbox = lists?.some(({ listType }) => listType === 'INBOX');

  const startUserModalFlow = () => {
    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );

    if (isNil(dashboardFirstTimeValue) || dashboardFirstTimeValue) {
      setOpenendModalTour(1);
    } else {
      const dashboardInboxTourValue = localStorageHelper.getItem(
        STORAGE_DASHBOARD_TOUR_INBOX_KEY,
      );

      if (
        (isNil(dashboardInboxTourValue) || dashboardInboxTourValue) &&
        hasInbox
      ) {
        dispatch(TemplateActions.showSubMenu(SubmenuKey.LISTS));
        setTimeout(() => {
          const inboxElement = document.querySelector(
            `.drawer-menu-list-inbox`,
          );
          setInboxListElement(inboxElement);
          setInboxPopoverOpen(true);
          onInboxTourEnter('Inbox introduction');
        }, 500);
      }
    }
  };

  const closeFirstModalTour = () => {
    isModalAutoTriggered.current = true;
    setOpenendModalTour(null);
    localStorageHelper.setItem(DASHBOARD_FIRST_TIME_KEY, false);
  };

  const forceOpenTourModal = () => {
    if (!openedModalTour) {
      isModalAutoTriggered.current = false;
      onHomeTipsOpened();
      setOpenendModalTour(1);
    }
  };

  useEffect(() => {
    if (!isNewUser) return;

    if (
      firstCreatedUserListIdentifier &&
      !inboxPopoverOpen &&
      !openedModalTour
    ) {
      const targetListIdentifier = firstCreatedUserListIdentifier;
      setFirstCreatedUserListIdentifier(null);
      dispatch(TemplateActions.showSubMenu(SubmenuKey.LISTS));
      setTimeout(() => {
        const listElement = document.querySelector(
          `.drawer-menu-list-item[data-list-id="${targetListIdentifier}"]`,
        );
        setFirstListIdentifier(targetListIdentifier);
        setFirstListElement(listElement);
        onNewUserTourEnter('Create list congrats');
      }, 500);
    } else if (hasAnyTask) {
      startUserModalFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCreatedUserListIdentifier, isNewUser]);

  const closeInboxPopup = () => {
    setInboxPopoverOpen(false);
    localStorageHelper.setItem(STORAGE_DASHBOARD_TOUR_INBOX_KEY, false);
  };

  const renderNewUserTour = () => (
    <>
      {openedModalTour && (
        <>
          <DashboardTourWrapper>
            {openedModalTour === 1 && (
              <Tour
                modalName="Home tour modal"
                modalAutoTriggered={isModalAutoTriggered?.current}
                steps={FIRST_TOUR_STEPS}
                onClose={closeFirstModalTour}
              />
            )}
          </DashboardTourWrapper>
          <DashboardTourBackground onClick={closeFirstModalTour} />
        </>
      )}
      <TourPopover
        anchorEl={firstListElement}
        position="right-start"
        open={!!(firstListIdentifier && firstListElement)}
        onClose={() => setFirstListIdentifier(null)}
      >
        <StandardTourContent
          title="Congrats on adding your first list!"
          description="Lists will appear in this section of the page and will have a blue dot next to the number if there’s new actiity since the last time you logged in."
          buttonText="Add a task to this list"
          onButtonClick={() => {
            setFirstListIdentifier(null);
            history.push(`/core/task-tour/${firstListIdentifier}`);
          }}
          width={526}
        />
      </TourPopover>
      <TourPopover
        anchorEl={inboxListElement}
        position="right-start"
        open={!!(inboxPopoverOpen && inboxListElement)}
        onClose={closeInboxPopup}
      >
        <StandardTourContent
          title="Turn an email into a task"
          description="Turn an email into a task by forwarding and email to : Task@DockHealth.email. Your inbox is where your forwarded emails will land and you can move them to any list you’d like. You can also use the inbox as a place to keep tasks of your own."
          buttonText="Got it"
          onButtonClick={closeInboxPopup}
          width={450}
        />
      </TourPopover>
    </>
  );

  return {
    tourModalIsOpen: openedModalTour === 1,
    forceOpenTourModal,
    renderNewUserTour,
  };
};

export default newUserTourHooks;
