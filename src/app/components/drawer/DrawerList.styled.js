import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import styled from 'styled-components';

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

export const NestedList = styled(StyledList).attrs({
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

export const StyledListItemText = styled(ListItemText).attrs({
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

export const NestedListItem = styled(ListItem)`
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

export const StyledListItemIcon = styled(ListItemIcon)`
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

export const StyledListItem = styled(ListItem)`
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

export const StyledRouterLinkContainer = styled.div`
  display: flex;
  height: ${props => (props.withBackground ? 2.625 : 2.3125)}rem;
  min-height: ${props => (props.withBackground ? 2.625 : 2.3125)}rem;
  ${props => props.withBackground && 'margin: 24px 0;'}

  ${props =>
    !props.nested &&
    !props.withBackground &&
    'margin-top: 1.5rem;'}

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

export const BackgroundListItem = styled(ListItem)`
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

export const StyledSpacer = styled.div`
  && {
    flex: 1;
  }
`;

export const NestedListContainer = styled.div`
  && {
    display: ${props => (props.active ? 'flex' : 'none')};
    overflow-y: auto;

    & + ${StyledRouterLinkContainer} > a {
      margin-top: 0;
    }
  }
`;
