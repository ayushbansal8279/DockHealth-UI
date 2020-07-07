import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { listsSelector } from 'selectors/task-list-selectors';
import LockIcon from 'img/lock-icon';
import MenuIcon from 'img/menu-icon';
import ArrowIcon from 'img/arrow';
import * as TemplateActions from 'actions/template-actions';
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
} from './styled';

const DashboardSidebar = ({ lists, showNavbar }) => {
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
                  <ListItemTitle>
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
    </DashboardSidebarWrapper>
  );
};

const mapDispatchToProps = {
  showNavbar: TemplateActions.showNavbar,
};

const mapStateToProps = state => ({
  lists: listsSelector(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSidebar);
