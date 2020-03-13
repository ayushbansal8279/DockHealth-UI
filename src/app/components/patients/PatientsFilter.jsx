import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  && fieldset {
    border: 0.0625rem solid #e5e9f2 !important;
    border-radius: 0 !important;
  }
`;

const PatientsFilter = ({
  onChange,
  stopPropagation,
  value,
  options,
  disabled,
}) => (
  <StyledSelect
    value={value || 'ALL_PATIENTS'}
    variant="outlined"
    disabled={disabled}
    onClick={stopPropagation}
    onChange={onChange}
    name="filter"
  >
    {options.map(({ value: optionValue, description }) => (
      <MenuItem value={optionValue} key={optionValue}>
        {description}
      </MenuItem>
    ))}
  </StyledSelect>
);

PatientsFilter.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      description: PropTypes.string,
    }),
  ).isRequired,
};

PatientsFilter.defaultProps = {
  disabled: false,
};

export default PatientsFilter;
