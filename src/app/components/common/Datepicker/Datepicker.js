import React, { useState, useMemo, useCallback } from 'react';
import { useMount, useUpdate } from 'react-use';
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

const Datepicker = ({ selectedDate, onDateChange, minDate, maxDate }) => {
  const [currentMonthMoment, setCurrentMonthMoment] = useState(null);

  const forceUpdate = useUpdate();

  const momentSelectedDate = selectedDate ? moment(selectedDate) : null;

  useMount(() => {
    setCurrentMonthMoment((momentSelectedDate || moment()).startOf('month'));
  });

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

  const changeMonth = useCallback(
    value => {
      setCurrentMonthMoment(
        currentMonthMoment?.add(value, 'month')?.startOf('month'),
      );

      // this update is used to due current month label not rerendering on month change
      forceUpdate();
    },
    [currentMonthMoment, forceUpdate],
  );
  return (
    <>
      <CalendarContainer>
        <Grid container justify="space-between" alignItems="center">
          <IconButton
            size="small"
            color="inherit"
            onClick={() => changeMonth(-1)}
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
          <IconButton
            size="small"
            color="inherit"
            onClick={() => changeMonth(1)}
          >
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
