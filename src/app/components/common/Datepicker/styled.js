import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

const DAYS_OF_WEEK_COUNT = 7;

export const CalendarContainer = styled.div`
  color: ${palette.darkGrey};
  padding: 1rem 1.5rem;
`;

export const CurrentMonthLabel = styled.div`
  align-items: center;
  background-color: ${palette.brightBlue};
  border-radius: 1.75rem;
  color: ${palette.white};
  display: flex;
  height: 1.75rem;
  justify-content: center;
  min-height: 1.75rem;
  min-width: 8.25rem;
  padding: 0.5rem;
  width: 11rem;
`;

export const CalendarGridContainer = styled.div`
  color: ${palette.darkGrey};
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(${DAYS_OF_WEEK_COUNT}, 1fr);
  justify-items: center;
`;

export const CalendarDayLabel = styled.div`
  color: ${({ isCurrentMonth, isDaySelected }) => {
    if (isDaySelected) return palette.white;

    return isCurrentMonth
      ? opacify(palette.darkGrey, 0.5)
      : opacify(palette.darkGrey, 0.2);
  }};
`;

export const CalendarIconButton = withStyles({
  root: {
    height: '1.75rem',
    width: '1.75rem',
  },
  colorPrimary: {
    backgroundColor: palette.brightBlue,
    '&:hover': {
      backgroundColor: opacify(palette.brightBlue, 0.8),
    },
  },
})(IconButton);
