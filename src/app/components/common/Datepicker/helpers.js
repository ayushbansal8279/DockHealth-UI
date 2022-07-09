import moment from 'moment';
import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { range } from 'ramda';
import {
  CalendarDayLabel,
  CalendarIconButton,
  CalendarIconWrapper,
} from './styled';

export const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';

const checkIfDayIsInSelectedRange = (
  momentCurrentDay,
  momentSelectedDate,
  minDate,
  maxDate,
) => {
  if (
    minDate &&
    momentSelectedDate &&
    momentCurrentDay.isSameOrAfter(moment(minDate, DATE_ISO_FORMAT), 'days') &&
    momentCurrentDay.isBefore(momentSelectedDate, 'days')
  ) {
    return true;
  }

  if (
    maxDate &&
    momentSelectedDate &&
    momentCurrentDay.isSameOrBefore(moment(maxDate, DATE_ISO_FORMAT), 'days') &&
    momentCurrentDay.isAfter(momentSelectedDate, 'days')
  ) {
    return true;
  }

  return false;
};

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
  momentSelectedDate,
  onDateChange,
  maxDate,
  minDate,
  showRange,
  currentDay,
}) => {
  const currentMonthStartPoint = moment(currentMonthMoment)
    .startOf('month')
    .startOf('week');
  const currentMonthEndPoint = moment(currentMonthMoment)
    .endOf('month')
    .endOf('week');

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
      momentSelectedDate?.format(DATE_ISO_FORMAT);

    let isOutOfRange = false;

    if (maxDate && moment(maxDate, DATE_ISO_FORMAT).isBefore(dayMoment)) {
      isOutOfRange = true;
    }

    if (minDate && moment(minDate, DATE_ISO_FORMAT).isAfter(dayMoment)) {
      isOutOfRange = true;
    }

    const isDayInSelectedRange =
      showRange &&
      checkIfDayIsInSelectedRange(
        dayMoment,
        momentSelectedDate,
        minDate,
        maxDate,
      );

    return (
      <CalendarIconWrapper
        isToday={dayMoment.isSame(moment(), 'days')}
        key={dayMoment.format(DATE_ISO_FORMAT)}
      >
        <CalendarIconButton
          key={dayMoment.format(DATE_ISO_FORMAT)}
          color={isDaySelected || isDayInSelectedRange ? 'primary' : 'default'}
          size="small"
          onMouseDown={() => onDateChange(dayMoment.format(DATE_ISO_FORMAT))}
          disabled={dayMoment.isBefore(currentDay, 'days')}
        >
          <CalendarDayLabel
            isDisabled={isOutOfRange}
            isCurrentMonth={isCurrentMonth}
            isDaySelected={isDaySelected || isDayInSelectedRange}
          >
            <MontserratTypography
              variant="h6"
              color="inherit"
              align="center"
              weight={
                dayMoment.isBefore(currentDay, 'days') ? 'normal' : 'bold'
              }
            >
              {dayMoment.format('D')}
            </MontserratTypography>
          </CalendarDayLabel>
        </CalendarIconButton>
      </CalendarIconWrapper>
    );
  });
};

export const getCalendarFormattedMonth = date => date?.format('MMMM, YYYY');
