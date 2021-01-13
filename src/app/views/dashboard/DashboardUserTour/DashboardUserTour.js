/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as TemplateActions from 'actions/template-actions';
import { hasInboxList } from 'selectors/task-list-selectors';
import { LISTS_SUBMENU_KEY } from 'components/drawer/DrawerNavigation/DrawerNavigation';
import TourPopover from 'components/tour-popover/TourPopper/TourPopper';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
import {
  DASHBOARD_FIRST_TIME_KEY,
  STORAGE_DASHBOARD_TOUR_INBOX_KEY,
} from 'views/dashboard/existing-user-tour-hooks';
import localStorageHelper from 'helpers/local-storage-helper';
import { isNil } from 'ramda';
import { onNewUserTourEnter, onInboxTourEnter } from 'helpers/ga-event-helper';
import { useDispatch, useSelector } from 'react-redux';

const DashboardUserTour = ({
  firstCreatedUserListIdentifier,
  setFirstCreatedUserListIdentifier,
}) => {
  const dispatch = useDispatch();
  const [firstListElement, setFirstListElement] = useState(null);
  const [firstListIdentifier, setFirstListIdentifier] = useState(null);
  const [inboxListElement, setInboxListElement] = useState(null);
  const [inboxPopoverOpen, setInboxPopoverOpen] = useState(false);
  const history = useHistory();

  const hasInbox = useSelector(hasInboxList);

  const startUserModalFlow = () => {
    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );

    if (dashboardFirstTimeValue === false) {
      const dashboardInboxTourValue = localStorageHelper.getItem(
        STORAGE_DASHBOARD_TOUR_INBOX_KEY,
      );

      if (isNil(dashboardInboxTourValue) || dashboardInboxTourValue) {
        dispatch(TemplateActions.showSubMenu(LISTS_SUBMENU_KEY));
        setTimeout(() => {
          const inboxElement = document.querySelector(
            `.drawer-menu-list-inbox`,
          );
          setInboxListElement(inboxElement);
          setInboxPopoverOpen(true);
          onInboxTourEnter('Inbox introduction');
        });
      }
    }
  };

  useEffect(() => {
    if (firstCreatedUserListIdentifier) {
      const targetListIdentifier = firstCreatedUserListIdentifier;
      setFirstCreatedUserListIdentifier(false);
      dispatch(TemplateActions.showSubMenu(LISTS_SUBMENU_KEY));
      setTimeout(() => {
        const listElement = document.querySelector(
          `.drawer-menu-list-item[data-list-id="${targetListIdentifier}"]`,
        );
        setFirstListIdentifier(targetListIdentifier);
        setFirstListElement(listElement);
        onNewUserTourEnter('Create list congrats');
      });
    } else if (hasInbox) {
      startUserModalFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCreatedUserListIdentifier]);

  const closeInboxPopup = () => {
    setInboxPopoverOpen(false);
    localStorageHelper.setItem(STORAGE_DASHBOARD_TOUR_INBOX_KEY, false);
  };

  return (
    <>
      <TourPopover
        anchorEl={firstListElement}
        position="right-start"
        open={firstListIdentifier && firstListElement}
        onClose={() => setFirstListIdentifier(null)}
      >
        <StandardTourContent
          title="Congrats on adding your first list!"
          description="Lists will appear in this section of the page and will have a blue dot next to the number if there’s new actiity since the last time you logged in."
          buttonText="Add a task to this list"
          onButtonClick={() => {
            setFirstListIdentifier(null);
            history.push(`task-tour/${firstListIdentifier}`);
          }}
          width={526}
        />
      </TourPopover>
      <TourPopover
        anchorEl={inboxListElement}
        position="right-start"
        open={inboxPopoverOpen && inboxListElement}
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
};

export default DashboardUserTour;
