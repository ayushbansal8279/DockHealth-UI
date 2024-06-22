import { fontWeights } from '@/app/styles/font';
import spacing from '@/app/styles/spacing';
import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';

export const DashboardHeaderContainer = styled.div`
  @media print {
    display: none;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 35px 35px;
  grid-template-rows: 32px;
  height: 32px;
  z-index: 13;
  overflow: hidden;
  @media print {
    display: none;
  }
`;

export const GridItemCalendarView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 32px;
  text-align: center;
  border-radius: 4px 0px 0px 4px;
  border-width: ${({ active }) =>
    active ? '0px 0px 0px 0px;' : '1px 0px 1px 1px;'};
  border-style: solid;
  border-color: ${palette.zinc};
  padding: 1px 4px 10px 4px;
  gap: 10px;
  cursor: pointer;
  @media print {
    display: none;
  }
`;

export const GridItemSlimView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 32px;
  text-align: center;
  cursor: pointer;
  border-width: ${({ active }) =>
    active ? '0px 0px 0px 0px;' : '1px 1px 1px 0px;'};
  border-style: solid;
  border-color: ${palette.zinc};
  border-radius: 0px 4px 4px 0px;
  padding: 2px 8px 10px 5px;
  gap: 10px;
  @media print {
    display: none;
  }
`;

export const AddTaskButtonWrapper = styled(Button)`
  && {
    border-radius: 4px;
    background-color: ${palette.newDarkBlue};
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
`;

export const AddTaskButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      margin-right: 5px;
    }
  }
`;
