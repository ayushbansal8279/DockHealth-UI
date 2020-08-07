/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { hashHistory } from 'react-router';
import TourPopover from 'components/tour-popover/TourPopper/TourPopper';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
import {
  DASHBOARD_FIRST_TIME_KEY,
  STORAGE_DASHBOARD_TOUR_INBOX_KEY,
} from 'views/Dashboard/existing-user-tour-hooks';
import localStorageHelper from 'helpers/local-storage-helper';
import { isNil } from 'ramda';

const initializeUserTourItems = ({
  shouldDisplayFirstListCreationMessage,
  closeListCreationSuccessMessage,
  currentUser,
}) => {
  const [firstListElement, setFirstListElement] = useState(null);
  const [inboxElement, setInboxElement] = useState(null);
  const [inboxPopoverOpen, setInboxPopoverOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.usageState?.loginCount >= 5) return;

    const dashboardFirstTimeValue = localStorageHelper.getItem(
      DASHBOARD_FIRST_TIME_KEY,
    );

    if (dashboardFirstTimeValue === false) {
      const dashboardInboxTourValue = localStorageHelper.getItem(
        STORAGE_DASHBOARD_TOUR_INBOX_KEY,
      );

      if (isNil(dashboardInboxTourValue) || dashboardInboxTourValue) {
        setInboxPopoverOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inboxElement]);

  const isListPopoverOpen =
    shouldDisplayFirstListCreationMessage && firstListElement;

  const closeInboxPopup = () => {
    setInboxPopoverOpen(false);
    localStorageHelper.setItem(STORAGE_DASHBOARD_TOUR_INBOX_KEY, false);
  };

  const setTourPopupReferences = (element, listType, taskListIdentifier) => {
    if (element) {
      if (firstListElement === null && listType !== 'INBOX') {
        setFirstListElement({
          reference: element,
          taskListIdentifier,
        });
      }
      if (inboxElement === null && listType === 'INBOX') {
        setInboxElement({
          reference: element,
          taskListIdentifier,
        });
      }
    }
  };

  const renderTourItems = () => {
    return (
      <>
        <TourPopover
          anchorEl={firstListElement?.reference}
          position="bottom-start"
          open={isListPopoverOpen}
          onClose={closeListCreationSuccessMessage}
        >
          <StandardTourContent
            title="Congrats on adding your first list!"
            description="Lists will appear in this section of the page and will have a blue dot next to the number if there’s new actiity since the last time you logged in."
            buttonText="Add a task to this list"
            onButtonClick={() => {
              closeListCreationSuccessMessage();
              hashHistory.push(
                `task-tour/${firstListElement?.taskListIdentifier}`,
              );
            }}
            width={526}
          />
        </TourPopover>
        <TourPopover
          anchorEl={inboxElement?.reference}
          position="right"
          open={inboxPopoverOpen && inboxElement?.reference}
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

  return {
    renderTourItems,
    setTourPopupReferences,
  };
};

export default initializeUserTourItems;
