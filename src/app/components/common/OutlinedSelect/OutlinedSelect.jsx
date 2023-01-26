import React from 'react';
import { ListItemText, MenuItem, Select } from '@mui/material';
// import zIndex from 'styles/z-index';
import { func, number, shape, string, arrayOf, oneOfType } from 'prop-types';
import styled from 'styled-components';
import palette from 'styles/palette';

const StyledSelect = styled(Select)`
  &&& {
    border-radius: 0;

    .MuiSelect-root {
      width: ${({ width }) => width};
      padding: 8;
    }

    .MuiSelect-icon {
      color: indigo;
    }

    &.MuiOutlinedInput-root {
      & > .MuiOutlinedInput-notchedOutline {
        border-color: ${palette.coolGrey2};
      }

      &.Mui-focused {
        & > .MuiOutlinedInput-notchedOutline {
          border-width: 1px;
        }
      }

      &:hover {
        & > .MuiOutlinedInput-notchedOutline {
          border-color: ${palette.coolGrey1};
        }
      }

      & .switchIcon > path {
        fill: ${(props) => props.iconColorActive ?? palette.dirtyBanana};
      }
    }
  }
`;

const OutlinedSelect = (props) => {
  const { name, options, width, ...restProps } = props;
  // const menuClasses = useMenuStyles({ width });

  return (
    <StyledSelect
      width={width}
      MenuProps={{
        // classes: menuClasses,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
      variant="outlined"
      inputProps={{ name }}
      renderValue={(selectedValue) =>
        options.find((option) => option.value === selectedValue)?.label
      }
      {...restProps}
    >
      {options?.map((option) => {
        const { OptionIcon } = option;
        return (
          <MenuItem key={option.value} value={option.value}>
            {OptionIcon || null}
            <ListItemText>{option.label}</ListItemText>
            <div>{option.secondaryLabel}</div>
          </MenuItem>
        );
      })}
    </StyledSelect>
  );
};

OutlinedSelect.propTypes = {
  onChange: func,
  width: number,
  name: string.isRequired,
  options: arrayOf(
    shape({
      label: string.isRequired,
      value: oneOfType([string, number]),
    }),
  ).isRequired,
};

OutlinedSelect.defaultProps = {
  width: 330,
  onChange: undefined,
};

export default OutlinedSelect;
