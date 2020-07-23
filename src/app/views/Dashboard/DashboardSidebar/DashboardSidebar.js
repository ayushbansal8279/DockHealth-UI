import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import ArrowIcon from 'img/arrow';
import TourPopover from 'components/tour-popover/TourPopper/TourPopper';
import StandardTourContent from 'components/tour-popover/content/StandardTourContent/StandardTourContent';
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
}) => {
  const [
    openedSuccessListCreationMessage,
    setOpenedSuccessListCreationMessage,
  ] = useState(false);
  const [firstListElement, setFirstListElement] = useState(null);
  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);

  useEffect(() => {
    if (firstListElement && shouldDisplayFirstListCreationMessage) {
      setOpenedSuccessListCreationMessage(true);
    }
  }, [
    firstListElement,
    shouldDisplayFirstListCreationMessage,
    setOpenedSuccessListCreationMessage,
  ]);

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
                <ListItem>
                  {isPrivate && (
                    <PrivateListIcon src={LockIcon} alt="private" />
                  )}
                  <ListItemTitle
                    onMouseEnter={event => handleMouseEnter(event, listName)}
                    onMouseLeave={() => setPopoverLabel(null)}
                  >
                    <TitleText
                      ref={element => {
                        if (
                          listType !== 'INBOX' &&
                          firstListElement === null &&
                          element
                        )
                          setFirstListElement({
                            reference: element,
                            taskListIdentifier,
                          });
                      }}
                    >
                      {listName}
                    </TitleText>
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
        open={openedSuccessListCreationMessage}
      >
        <StandardTourContent
          title="Congrats on adding your first list!"
          description="Lists will appear in this section of the page and will have a blue dot next to the number if there’s new actiity since the last time you logged in."
          buttonText="Add a task to this list"
          onButtonClick={() => {
            // navigate to task tour
          }}
          onClose={() => setOpenedSuccessListCreationMessage(false)}
          width={526}
        />
      </TourPopover>
    </DashboardSidebarWrapper>
  );
};

export default DashboardSidebar;
