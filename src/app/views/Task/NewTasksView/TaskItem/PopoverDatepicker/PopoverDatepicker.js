import React, { useState, useRef, useMemo, useCallback } from 'react';
import moment from 'moment';
import { useMount, useUpdate } from 'react-use';
import { Grid, IconButton, Popover } from '@material-ui/core';
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

const PopoverDatepicker = ({ currentDueDate, setDate, children }) => {
  const buttonReference = useRef(null);
  const [isOpen, openPopover] = useState(false);

  const [currentMonthMoment, setCurrentMonthMoment] = useState(null);

  const selectedTaskDueDate = currentDueDate || moment();

  const forceUpdate = useUpdate();

  useMount(() => {
    setCurrentMonthMoment(moment(selectedTaskDueDate).startOf('month'));
    // setCurrentDueDate(dateFieldValue ? moment(dateFieldValue) : null);
  });

  const formattedCurrentMonth = getCalendarFormattedMonth(currentMonthMoment);

  const dayLabelsToRender = useMemo(
    () => renderDayLabels({ currentMonthMoment, currentDueDate, setDate }),
    // useEffect work better for primitive values (like strings in here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formattedCurrentMonth],
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
      <button
        type="button"
        onClick={() => openPopover(!isOpen)}
        ref={buttonReference}
      >
        {children}
      </button>
      <Popover
        anchorEl={buttonReference?.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={() => openPopover(false)}
      >
        {/* currentMonthMoment && */}
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
      </Popover>
    </>
  );
};

export default PopoverDatepicker;
