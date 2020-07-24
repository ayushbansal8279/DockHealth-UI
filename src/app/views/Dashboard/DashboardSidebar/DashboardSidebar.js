import React, { useRef, useState, useEffect } from 'react';
import { Link, hashHistory } from 'react-router';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import ArrowIcon from 'img/arrow';
import TourPopover from 'components/tour-popover/TourPopper/TourPopper';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
import {
  DASHBOARD_SECOND_TIME_KEY,
  STORAGE_DASHBOARD_THIRD_TIME_KEY,
} from 'views/Dashboard/existing-user-tour-hooks';
import localStorageHelper from 'helpers/local-storage-helper';
import { isNil } from 'ramda';
import {
  TopSection,
  MenuButton,
  ListsHeader,
  ListItem,
  ListItemsWrapper,
  ListItemTitle,
  TitleText,
  ListItemInfo,
  DashboardSidebarWrapper,
  PrivateListIcon,
  ListsSection,
  InfoDot,
  Arrow,
  RolloverPopover,
  RolloverPopoverLabel,
} from './styled';

const DashboardSidebar = ({
  lists,
  showNavbar,
  shouldDisplayFirstListCreationMessage,
  closeListCreationSuccessMessage,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [firstListElement, setFirstListElement] = useState(null);
  const [inboxElement, setInboxElement] = useState(null);
  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);
  const [inboxPopoverOpen, setInboxPopoverOpen] = useState(false);

  const isListPopoverOpen =
    shouldDisplayFirstListCreationMessage && firstListElement;

  const handleMouseEnter = (event, listName) => {
    const { target } = event;

    if (target?.scrollWidth > target?.offsetWidth) {
      hoveredItemReference.current = target;
      setPopoverLabel(listName);
    }
  };

  const filteredList = shouldDisplayFirstListCreationMessage
    ? lists?.filter(({ listType }) => listType !== 'INBOX')
    : lists;

  useEffect(() => {
    const dashboardSecondTimeValue = localStorageHelper.getItem(
      DASHBOARD_SECOND_TIME_KEY,
    );

    if (dashboardSecondTimeValue === false) {
      const dashboardThirdTimeValue = localStorageHelper.getItem(
        STORAGE_DASHBOARD_THIRD_TIME_KEY,
      );

      if (isNil(dashboardThirdTimeValue) || dashboardThirdTimeValue) {
        setInboxPopoverOpen(true);
      }
    }
  }, [inboxElement]);

  const closeInboxPopup = () => {
    setInboxPopoverOpen(false);
    localStorageHelper.setItem(STORAGE_DASHBOARD_THIRD_TIME_KEY, false);
  };

  const setPopupReferences = (element, listType, taskListIdentifier) => {
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

  return (
    <DashboardSidebarWrapper>
      <TopSection>
        <MenuButton onClick={showNavbar}>
          <img src={MenuIcon} alt="menu" />
        </MenuButton>
      </TopSection>
      <ListsSection>
        <Link to="/tasks">
          <ListsHeader>
            Lists
            <Arrow src={ArrowIcon} alt="arrow" />
          </ListsHeader>
        </Link>
        <ListItemsWrapper>
          {filteredList?.map(
            ({
              listName,
              listType,
              taskListIdentifier,
              numberOfUnreadTasks,
              isPrivate,
              numberOfTasks = 0,
            }) => (
              <Link
                key={taskListIdentifier}
                to={`/tasks/${taskListIdentifier}`}
              >
                <ListItem
                  ref={element =>
                    setPopupReferences(element, listType, taskListIdentifier)
                  }
                >
                  {isPrivate && (
                    <PrivateListIcon src={LockIcon} alt="private" />
                  )}
                  <ListItemTitle
                    onMouseEnter={event => handleMouseEnter(event, listName)}
                    onMouseLeave={() => setPopoverLabel(null)}
                  >
                    <TitleText>{listName}</TitleText>
                  </ListItemTitle>
                  <ListItemInfo>
                    {!!numberOfUnreadTasks && <InfoDot />}
                    {numberOfTasks}
                  </ListItemInfo>
                </ListItem>
              </Link>
            ),
          )}
        </ListItemsWrapper>
      </ListsSection>
      <RolloverPopover
        anchorEl={hoveredItemReference?.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={popoverLabel}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={100}
      >
        <RolloverPopoverLabel>{popoverLabel}</RolloverPopoverLabel>
      </RolloverPopover>
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
    </DashboardSidebarWrapper>
  );
};

export default DashboardSidebar;
