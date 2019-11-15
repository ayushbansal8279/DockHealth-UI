import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, withRouter } from 'react-router';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import InboxIcon from '../../img/drawer/inbox';
import ListsIcon from '../../img/drawer/lists';
import LogoutIcon from '../../img/drawer/logout';
import PatientsIcon from '../../img/drawer/patients';
import PeopleIcon from '../../img/drawer/people';
import SearchIcon from '../../img/drawer/search';
import SupportIcon from '../../img/drawer/support';
import DrawerHeader from './DrawerHeader';

const NESTED_LIST_PREFIX = 'nested';

const StyledList = styled(List).attrs({
  paper: 'paper',
})`
  && {
    border: none;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    height: 100%;
    min-height: 100%;
    padding: 0;
    padding-bottom: 24px;
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
    height: unset;
    min-height: unset;
    overflow-y: auto;
    padding-bottom: 0;

    ${({ highlighted }) =>
      highlighted ? 'background: rgba(255,255,255,0.1);' : ''}
  }
`;

const StyledListItemText = styled(ListItemText).attrs({
  disableTypography: true,
})`
  && {
    color: #5ccced;
    font-size: 16px;
    line-height: 29px;
    font-weight: normal;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    transition: all 0.25s ease;
  }
`;

const RolloverNestedListItemText = styled.div`
  background-color: #05adec;
  border-radius: 0;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.5rem;
  pointer-events: none;
`;

const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
  }

  && > div {
    border-radius: 0;
  }
`;

const NestedListItemText = styled.li`
  color: #fff;
  font-size: 14px;
  font-weight: normal;
  line-height: 29px;
  margin-left: 2.5rem;
  overflow: hidden;
  padding-left: 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NestedListItem = styled(ListItem)`
  && {
    padding-top: 8px;
    padding-bottom: 8px;
    position: relative;
  }
  &&.active {
    background: rgba(255, 255, 255, 0.1);
  }
  &&:hover {
    background-color: transparent;
    ${StyledListItemText} {
      color: #fff;
    }
  }
`;

const StyledListItemIcon = styled(ListItemIcon)`
  && {
    align-items: center;
    display: flex;
    width: 29px;
    height: 29px;
    justify-content: center;
    margin-right: 9px;
    transition: all 0.25s ease;

    & svg {
      transition: all 0.25s ease;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    padding: 6px 16px 6px 27px;
  }

  &&:hover {
    background-color: transparent;
    ${StyledListItemIcon} {
      & svg.stroke-only {
        stroke: #fff;
      }
      & svg:not(.stroke-only) {
        fill: #fff;
      }
    }
    ${StyledListItemText} {
      color: #fff;
    }
  }
`;

const StyledRouterLinkContainer = styled.div`
  display: flex;
  height: ${props => (props.withBackground ? 2.625 : 2.3125)}rem;
  min-height: ${props => (props.withBackground ? 2.625 : 2.3125)}rem;

  ${props => !props.nested && !props.withBackground && 'margin-top: 1.5rem;'}

  &&.active {
    ${StyledListItem} {
      background: rgba(255, 255, 255, 0.1);
    }
    ${NestedListItem} {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &&.highlighted {
    ${StyledListItemIcon} {
      & svg.stroke-only {
        stroke: #fff;
      }
      & svg:not(.stroke-only) {
        fill: #fff;
      }
    }
    ${StyledListItemText} {
      color: #fff;
    }
  }
`;

const BackgroundListItem = styled(ListItem)`
  && {
    box-sizing: border-box;
    color: #fff;
    height: 2.625rem;
    margin: 0 12px;
    min-height: 2.625rem;
    padding: 12px 16px;
    ${props =>
      props.open &&
      `
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    `}
    ${StyledListItemText} {
      color: #fff;
    }
  }
`;

const StyledSpacer = styled.div`
  && {
    flex: 1;
  }
`;

const NestedListContainer = styled.div`
  && {
    display: ${props => (props.active ? 'flex' : 'none')};
    overflow-y: auto;

    & + ${StyledRouterLinkContainer} > a {
      margin-top: 0;
    }
  }
`;

const RouterLink = ({
  active,
  highlighted,
  nested = false,
  withBackground = false,
  ...props
}) => {
  const { to } = props;

  let className = '';

  if (active) {
    className += ' active';
  }

  if (highlighted) {
    className += ' highlighted';
  }
  if (to === 'support') {
    className += ' navsupport';
  }

  return (
    <StyledRouterLinkContainer
      nested={nested}
      className={className.trim()}
      withBackground={withBackground}
    >
      <Link {...props} />
    </StyledRouterLinkContainer>
  );
};

