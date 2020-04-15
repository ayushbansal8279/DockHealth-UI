import { ListItem, Popover, PopoverProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { omit } from 'ramda';
import React from 'react';
import palette from '../../palette';

type PopoverListItem = {
  active?: boolean;
  button?: boolean;
  key: string;
  label: React.ReactNode;
  onClick?: (event: React.SyntheticEvent) => void;
} | null;

interface ListPopoverProps extends Omit<PopoverProps, 'children'> {
  items: Array<PopoverListItem>;
  maxItems?: number;
}

const usePopoverClasses = makeStyles({
  root: {
    maxHeight: ({ maxItems }: ListPopoverProps) =>
      maxItems ? `${maxItems * 2}rem` : undefined,
    minHeight: '2rem',
    overflowY: ({ maxItems }: ListPopoverProps) =>
      maxItems ? 'auto' : undefined,
  },
});

const useListItemClasses = makeStyles({
  root: {
    color: palette.coolGrey1,
    filter: 'brightness(1)',
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    margin: 0,
    minWidth: '17.5rem',
    padding: '0.25rem 1.5625rem',
    transition: 'all 0.25s ease-out',
    '& path': {
      stroke: palette.coolGrey1,
      transition: 'all 0.25s ease-out',
    },
    '&:hover': {
      color: palette.brightBlue,
      filter: 'brightness(1.25)',
      '& path': {
        stroke: palette.brightBlue,
      },
    },
  },
  active: {
    color: palette.brightBlue,
  },
  labelContainer: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
});

const renderItem = ({
  listItemClasses,
}: {
  listItemClasses: Record<'root' | 'active' | 'labelContainer', string>;
}) => (popoverItem: PopoverListItem) => {
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
    <ListItem
      // explicit cast here is a workaround for ListItem typing issue
      // check https://github.com/mui-org/material-ui/issues/14971
      button={button as true}
      className={clsx(listItemClasses.root, active && listItemClasses.active)}
      onClick={onClick}
      key={key}
      {...otherProps}
    >
      <div className={clsx(listItemClasses.labelContainer)}>{label}</div>
    </ListItem>
  );
};

const ListPopover = (allProps: ListPopoverProps) => {
  const { items, ...props } = allProps;
  const listItemClasses = useListItemClasses();
  const popoverClasses = usePopoverClasses(allProps);

  return (
    <Popover
      PaperProps={{
        className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      {items.map(renderItem({ listItemClasses }))}
    </Popover>
  );
};

export default ListPopover;
