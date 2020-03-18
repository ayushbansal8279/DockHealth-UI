import styled from 'styled-components';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@material-ui/core';

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
    color: #c1ccda;
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
  background-color: #05adec;
  border-radius: 0;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1;
  padding: 0.5rem;
  pointer-events: none;
`;

export const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
  }

  && > div {
    border-radius: 0;
  }
`;

export const NestedListItemText = styled.li`
  color: #c1ccda;
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
    color: #8492a4;
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
    width: 29px;
    height: 29px;
    justify-content: center;
    transition: all 0.25s ease;
  }
`;

export const StyledListItem = styled(ListItem)`
  && {
    color: #8492a4;
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
    ${StyledListItem} {
      background: #8492a4;
    }
    ${NestedListItem} {
      background: #8492a4;
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
  }
`;

export const NestedListContainer = styled.div`
  && {
    display: ${props => (props.active ? 'flex' : 'none')};
    margin-to: 0.5rem;
    overflow-y: auto;

    & + ${StyledRouterLinkContainer} > a {
      margin-top: 0;
    }
  }
`;

export const ListDivider = styled.div`
  background-color: #8492a4;
  box-sizing: border-box;
  height: 0.0625rem;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  width: calc(100% - 3rem);
`;
