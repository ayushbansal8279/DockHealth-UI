import { ListItem, Popover } from '@mui/material';
// import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import omit from 'ramda/src/omit';
import React from 'react';
// import palette from 'styles/palette';

const usePopoverClasses = undefined;
// makeStyles({
//   root: {
//     maxHeight: ({ maxItems }) => (maxItems ? `${maxItems * 2}rem` : undefined),
//     minHeight: '2rem',
//     overflowY: ({ maxItems }) => (maxItems ? 'auto' : undefined),
//   },
// });

const useListItemClasses = undefined;
// makeStyles({
//   root: {
//     color: palette.coolGrey1,
//     filter: 'brightness(1)',
//     fontFamily: '"Roboto Condensed", sans-serif',
//     fontSize: '1rem',
//     fontWeight: 500,
//     margin: 0,
//     minWidth: '17.5rem',
//     padding: '0.25rem 1.5625rem',
//     transition: 'all 0.25s ease-out',
//     '& path': {
//       stroke: palette.coolGrey1,
//       transition: 'all 0.25s ease-out',
//     },
//     '&:hover': {
//       color: palette.brightBlue,
//       filter: 'brightness(1.25)',
//       '& path': {
//         stroke: palette.brightBlue,
//       },
//     },
//   },
//   active: {
//     color: palette.brightBlue,
//   },
//   labelContainer: {
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     whiteSpace: 'nowrap',
//     width: '100%',
//   },
// });

const renderItem =
  ({ listItemClasses }) =>
  (popoverItem) => {
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
        button={button}
        className={clsx(listItemClasses.root, active && listItemClasses.active)}
        onClick={onClick}
        key={`list_${key}`}
        {...otherProps}
      >
        <div className={clsx(listItemClasses.labelContainer)}>{label}</div>
      </ListItem>
    );
  };

const ListPopover = (allProps) => {
  const { items, customRenderItem, ...props } = allProps;
  const listItemClasses = useListItemClasses();
  const popoverClasses = usePopoverClasses(allProps);
  const renderItemMethod = customRenderItem || renderItem;

  return (
    <Popover
      PaperProps={{
        className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      {...omit(['maxItems'], props)}
    >
      {items.map(renderItemMethod({ listItemClasses }))}
    </Popover>
  );
};

export default ListPopover;