const Item = ({
  activeId,
  icon: Icon,
  id,
  label,
  childItems,
  open,
  setActiveId,
  to,
  withBackground = false,
  closePopover,
  openPopover,
  rolloverPopoverAnchor,
  setRolloverLabel,
  setRolloverPopoverAnchor,
  ...otherProps
}) => {
  const active = id === activeId;
  const nestedActive = activeId.startsWith(`${NESTED_LIST_PREFIX}-${id}`);
  const childOrSelfActive = active || nestedActive;

  const ItemComponent = withBackground ? BackgroundListItem : StyledListItem;

  const item = (
    <ItemComponent
      button
      component={RouterLink}
      to={to}
      active={active || (nestedActive && !open)}
      highlighted={active || nestedActive}
      onClick={() => setActiveId(id)}
      open={open}
      withBackground={withBackground}
      {...otherProps}
    >
      <StyledListItemIcon>
        <Icon />
      </StyledListItemIcon>
      {open && <StyledListItemText primary={label} />}
    </ItemComponent>
  );

  return (
    <>
      {item}
      {open && childItems && childOrSelfActive && (
        <NestedListContainer active={childOrSelfActive}>
          <NestedList>
            {childItems.map(({ id: childId, ...childItemProps }) => (
              <NestedItem
                key={childId}
                id={childId}
                {...childItemProps}
                activeId={activeId}
                setActiveId={setActiveId}
                closePopover={closePopover}
                openPopover={openPopover}
                rolloverPopoverAnchor={rolloverPopoverAnchor}
                setRolloverLabel={setRolloverLabel}
                setRolloverPopoverAnchor={setRolloverPopoverAnchor}
              />
            ))}
          </NestedList>
        </NestedListContainer>
      )}
    </>
  );
};

const NestedItem = ({
  activeId,
  label,
  setActiveId,
  to,
  id,
  closePopover,
  openPopover,
  setRolloverLabel,
  setRolloverPopoverAnchor,
  rolloverPopoverAnchor,
}) => {
  const active = id === activeId;

  const nestedItemTextRef = useRef(null);

  const onMouseEnter = () => {
    if (rolloverPopoverAnchor !== nestedItemTextRef) {
      const currentElement = nestedItemTextRef.current;

      if (currentElement?.scrollWidth > currentElement?.offsetWidth) {
        setRolloverLabel(label);
        setRolloverPopoverAnchor(nestedItemTextRef);
        openPopover();
      }
    }
  };

  const onMouseLeave = () => {
    if (rolloverPopoverAnchor === nestedItemTextRef) {
      setRolloverLabel('');
      setRolloverPopoverAnchor(null);
      closePopover();
    }
  };

  return (
    <NestedListItem
      active={active}
      button
      nested
      component={RouterLink}
      to={to}
      onClick={() => setActiveId(id)}
    >
      <NestedListItemText
        onMouseOver={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={() => {}}
        ref={nestedItemTextRef}
      >
        {label}
      </NestedListItemText>
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
  open,
  user,
  lists,
  location,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [activeId, setActiveId] = useState('');
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const [rolloverPopoverAnchor, setRolloverPopoverAnchor] = useState(null);
  const [rolloverLabel, setRolloverLabel] = useState('');

  const drawerItems = getDrawerItems({ lists });

  useEffect(
    () => {
      const drawerChildItems = drawerItems
        .flatMap(({ childItems }) => childItems)
        .filter(Boolean);

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

  const onPopoverClose = useCallback(() => {
    closePopover();
    setRolloverPopoverAnchor(null);
    setRolloverLabel('');
  }, [closePopover]);

  return (
    <>
      <StyledList onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <DrawerHeader user={user} />
        {drawerItems.map(
          renderDrawerItem({
            activeId,
            open,
            setActiveId,
            closePopover,
            openPopover,
            rolloverPopoverAnchor,
            setRolloverLabel,
            setRolloverPopoverAnchor,
          }),
        )}
        <StyledSpacer />
        <Item
          id="logout"
          label="Logout"
          icon={LogoutIcon}
          to="logout"
          activeId={activeId}
          open={open}
          setActiveId={setActiveId}
          withBackground
        />
      </StyledList>
      <RolloverPopover
        anchorEl={rolloverPopoverAnchor?.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={onPopoverClose}
        open={isPopoverOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={100}
      >
        <RolloverNestedListItemText>{rolloverLabel}</RolloverNestedListItemText>
      </RolloverPopover>
    </>
  );
};

export default withRouter(DrawerList);
