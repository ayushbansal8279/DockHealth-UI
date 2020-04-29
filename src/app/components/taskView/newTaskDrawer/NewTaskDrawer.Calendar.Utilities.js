import moment from 'moment';
import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { range } from 'ramda';
import {
  CalendarDayLabel,
  CalendarIconButton,
} from './NewTaskDrawer.Calendar.Styled';

export const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';

export const renderDayOfWeekHeaderLabel = dayOfWeek => (
  <MontserratTypography
    key={dayOfWeek}
    variant="h4"
    weight="600"
    align="center"
  >
    {dayOfWeek}
  </MontserratTypography>
);

export const renderDayLabels = ({
  currentMonthMoment,
  currentDueDate,
  setDate,
}) => {
  const currentMonthStartPoint = moment(currentMonthMoment)
    .startOf('month')
    .startOf('isoWeek');
  const currentMonthEndPoint = moment(currentMonthMoment)
    .endOf('month')
    .endOf('isoWeek');

  const displayedMonthDays =
    currentMonthEndPoint.diff(currentMonthStartPoint, 'day') || 0;

  // 1 is added in here because of ramda's range being one-sidedly exclusive
  return range(0, displayedMonthDays + 1).map(index => {
    const dayMoment = moment(currentMonthStartPoint)
      .add(index, 'day')
      .startOf('day');

    const isCurrentMonth =
      dayMoment.get('month') === currentMonthMoment?.get('month');

    const isDaySelected =
      dayMoment.format(DATE_ISO_FORMAT) ===
      currentDueDate?.format(DATE_ISO_FORMAT);

    return (
      <CalendarIconButton
        key={dayMoment.format(DATE_ISO_FORMAT)}
        color={isDaySelected ? 'primary' : 'default'}
        size="small"
        onClick={() => setDate(dayMoment.format(DATE_ISO_FORMAT))}
      >
        <CalendarDayLabel
          isCurrentMonth={isCurrentMonth}
          isDaySelected={isDaySelected}
        >
          <MontserratTypography variant="h6" color="inherit" align="center">
            {dayMoment.format('D')}
          </MontserratTypography>
        </CalendarDayLabel>
      </CalendarIconButton>
    );
  });
};

export const getCalendarFormattedMonth = date => date?.format('MMMM, YYYY');
