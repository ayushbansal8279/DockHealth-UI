import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';

const StyledSelect = styled(MaterialSelect)`
  && {
    height: 28px;
    background: #c8c8ce;
    border: 1px solid #aab8c3;
    color: #14171a;
    font-size: 14px;
  }

   & .selectMenu {
    padding-left: 19px;
  }

  &&, & .selectMenu:focus {
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

const Select = ({ onChange, value, options }) => (
  <FormControl variant="filled" style={{ minWidth: 186 }}>
    <StyledSelect
      value={value}
      displayEmpty
      onChange={onChange}
      name="filter"
      IconComponent={StyledDropDownIcon}
      classes={{ selectMenu: 'selectMenu' }}
      disableUnderline
    >
      {options.map(({ value, description }) => ( // eslint-disable-line no-shadow
        <MenuItem value={value} key={value}>
          {value === '' ? <em>{description}</em> : description}
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
);

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
};

export default Select;
