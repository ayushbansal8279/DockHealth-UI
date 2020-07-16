import React, { useRef, useState } from 'react';
import { Link } from 'react-router';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import ArrowIcon from 'img/arrow';
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

const DashboardSidebar = ({ lists, showNavbar }) => {
  const hoveredItemReference = useRef(null);
  const [popoverLabel, setPopoverLabel] = useState(null);

  const handleMouseEnter = (event, listName) => {
    const { target } = event;

    if (target?.scrollWidth > target?.offsetWidth) {
      hoveredItemReference.current = target;
      setPopoverLabel(listName);
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
          {lists?.map(
            ({
              listName,
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
    </DashboardSidebarWrapper>
  );
};

export default DashboardSidebar;
