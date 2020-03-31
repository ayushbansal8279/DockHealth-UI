import styled from 'styled-components';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@material-ui/core';
import palette from '../../palette';

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
    font-size: 16px;
    line-height: 29px;
    font-weight: normal;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    text-transform: uppercase;
    transition: all 0.25s ease;
  }
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

export const NestedListItemText = styled.li`
  color: ${palette.coolGrey2};
  font-size: 14px;
  font-weight: normal;
  line-height: 29px;
  margin-left: 0.75rem;
  overflow: hidden;
  padding-left: 0.5rem;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const NestedListItem = styled(ListItem)`
  && {
    color: ${palette.coolGrey1};
    padding-bottom: 0;
    padding-top: 0;
    position: relative;
  }
  &&:hover {
    background-color: transparent;
  }
`;

export const StyledListItemIcon = styled(ListItemIcon)`
  && {
    align-items: center;
    display: flex;
    height: 29px;
    justify-content: center;
    position: relative;
    transition: all 0.25s ease;
    width: 29px;

    & svg {
      fill: ${props => (props.active ? '#ec4f3e' : '#c1ccda')};
    }
  }
`;

export const ActiveIconRim = styled.div`
  border: 0.125rem solid #c1ccda;
  border-radius: 2.25rem;
  height: 2.25rem;
  left: 50%;
  min-height: 2.25rem;
  min-width: 2.25rem;
  opacity: ${props => (props.active ? 1 : 0)};
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.25s ease;
  top: 50%;
  width: 2.25rem;
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

export const StandardListContainer = styled.div`
  padding-top: ${props => (props.trialBannerVisible ? 2.875 : 1)}rem;
  transition: all 0.2s ease-out;
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
  height: 0.0625rem;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  width: calc(100% - 3rem);
`;
