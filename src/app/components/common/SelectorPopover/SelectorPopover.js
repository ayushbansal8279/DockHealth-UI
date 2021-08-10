import React from 'react';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { omit } from 'ramda';
import { ItemsList } from './styled';

const usePopoverClasses = makeStyles({
  paper: {
    maxHeight: ({ maxItems }) => (maxItems ? `${maxItems * 2}rem` : undefined),
    minHeight: '2rem',
    overflowY: ({ maxItems }) => (maxItems ? 'auto' : undefined),
    boxShadow:
      '4px 2px 2px 0px rgba(0, 0, 0, 0.1), 4px 2px 3px 4px rgba(0, 0, 0, 0.07), 4px 2px 6px 4px rgba(0, 0, 0, 0.06)',
  },
});

const SelectorPopover = props => {
  const {
    items,
    renderItem,
    renderHeader,
    renderFooter,
    withPadding,
    listMaxHeight,
  } = props;
  const popoverClasses = usePopoverClasses(props);
  const renderItemMethod = renderItem;

  return (
    <Popover
      classes={popoverClasses}
      PaperProps={{
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      {renderHeader && renderHeader()}
      <ItemsList withPadding={withPadding} listMaxHeight={listMaxHeight}>
        {items?.map(item => renderItemMethod(item))}
      </ItemsList>
      {renderFooter && renderFooter()}
    </Popover>
  );
};

export default SelectorPopover;
