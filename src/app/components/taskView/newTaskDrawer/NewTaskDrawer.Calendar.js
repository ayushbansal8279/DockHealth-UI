/* eslint-disable react/jsx-no-duplicate-props */
import { Grid, IconButton } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Spacing from 'components/common/Spacing';
import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import initializeCalendarHooks from './NewTaskDrawer.Calendar.Hooks';
import {
  CalendarContainer,
  CalendarGridContainer,
  CurrentMonthLabel,
} from './NewTaskDrawer.Calendar.Styled';
import {
  DAYS_OF_WEEK,
  renderDayOfWeekHeaderLabel,
} from './NewTaskDrawer.Calendar.Utilities';

const Calendar = ({ dateFieldName, setDate }) => {
  const {
    currentMonthMoment,
    changeMonth,
    formattedCurrentMonth,
    dayLabelsToRender,
  } = initializeCalendarHooks({ dateFieldName, setDate });

  return (
    currentMonthMoment && (
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
    )
  );
};

export default Calendar;
