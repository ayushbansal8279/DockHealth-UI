import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';

const StyledSelect = styled(MaterialSelect)`
  && {
    height: 30px;
    background: #ccd6dd;
    border: 1px solid #aab8c3;
    color: #14171a;
    font-size: 14px;

    em {
      font-style: normal;
    }
  }

  & .selectRoot {
    height: 30px;
  }

  & .selectMenu {
    padding-left: 19px;
  }

  &&,
  & .selectMenu:focus {
    border-radius: 57px;
  }
`;

const StyledDropDownIcon = styled(ArrowDropDown)`
  && {
    color: black;
    margin-right: 4px;
    border-left: 2px solid #fff;
    height: 100%;
    margin-top: -3px;
  }
`;

const Select = ({ updateFilter, value, options }) => {
  const handleChange = useCallback(
    e => {
      const selected = e.target.value;
      updateFilter(selected === value ? '' : selected);
    },
    [updateFilter, value],
  );

  return (
    <FormControl variant="filled" style={{ minWidth: 186 }}>
      <StyledSelect
        value={value}
        displayEmpty
        onChange={handleChange}
        name="filter"
        IconComponent={StyledDropDownIcon}
        classes={{ selectMenu: 'selectMenu', root: 'selectRoot' }}
        disableUnderline
      >
        {options.map((
          { value, description }, // eslint-disable-line no-shadow
        ) => (
          <MenuItem value={value} key={value}>
            {value === '' ? <em>{description}</em> : description}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

Select.propTypes = {
  updateFilter: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

export default Select;
