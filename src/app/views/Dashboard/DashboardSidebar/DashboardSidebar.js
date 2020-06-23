import React from 'react';
import { Link } from 'react-router';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
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
} from './styled';

const DashboardSidebar = () => {
  return (
    <DashboardSidebarWrapper>
      <TopSection>
        <MenuButton>
          <img src={MenuIcon} alt="menu" />
        </MenuButton>
      </TopSection>
      <ListsSection>
        <Link to="/tasks">
          <ListsHeader>Lists</ListsHeader>
        </Link>
        <ListItemsWrapper>
          <ListItem>
            <PrivateListIcon src={LockIcon} alt="private" />
            <ListItemTitle>
              <TitleText>
                Item with very long text that is taking more space
              </TitleText>
            </ListItemTitle>
            <ListItemInfo>
              <InfoDot />
              32
            </ListItemInfo>
          </ListItem>
          <ListItem>
            <PrivateListIcon src={LockIcon} alt="private" />
            <ListItemTitle>
              <TitleText>Item 1</TitleText>
            </ListItemTitle>
            <ListItemInfo>32</ListItemInfo>
          </ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 2</ListItem>
        </ListItemsWrapper>
      </ListsSection>
    </DashboardSidebarWrapper>
  );
};

export default DashboardSidebar;
