import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router';

import useBoolean from '../../hooks/useBoolean';
import InboxIcon from '../../img/drawer/inbox';
import ListsIcon from '../../img/drawer/lists';
import LogoutIcon from '../../img/drawer/logout';
import PatientsIcon from '../../img/drawer/patients';
import PeopleIcon from '../../img/drawer/people';
import SearchIcon from '../../img/drawer/search';
import SupportIcon from '../../img/drawer/support';
import DrawerHeader from './DrawerHeader';
import {
  BackgroundListItem,
  NestedList,
  NestedListContainer,
  NestedListItem,
  NestedListItemText,
  RolloverNestedListItemText,
  RolloverPopover,
  StyledList,
  StyledListItem,
  StyledListItemIcon,
  StyledListItemText,
  StyledRouterLinkContainer,
  StyledSpacer,
} from './DrawerList.styled';

const NESTED_LIST_PREFIX = 'nested';

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

  const nestedItemTextReference = useRef(null);

  const onMouseEnter = () => {
    if (rolloverPopoverAnchor !== nestedItemTextReference) {
      const currentElement = nestedItemTextReference.current;

      if (currentElement?.scrollWidth > currentElement?.offsetWidth) {
        setRolloverLabel(label);
        setRolloverPopoverAnchor(nestedItemTextReference);
        openPopover();
      }
    }
  };

  const onMouseLeave = () => {
    if (rolloverPopoverAnchor === nestedItemTextReference) {
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
        ref={nestedItemTextReference}
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
    userProfileAccessKey: 'searchEnabled',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: InboxIcon,
    to: 'tasks/Inbox',
    userProfileAccessKey: 'listsEnabled',
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
        to: `tasks/${taskListId}`,
      };
    }),
    userProfileAccessKey: 'listsEnabled',
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: PatientsIcon,
    to: 'patients',
    userProfileAccessKey: 'patientsEnabled',
  },
  {
    id: 'people',
    label: 'People',
    icon: PeopleIcon,
    to: 'people',
    userProfileAccessKey: 'peopleEnabled',
  },
  {
    id: 'support',
    label: 'Support',
    icon: SupportIcon,
    to: 'support',
    userProfileAccessKey: null,
  },
];

const renderDrawerItem = ({ userProfileAccess, ...drawerListProps }) => ({
  id,
  userProfileAccessKey,
  ...drawerItemProps
}) =>
  userProfileAccess[userProfileAccessKey] && (
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

  const userProfileAccess = useSelector(
    state => state.userState.userProfile?.access,
  );

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
            userProfileAccess,
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
