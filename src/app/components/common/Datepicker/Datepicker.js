import React, { useState, useMemo, useEffect } from 'react';
import { useMount } from 'react-use';
import moment from 'moment';
import { Grid, IconButton } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import {
  CalendarContainer,
  CalendarGridContainer,
  CurrentMonthLabel,
} from './styled';

import {
  getCalendarFormattedMonth,
  renderDayOfWeekHeaderLabel,
  DAYS_OF_WEEK,
  renderDayLabels,
} from './helpers';

const Datepicker = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  initialMonthMomentValue,
  onMonthChange = () => null,
}) => {
  const [currentMonthMoment, setCurrentMonthMoment] = useState(null);

  const momentSelectedDate = selectedDate ? moment(selectedDate) : null;

  useMount(() => {
    setCurrentMonthMoment(
      (initialMonthMomentValue || momentSelectedDate || moment()).startOf(
        'month',
      ),
    );
  });

  const setMonthByDate = value => {
    if (currentMonthMoment?.isSame(value, 'month')) return;

    const nextMonthMomentValue = value?.startOf('month');
    setCurrentMonthMoment(nextMonthMomentValue);
    onMonthChange(nextMonthMomentValue);
  };

  useEffect(() => {
    if (momentSelectedDate) {
      setMonthByDate(momentSelectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const formattedCurrentMonth = getCalendarFormattedMonth(currentMonthMoment);

  const dayLabelsToRender = useMemo(
    () =>
      renderDayLabels({
        currentMonthMoment,
        momentSelectedDate,
        onDateChange,
        minDate,
        maxDate,
      }),
    // useEffect work better for primitive values (like strings in here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formattedCurrentMonth, selectedDate],
  );

  const setNextMonth = () =>
    setMonthByDate(moment(currentMonthMoment)?.add(1, 'M'));

  const setPreviousMonth = () =>
    setMonthByDate(moment(currentMonthMoment)?.add(-1, 'M'));

  return (
    <>
      <CalendarContainer>
        <Grid container justify="space-between" alignItems="center">
          <IconButton
            size="small"
            color="inherit"
            onMouseDown={setPreviousMonth}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <CurrentMonthLabel>
            <MontserratTypography
              variant="h4"
              color="inherit"
              weight="500"
              noWrap
            >
              {formattedCurrentMonth}
            </MontserratTypography>
          </CurrentMonthLabel>
          <IconButton size="small" color="inherit" onMouseDown={setNextMonth}>
            <KeyboardArrowRight />
          </IconButton>
        </Grid>
        <Spacing vertical={5} />
        <CalendarGridContainer>
          {DAYS_OF_WEEK.map(renderDayOfWeekHeaderLabel)}
          {dayLabelsToRender}
        </CalendarGridContainer>
      </CalendarContainer>
    </>
  );
};

export default Datepicker;
