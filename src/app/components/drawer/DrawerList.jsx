import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router';
import useBoolean from '../../hooks/useBoolean';
import InboxIcon from '../../img/drawer/InboxIcon';
import ListsIcon from '../../img/drawer/ListsIcon';
import LogoutIcon from '../../img/drawer/LogoutIcon';
import PatientsIcon from '../../img/drawer/PatientsIcon';
import PeopleIcon from '../../img/drawer/PeopleIcon';
import SearchIcon from '../../img/drawer/SearchIcon';
import SupportIcon from '../../img/drawer/SupportIcon';
import DrawerHeader from './DrawerHeader';
import {
  ListDivider,
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
} from './DrawerList.styled';

const NESTED_LIST_PREFIX = 'nested';

const RouterLink = ({ active, highlighted, nested = false, ...props }) => {
  const { to } = props;

  const className = clsx(
    active && 'active',
    highlighted && 'highlighted',
    to === 'support' && 'navsupport',
  );

  return (
    <StyledRouterLinkContainer nested={nested} className={className}>
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

  const item = (
    <StyledListItem
      button
      component={RouterLink}
      to={to}
      active={active || (nestedActive && !open)}
      highlighted={active || nestedActive}
      onClick={() => setActiveId(id)}
      open={open}
      {...otherProps}
    >
      <StyledListItemIcon>
        <Icon />
      </StyledListItemIcon>
      {open && <StyledListItemText primary={label} />}
    </StyledListItem>
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
    childItems: lists?.map(({ listName, taskListIdentifier }) => {
      const id = `${NESTED_LIST_PREFIX}-lists-${taskListIdentifier}`;

      return {
        id,
        label: listName,
        to: `tasks/${taskListIdentifier}`,
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
    label: 'Providers',
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
}) => (
  // userProfileAccess[userProfileAccessKey] && (
  <Item key={id} id={id} {...drawerItemProps} {...drawerListProps} />
);
// );

const DrawerList = ({
  activeId,
  setActiveId,
  open,
  user,
  lists,
  location,
  onMouseEnter,
  onMouseLeave,
}) => {
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
        <DrawerHeader setActiveId={setActiveId} user={user} />
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
        <ListDivider />
        <Item
          id="logout"
          label="Logout"
          icon={LogoutIcon}
          to="logout"
          activeId={activeId}
          open={open}
          setActiveId={setActiveId}
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
