import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import MaterialSelect from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled(MaterialSelect).attrs({
  classes: { selectMenu: 'selectMenu', root: 'selectRoot', select: 'select' },
  disableUnderline: true,
})`
  && {
    width: 266px;
    height: 36px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(46, 58, 67, 0.4);
    color: #303538;
    font-size: 16px;
    line-height: 24px;
  }

  & .selectMenu {
    padding-left: 16px;
  }

  &&,
  & .selectMenu:focus {
    border-radius: 3px;
  }
`;

const PatientsFilter = ({
  onChange,
  stopPropagation,
  value,
  options,
  disabled,
}) => (
  <FormControl variant="filled" style={{ minWidth: 186 }}>
    <StyledSelect
      value={value || 'ALL_PATIENTS'}
      disabled={disabled}
      onClick={stopPropagation}
      onChange={onChange}
      name="filter"
    >
      {options.map(({ value: optionValue, description }) => (
        <MenuItem value={optionValue} key={optionValue}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <div style={{ flex: 1, marginLeft: 5 }}>{description}</div>
          </div>
        </MenuItem>
      ))}
    </StyledSelect>
  </FormControl>
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
