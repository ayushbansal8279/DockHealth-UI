import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, withRouter } from 'react-router';
import SearchIcon from '../../img/drawer/search.svg';
import InboxIcon from '../../img/drawer/inbox.svg';
import ListsIcon from '../../img/drawer/lists.svg';
import PatientsIcon from '../../img/drawer/patients.svg';
import PeopleIcon from '../../img/drawer/people.svg';
import SupportIcon from '../../img/drawer/support.svg';
import DrawerHeader from './DrawerHeader';

const NESTED_LIST_PREFIX = 'nested';

const StyledList = styled(List).attrs({
  paper: 'paper',
})`
  && {
    padding: 0;
    border: none;
    ${({ open }) => (open ? '' : 'overflow-x: hidden;')}
    .paper {
      ${({ open }) => (open ? '' : 'overflow-x: hidden;')}
    }
  }
`;

const NestedList = styled(StyledList).attrs({
  component: 'div',
})`
  && {
    ${({ highlighted }) => (highlighted ? 'background: rgba(255,255,255,0.1);' : '')}
  }
`;

const StyledListItemText = styled(ListItemText).attrs({
  disableTypography: true,
})`
  && {
    color: #5ccced;
    font-size: 21px;
    line-height: 29px;
    font-weight: normal;
    padding: 0;
  }
`;

const NestedListItemText = styled(StyledListItemText)`
  && {
    margin-left: 49px;
    font-size: 18px;
    line-height: 29px;
    color: #fff;
    font-weight: normal;
  }
`;

const NestedListItem = styled(ListItem)`
  && {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  &&.active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledListItemIcon = styled(ListItemIcon)`
  && {
    width: 29px;
    height: 29px;
    margin-right: 9px;
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    padding: 6px 16px 6px 27px;
    margin-top: 32px;
  }
`;

const StyledRouterLinkContainer = styled('div')`
  &&.active {
    background: rgba(255, 255, 255, 0.1);
  }
  &&.highlighted {
    ${StyledListItemIcon} {
      filter: brightness(100);
    }
    ${StyledListItemText} {
      color: #fff;
    }
  }
`;

const NestedListContainer = styled('div')`
  display: ${props => (props.active ? 'block' : 'none')};
`;

const RouterLink = ({ active, highlighted, ...props }) => {
  let className = ' ';

  if (active) {
    className += ' active';
  }

  if (highlighted) {
    className += ' highlighted';
  }

  return (
    <StyledRouterLinkContainer className={className.trim()}>
      <Link {...props} />
    </StyledRouterLinkContainer>
  );
};

const Item = ({
  activeId, icon, id, label, childItems, open, setActiveId, to,
}) => {
  const active = id === activeId;
  const nestedActive = activeId.startsWith(`${NESTED_LIST_PREFIX}-${id}`);

  const item = (
    <StyledListItem
      button
      component={RouterLink}
      to={to}
      active={active || (nestedActive && !open)}
      highlighted={active || nestedActive}
      onClick={() => setActiveId(id)}
    >
      <StyledListItemIcon>
        <img src={icon} alt={label} />
      </StyledListItemIcon>
      {open && <StyledListItemText primary={label} />}
    </StyledListItem>
  );

  return (
    <>
      {item}
      {open && childItems && (
        <NestedListContainer active={active || nestedActive}>
          <NestedList>
            {childItems.map(({ id: childId, ...childItemProps }) => (
              <NestedItem
                key={childId}
                id={childId}
                {...childItemProps}
                activeId={activeId}
                setActiveId={setActiveId}
              />
            ))}
          </NestedList>
        </NestedListContainer>
      )}
    </>
  );
};

const NestedItem = ({
  activeId, label, setActiveId, to, id,
}) => {
  const active = id === activeId;

  return (
    <NestedListItem
      active={active}
      button
      component={RouterLink}
      to={to}
      onClick={() => setActiveId(id)}
    >
      <NestedListItemText primary={label} />
    </NestedListItem>
  );
};

const getDrawerItems = ({ lists }) => [
  {
    id: 'search',
    label: 'Search',
    icon: SearchIcon,
    to: 'taskSearch',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: InboxIcon,
    to: 'tasks/Inbox',
  },
  {
    id: 'lists',
    label: 'Lists',
    icon: ListsIcon,
    to: 'tasks',
    childItems: lists.map(({ listName, taskListId }) => {
      const id = `${NESTED_LIST_PREFIX}-lists-${taskListId}`;

      return {
        id,
        label: listName,
        to: `tasks/${listName}/${taskListId}`,
      };
    }),
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: PatientsIcon,
    to: 'patients',
  },
  {
    id: 'people',
    label: 'People',
    icon: PeopleIcon,
    to: 'people',
  },
  {
    id: 'support',
    label: 'Support',
    icon: SupportIcon,
    to: 'support',
  },
];

const renderDrawerItem = drawerListProps => ({ id, ...drawerItemProps }) => (
  <Item key={id} id={id} {...drawerItemProps} {...drawerListProps} />
);

const DrawerList = ({
  open, user, lists, location,
}) => {
  const [activeId, setActiveId] = useState('');

  const drawerItems = getDrawerItems({ lists });

  useEffect(
    () => {
      const drawerChildItems = drawerItems.flatMap(({ childItems }) => childItems).filter(Boolean);

      const currentDrawerItem = drawerItems
        .concat(drawerChildItems)
        .find(({ to }) => location.pathname.endsWith(encodeURI(to)));

      if (currentDrawerItem) {
        setActiveId(currentDrawerItem.id || '');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawerItems],
  );

  return (
    <StyledList>
      <DrawerHeader user={user} open={open} setActiveId={setActiveId} />
      {drawerItems.map(renderDrawerItem({ activeId, open, setActiveId }))}
    </StyledList>
  );
};

export default withRouter(DrawerList);
