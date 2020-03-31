import { FormControl, MenuItem, Select } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import palette from '../../palette';

const StyledSelect = styled(Select).attrs({
  classes: {
    selectMenu: 'selectMenu',
    root: 'selectRoot',
    menu: 'menu',
  },
  MenuProps: {
    PaperProps: {
      style: {
        maxHeight: 355,
      },
    },
  },
})`
  && {
    height: 28px;
    color: ${palette.darkGrey};
    font-size: 14px;
  }

  & .selectRoot {
    height: 28px;
  }

  & .selectMenu {
    padding-left: 19px;
  }

  &&,
  & .selectMenu:focus {
    border-radius: 4px;
  }
`;

const halfHourIntervals = [...new Array(96).keys()].map(i =>
  moment()
    .startOf('day')
    .add(15 * i, 'minutes'),
);

const isSameTime = t1 => t2 =>
  t1.hour() === t2.hour() && t1.minute() === t2.minute();

const formatTime = time => time.format('h:mm A');

const setTime = (time, date) =>
  moment(date).set({
    hour: time.hour(),
    minute: time.minute(),
    second: time.second(),
  });

const TimeSelect = ({ value, onChange }) => {
  const handleChange = useCallback(
    event => {
      const time = event.target.value;
      onChange(setTime(time, value));
    },
    [onChange, value],
  );

  const selectedOption = halfHourIntervals.find(isSameTime(value));
  const time = selectedOption || halfHourIntervals[0];

  return (
    <FormControl>
      <StyledSelect value={time} onChange={handleChange} disableUnderline>
        {halfHourIntervals.map(option => (
          <MenuItem value={option} key={formatTime(option)}>
            {formatTime(option)}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

TimeSelect.propTypes = {
  value: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeSelect;
