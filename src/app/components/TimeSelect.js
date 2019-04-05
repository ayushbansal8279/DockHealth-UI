import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const StyledSelect = styled(Select).attrs({
  classes: {
    selectMenu: 'selectMenu',
    root: 'selectRoot',
  },
})`
  && {
    height: 28px;
    color: #14171a;
    font-size: 14px;
  }

  & .selectRoot {
    height: 28px;
  }

   & .selectMenu {
    padding-left: 19px;
  }

  &&, & .selectMenu:focus {
    border-radius: 4px;
  }
`;

const halfHourIntervals = [...Array(48).keys()]
  .map(i => moment()
    .startOf('day')
    .add(30 * i, 'minutes'));

const isSameTime = t1 => t2 => t1.hour() === t2.hour() && t1.minute() === t2.minute();

const formatTime = time => time.format('h:mm A');

const setTime = (time, date) => moment(date)
  .set({
    hour: time.hour(),
    minute: time.minute(),
    second: time.second(),
  });

const TimeSelect = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e) => {
      const time = e.target.value;
      onChange(setTime(time, value));
    },
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
    </FormControl>);
};

TimeSelect.propTypes = {
  value: PropTypes.instanceOf(moment).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimeSelect;
