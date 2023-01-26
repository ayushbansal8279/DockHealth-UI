import { MenuItem } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import React from 'react';
import {
  ListWrapper,
  useMenuItemStyles,
  IconWrapper,
  EmptyListText,
} from './styled';

const SelectionList = (props) => {
  const { isLoading, list, onParentChange } = props;

  const menuItemClasses = useMenuItemStyles();

  return (
    <ListWrapper>
      {!isLoading && list ? (
        <>
          {list.length > 0 ? (
            list.map(({ id, name }) => (
              <MenuItem
                classes={menuItemClasses}
                onClick={() => onParentChange(id)}
              >
                {name}
                <IconWrapper>
                  <ArrowForwardIcon />
                </IconWrapper>
              </MenuItem>
            ))
          ) : (
            <EmptyListText>List is empty</EmptyListText>
          )}
        </>
      ) : null}
    </ListWrapper>
  );
};

SelectionList.propTypes = {
  isLoading: bool,
  list: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
    }),
  ),
  onParentChange: func.isRequired,
};

SelectionList.defaultProps = {
  isLoading: false,
  list: null,
};

export default SelectionList;
