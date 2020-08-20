/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@material-ui/core';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DrawerListContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const DrawerListItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
`;

export const StyledList = styled(List).attrs({
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
    ${({ open }) => (open ? '' : 'overflow-x: hidden;')}
    .paper {
      ${({ open }) => (open ? '' : 'overflow-x: hidden;')}
    }
  }
`;

export const NestedList = styled(StyledList)`
  && {
    height: unset;
    min-height: unset;
    overflow-y: auto;
    padding-bottom: 0;
    width: 100%;
  }
`;

export const StyledListItemText = styled(ListItemText).attrs({
  disableTypography: true,
})`
  && {
    color: ${palette.coolGrey2};
    font-weight: normal;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    text-transform: uppercase;
    transition: all 0.25s ease;
    margin-left: ${spacing.large};
  }
`;

export const NestedListItemText = styled.div`
  color: ${palette.coolGrey2};
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
  margin-left: ${spacing.regularPlus};
`;

export const NestedListItem = styled(ListItem)`
  && {
    color: ${palette.coolGrey1};
    position: relative;
  }
  &&:hover {
    background-color: transparent;
  }
`;

export const StyledListItemIcon = styled(
  ({ isiconfilled, active, ...otherProps }) => <ListItemIcon {...otherProps} />,
)`
  && {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    transition: all 0.25s ease;
    min-width: fit-content;
    margin-left: ${spacing.regular};

    & svg {
      ${({ isiconfilled, active }) =>
        isiconfilled
          ? `fill: ${active ? '#ec4f3e' : '#c1ccda'};`
          : `stroke: ${active ? '#ec4f3e' : '#c1ccda'};`}
    }
  }
`;

export const ActiveIconRim = styled.div`
  left: 50%;
  opacity: ${props => (props.active ? 1 : 0)};
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.25s ease;
  top: 50%;
  height: 36px;
  width: 36px;
  border: 1px solid white;
  border-radius: 50%;
`;

export const StyledListItem = styled(ListItem)`
  && {
    color: ${palette.coolGrey1};
    padding: 6px 16px;
  }

  &&:hover {
    background-color: transparent;
  }
`;

export const StyledRouterLinkContainer = styled.div`
  display: flex;
  height: 2.125rem;
  min-height: 2.125rem;

  &:not(:first-child) {
    ${props => !props.nested && 'margin-top: 1rem;'}
  }

  &&.active {
    ${NestedListItem} {
      background: ${palette.coolGrey1};
    }
  }
`;

export const NestedListContainer = styled.div`
  && {
    display: ${props => (props.active ? 'flex' : 'none')};
    margin-top: 0.5rem;
    overflow-y: auto;

    & + ${StyledRouterLinkContainer} > a {
      margin-top: 0;
    }
  }
`;

export const ListDivider = styled.div`
  background-color: ${palette.coolGrey1};
  box-sizing: border-box;
  height: 1px;
  margin-left: ${spacing.large};
  margin-top: ${spacing.huge};
  width: 32px;
`;

export const RolloverNestedListItemText = styled.div`
  background-color: ${palette.midnightBlue};
  border-radius: 0;
  color: ${palette.white};
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.5rem;
  pointer-events: none;
`;

export const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
    text-transform: uppercase;
  }

  && > div {
    border-radius: 0;
  }
`;

export const FooterListItem = styled(ListItem)`
  && {
    background-color: ${palette.midnightBlue};
    :focus {
      background-color: ${palette.midnightBlue};
    }
    :hover {
      background-color: ${palette.midnightBlue};
    }
  }
  &&.active {
    background-color: ${palette.midnightBlue};
    :hover {
      background-color: ${palette.midnightBlue};
    }
  }
`;

export const DropdownListItem = styled(FooterListItem)`
  && {
    color: ${palette.coolGrey2};
    transition: all 0.25s ease-out;
    padding-left: ${spacing.large};

    :hover {
      background-color: ${palette.coolGrey1};
    }
  }
  &&.active {
    background-color: ${palette.coolGrey1};
    :hover {
      background-color: ${palette.coolGrey1};
    }
  }
`;

export const StyledDropdown = styled.div`
  margin-top: ${spacing.small};
  background-color: ${palette.midnightBlue};
  height: ${props => (props.open ? props.dropdownHeight : 0)}rem;
  min-height: ${props => (props.open ? props.dropdownHeight : 0)}rem;
  overflow: hidden;
  transition: all 0.25s ease-out;
  width: 100%;
`;

export const DrawerMemberContainer = styled.div`
  margin-left: 18px;
  margin-top: ${spacing.regular};
`;
