import { MenuItem, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import palette from '../../palette';
import { RotatableChevronWithSpacing } from '../common/RotatableChevron';

const StyledSelect = styled(Select)`
  && {
    fieldset {
      border: 0 !important;
      border-radius: 0 !important;
    }

    .MuiSelect-root {
      color: ${palette.coolGrey1};
      padding: 0 0.25rem;
    }
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
    IconComponent={() => (
      <RotatableChevronWithSpacing color={palette.brightBlue} />
    )}
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
