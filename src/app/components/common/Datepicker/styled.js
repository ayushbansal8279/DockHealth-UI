import { IconButton } from '@mui/material';
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
  color: ${({ isCurrentMonth, isDaySelected, isDisabled }) => {
    if (isDaySelected) return palette.white;

    if (isDisabled) return opacify(palette.darkGrey, 0.2);

    return isCurrentMonth
      ? opacify(palette.darkGrey, 0.5)
      : opacify(palette.darkGrey, 0.2);
  }};
`;

export const CalendarIconButton = styled(IconButton)`
  &&& {
    .MuiIconButton-root {
      height: 1.75rem;
      width: 1.75rem;
    }

    .MuiIconButton-colorPrimary {
      background-color: ${palette.brightBlue};

      &:hover {
        background-color: ${opacify(palette.brightBlue, 0.8)};
      }
    }
  }
`;

export const CalendarIconWrapper = styled.div`
  border-radius: 50%;
  ${({ isToday }) => isToday && `border: 1px solid ${palette.coolGrey2};`}
`;
