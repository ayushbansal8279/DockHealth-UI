import {
  ListItem,
  ListItemProps,
  makeStyles,
  Popover,
  PopoverProps,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

interface PopoverListItem extends ListItemProps<'div'> {
  active?: boolean;
  button?: true;
  key: string;
  label: React.ReactNode;
  onClick?: (event: React.SyntheticEvent) => void;
}

interface ListPopoverProps extends Omit<PopoverProps, 'children'> {
  items: Array<PopoverListItem>;
}

const useListItemClasses = makeStyles({
  root: {
    color: '#8492a4',
    filter: 'brightness(1)',
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    margin: 0,
    minWidth: '17.5rem',
    padding: '0.25rem 1.5625rem',
    transition: 'all 0.25s ease-out',
    '& path': {
      stroke: '#8492a4',
      transition: 'all 0.25s ease-out',
    },
    '&:hover': {
      color: '#00a2e5',
      filter: 'brightness(1.25)',
      '& path': {
        stroke: '#00a2e5',
      },
    },
  },
  active: {
    color: '#00a2e5',
  },
});

const renderItem = ({
  listItemClasses,
}: {
  listItemClasses: Record<'root' | 'active', string>;
}) => ({
  active = false,
  key,
  label,
  onClick,
  ...otherProps
}: PopoverListItem) => {
  return (
    <ListItem
      button
      className={clsx(listItemClasses.root, active && listItemClasses.active)}
      onClick={onClick}
      key={key}
      {...otherProps}
    >
      {label}
    </ListItem>
  );
};

const ListPopover = ({ items, ...props }: ListPopoverProps) => {
  const listItemClasses = useListItemClasses();

  return (
    <Popover {...props}>{items.map(renderItem({ listItemClasses }))}</Popover>
  );
};

export default ListPopover;
