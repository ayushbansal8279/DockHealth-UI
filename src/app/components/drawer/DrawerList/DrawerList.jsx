/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, withRouter } from 'react-router';
import useBoolean from 'hooks/useBoolean';
import ListsIcon from 'img/drawer/ListsIcon';
import PatientsIcon from 'img/drawer/PatientsIcon';
import PeopleIcon from 'img/drawer/PeopleIcon';
import HomeIcon from 'img/drawer/HomeIcon';
import SearchIcon from 'img/drawer/SearchIcon';
import OrganizationIdentifier from '../../Organization/OrganizationIdentifier/OrganizationIdentifier';

import DrawerFooter from './DrawerFooter';
import {
  DrawerListContainer,
  DrawerListItemsContainer,
  ActiveIconRim,
  NestedList,
  NestedListContainer,
  NestedListItem,
  NestedListItemText,
  RolloverNestedListItemText,
  RolloverPopover,
  StyledListItem,
  StyledListItemIcon,
  StyledListItemText,
  StyledRouterLinkContainer,
} from './styled';

const NESTED_LIST_PREFIX = 'nested';

const RouterLink = React.forwardRef(
  ({ active, highlighted, nested = false, tabsPath, ...props }, reference) => {
    const { to } = props;

    const className = clsx(
      active && 'active',
      highlighted && 'highlighted',
      to === 'support' && 'navsupport',
    );

    return (
      <StyledRouterLinkContainer nested={nested} className={className}>
        <Link ref={reference} {...props} />
      </StyledRouterLinkContainer>
    );
  },
);

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
  isIconFilled = true,
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
      <StyledListItemIcon
        active={childOrSelfActive}
        isiconfilled={isIconFilled}
      >
        <Icon color="inherit" />
        <ActiveIconRim active={childOrSelfActive} />
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
    to: 'search',
  },
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    tabsPath: ['/my-tasks', '/all-tasks'],
    to: '/home',
    isIconFilled: false,
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
  },
  {
    id: 'people',
    label: 'People',
    icon: PeopleIcon,
    to: 'people',
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: PatientsIcon,
    to: 'patients',
  },
];

const renderDrawerItem = ({ ...drawerListProps }) => ({
  id,
  ...drawerItemProps
}) => <Item key={id} id={id} {...drawerItemProps} {...drawerListProps} />;

const DrawerList = ({
  activeId,
  setActiveId,
  open,
  user,
  lists,
  location,
  onMouseEnter,
  onMouseLeave,
  settingsVisible,
  currentOrganization,
}) => {
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
        .find(({ to, tabsPath }) => {
          if (tabsPath) {
            return !!tabsPath.find(tab => {
              return `${to + tab}` === location.pathname;
            });
          }

          return location.pathname.endsWith(encodeURI(to));
        });

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
      <DrawerListContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <OrganizationIdentifier
          tileConfig={{ fontSize: 'smallPlus', ...currentOrganization }}
          spacingsConfig={{ top: 18, bottom: 0, left: 18, right: 0 }}
          organizationName={currentOrganization?.organizationName}
          isOpen={open}
        />
        <DrawerListItemsContainer>
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
        </DrawerListItemsContainer>
        <DrawerFooter
          setActiveId={setActiveId}
          user={user}
          onMouseEnter={onMouseEnter}
          settingsVisible={settingsVisible}
        />
      </DrawerListContainer>
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
