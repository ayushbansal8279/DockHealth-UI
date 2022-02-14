/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const TextEventContainer = styled.div`
  color: black;
  overflow: hidden;
`;

export const AddEventInputContainer = styled.div`
  margin: 0px;
  overflow: hidden;
  color: #074a86;
  input {
    width: 100%;
    &:active {
      border: none;
    }
    &:focus-visible {
      border: none;
    }
  }
`;
export const CalendarContainer = styled.div`
  padding: ${spacing.large};
  width: 100%;
  .fc-button-primary {
    color: ${palette.darkBlue} !important;
    background-color: ${palette.white} !important;
    border-color: ${palette.darkBlue} !important;
  }
  .fc-button-primary:focus {
    box-shadow: none !important;
  }
  .fc-button-active {
    color: ${palette.white} !important;
    background-color: ${palette.darkBlue} !important;
    border-color: ${palette.darkBlue} !important;
  }
  .fc-button-active:focus {
    box-shadow: none !important;
  }
  .fc-today-button {
    color: ${palette.white} !important;
    background-color: ${palette.darkBlue} !important;
    border-color: ${palette.darkBlue} !important;
  }
  .fc-daygrid-day.fc-day-today {
    background-color: ${palette.brightBlueWithAlpha} !important;
  }
  .fc-timegrid-col.fc-day-today {
    background-color: ${palette.brightBlueWithAlpha} !important;
  }
  .fc-daygrid-block-event {
    background-color: ${palette.white} !important;
    border-color: ${palette.darkBlue} !important;
  }
  .fc-daygrid-block-event
    > .fc-event-main
    > .fc-event-main-frame
    > .fc-event-title-container
    > .fc-event-title {
    color: ${palette.darkBlue} !important;
  }
`;
