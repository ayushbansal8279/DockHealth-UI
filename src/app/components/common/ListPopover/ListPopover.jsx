import { css, ListItem, Popover } from '@mui/material';
import omit from 'ramda/src/omit';
import React from 'react';
import palette, { typography } from 'styles/palette';
import styled from 'styled-components';

const StyledPopover = styled(Popover)`
  &&& {
    &.MuiPopover-root {
      max-height: ${({ maxItems }) =>
        maxItems ? `${maxItems * 2}rem` : undefined};
      min-height: 2rem;
      overflow-y: ${({ maxItems }) => (maxItems ? 'auto' : undefined)};
    }
    .MuiBackdrop-root {
      opacity: 0 !important;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  &&& {
    &.MuiListItem-root {
      color: ${palette.coolGrey1};
      filter: brightness(1);
      font-family: ${typography.text};
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
      min-width: 17.5rem;
      padding: 0.25rem 1.5625rem;
      transition: all 0.25s ease-out;
      & path {
        stroke: ${palette.coolGrey1};
        transition: all 0.25s ease-out;
      }

      &:hover {
        color: ${palette.brightBlue};
        filter: brightness(1.25);
        & path {
          stroke: ${palette.brightBlue};
        }
      }
    }

    ${({ isActive }) =>
      isActive &&
      css`
        color: ${palette.brightBlue};
      `}
  }
`;

const StyledDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const renderItem = () => (popoverItem) => {
  if (!popoverItem) {
    return null;
  }

  const {
    active = false,
    key,
    label,
    onClick,
    button = true,
    ...otherProps
  } = popoverItem;

  return (
    <StyledListItem
      // explicit cast here is a workaround for ListItem typing issue
      // check https://github.com/mui-org/material-ui/issues/14971
      button={button}
      isActive={active}
      onClick={onClick}
      key={`list_${key}`}
      {...otherProps}
    >
      <StyledDiv>{label}</StyledDiv>
    </StyledListItem>
  );
};

const ListPopover = (allProps) => {
  const { items, customRenderItem, ...props } = allProps;
  const listItemClasses = undefined;
  const renderItemMethod = customRenderItem || renderItem;

  return (
    <StyledPopover
      PaperProps={{
        // className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      {items.map(renderItemMethod({ listItemClasses }))}
    </StyledPopover>
  );
};

export default ListPopover;
