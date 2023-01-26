import React from 'react';
import { Popover as MuiPopover } from '@mui/material';
import omit from 'ramda/src/omit';
import styled from 'styled-components';
import { ItemsList } from './styled';

const Popover = styled(MuiPopover)`
  &&& {
    .MuiPopover-paper {
      max-height: ${({ maxItems }) =>
        maxItems ? `${maxItems * 2}rem` : undefined};
      min-height: 2rem;
      overflow-y: ${({ maxItems }) => (maxItems ? 'auto' : undefined)};
      box-shadow: 4px 2px 2px 0px rgba(0, 0, 0, 0.1),
        4px 2px 3px 4px rgba(0, 0, 0, 0.07), 4px 2px 6px 4px rgba(0, 0, 0, 0.06);
    }
  }
`;

const SelectorPopover = (props) => {
  const {
    items,
    renderItem,
    renderHeader,
    renderFooter,
    withPadding,
    listMaxHeight,
  } = props;
  const renderItemMethod = renderItem;

  return (
    <Popover
      PaperProps={{
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      {renderHeader && renderHeader()}
      <ItemsList withPadding={withPadding} listMaxHeight={listMaxHeight}>
        {items?.map((item) => renderItemMethod(item))}
      </ItemsList>
      {renderFooter && renderFooter()}
    </Popover>
  );
};

export default SelectorPopover;
