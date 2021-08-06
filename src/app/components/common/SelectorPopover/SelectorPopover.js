import React from 'react';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { omit } from 'ramda';
import { ItemsList, ShadowWrapper } from './styled';

const usePopoverClasses = makeStyles({
  root: {
    maxHeight: ({ maxItems }) => (maxItems ? `${maxItems * 2}rem` : undefined),
    minHeight: '2rem',
    overflowY: ({ maxItems }) => (maxItems ? 'auto' : undefined),
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
      PaperProps={{
        className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      <ShadowWrapper>
        {renderHeader && renderHeader()}
        <ItemsList withPadding={withPadding} listMaxHeight={listMaxHeight}>
          {items?.map(item => renderItemMethod(item))}
        </ItemsList>
        {renderFooter && renderFooter()}
      </ShadowWrapper>
    </Popover>
  );
};

export default SelectorPopover;
