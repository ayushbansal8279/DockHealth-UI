/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const CalendarContainer = styled.div`
  padding: ${spacing.large};
  width: 100%;
  .fc-button-primary {
    background-color: ${palette.darkBlue} !important;
    border-color: ${palette.darkBlue} !important;
  }
  .fc-button-active {
    background-color: ${palette.midnightBlue} !important;
    border-color: ${palette.midnightBlue} !important;
  }
  .fc-daygrid-day.fc-day-today {
    background-color: ${palette.brightBlueWithAlpha} !important;
  }
  .fc-timegrid-col.fc-day-today {
    background-color: ${palette.brightBlueWithAlpha} !important;
  }
`;
