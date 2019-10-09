import styled from 'styled-components';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router';
import SearchIcon from './img/drawer/search.svg';
import InboxIcon from './img/drawer/inbox.svg';
import ListsIcon from './img/drawer/lists.svg';
import PatientsIcon from './img/drawer/patients.svg';
import PeopleIcon from './img/drawer/people.svg';
import SupportIcon from './img/drawer/support.svg';
import DrawerHeader from './DrawerHeader';

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

const StyledListItemText = styled(ListItemText)
  .attrs({
    disableTypography: true,
  })`
  && {
    color: #5CCCED;
    font-size: 21px;
    line-height: 29px;
    font-weight: 600;
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
    ${NestedListItemText} {
      font-weight: 600;
    }
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
  &&.active {
    background: rgba(255, 255, 255, 0.1);
    ${StyledListItemIcon} {
      filter: brightness(100);
    }
    ${StyledListItemText} {
      color: #fff;
    }
    + div {
      display: block;
      background: rgba(255, 255, 255, 0.1);
    }
  }
  + div {
    display: none;
  }
`;

const RouterLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} activeClassName="active" {...props} />
));

const Item = ({
  icon, label, children, open, to,
}) => {
  const item = (
    <StyledListItem button component={RouterLink} to={to}>
      <StyledListItemIcon>
        <img src={icon} alt={label} />
      </StyledListItemIcon>
      {open && <StyledListItemText primary={label} />}
    </StyledListItem>
  );

  return (
    <>
      {item}
      <div>
        {open && <NestedList>{children}</NestedList>}
      </div>
    </>
  );
};

const NestedItem = ({ label, to }) => (
  <NestedListItem button component={RouterLink} to={to}>
    <NestedListItemText primary={label} />
  </NestedListItem>
);

const DrawerList = ({ open, user, lists }) => (
  <StyledList>
    <DrawerHeader user={user} />
    <Item
      label="Search"
      icon={SearchIcon}
      open={open}
      to="taskSearch"
    />
    <Item
      label="Inbox"
      icon={InboxIcon}
      open={open}
      to="tasks/Inbox"
    />
    <Item
      label="Lists"
      icon={ListsIcon}
      open={open}
      highlighted
      to="tasks"
    >
      {lists.map(list => (
        <NestedItem
          label={list.listName}
          to={`/tasks/${list.listName}/${list.taskListId}`}
        />
      ))}
      <NestedItem
        label="DockHealth Tasks"
        highlighted
      />
    </Item>
    <Item
      label="Patients"
      icon={PatientsIcon}
      open={open}
      to="patients"
    />
    <Item
      label="People"
      icon={PeopleIcon}
      open={open}
      to="people"
    />
    <Item
      label="Support"
      icon={SupportIcon}
      open={open}
      to="support"
    />
  </StyledList>
);

export default DrawerList;
