import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import MenuItem from '@material-ui/core/MenuItem';

import Priority from './Priority';

const StyledSelect = styled(MaterialSelect).attrs({
  classes: { selectMenu: 'selectMenu', root: 'selectRoot' },
  disableUnderline: true,
})`
  && {
    height: 28px;
    background: #ededf0;
    border: 1px solid #ababb2;
    color: #303538;
    font-size: 14px;
  }

  & .selectRoot {
      height: 28px;
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
    color: #ababb2;
    margin-right: 4px;
    border-left: 1px solid #ababb2;
    height: 100%;
    margin-top: -2.5px;
  }
`;

const StatusSelect = ({ onChange, value, options, disabled }) => (
  <FormControl variant="filled" style={{ minWidth: 186 }}>
    <StyledSelect
      value={value || 'IN_PROGRESS'}
      disabled={disabled}
      displayEmpty
      onChange={onChange}
      name="status"
      IconComponent={StyledDropDownIcon}
    >
      {options.map(({ value, description }) => ( // eslint-disable-line no-shadow
        <MenuItem value={value} key={value}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Priority priority={value} />
            <div style={{ flex: 1, marginLeft: 5 }}>{value === '' ? <em>{description}</em> : description}</div>
          </div>
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
);

StatusSelect.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
};

StatusSelect.defaultProps = {
  disabled: false,
};

export default StatusSelect;
