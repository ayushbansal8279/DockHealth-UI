import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import { fontWeights } from 'styles/font';
import { Grid, Typography } from '@mui/material';
import spacing from 'styles/spacing';

export const ToolbarContainer = styled(Grid)`
  position: relative;
  height: 42px;
  border-bottom: 2px solid ${palette.blueGrey};
  flex-direction: column-reverse !important;
  align-items: flex-start !important;
  flex-wrap: inherit !important;

  @media screen and (min-width: 960px) {
    flex-direction: row !important;
    align-items: initial !important;
    flex-wrap: wrap;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${palette.white};
  padding: ${spacing.small} ${spacing.large};
`;

export const DashboardTabsContainer = styled.div`
  height: 100%;
  display: flex;
`;

export const DashboardTabsNumericalBadgeContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 13px;
  border: 1px solid ${({ isActive }) => (isActive ? '#4BB3FD' : '#D4D9DF')};
  color: ${({ isActive }) => (isActive ? '#4BB3FD' : '#8492A4')};
  background: ${({ isActive }) => (isActive ? '#F8F8F9' : '#F3F5F6')};
  padding: 4px 7px 4px 7px;
  gap: 7px;
  margin-left: 6px;
  text-align: center;
`;

export const DashboardTabsNumericalBadge = styled(Typography)`
  color: ${({ isActive }) => (isActive ? '#4BB3FD' : '#8492A4')};
  font-family: Outfit;
  font-weight: 500;
  font-size: 11px;
  line-height: 11.19px;
  text-align: center;
  align-items: center;
`;

export const DashboardTabsLabel = styled(Typography)`
  color: ${({ isActive }) => (isActive ? '#292D34' : '#8492A4')};
  font-family: Outfit;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  font-size: 18px;
  line-height: 22.68px;
`;

export const DashboardQuickFilterContainer = styled.div`
  display: flex;
`;

export const DashboardQuickFilter = styled.div`
  margin-left: 5px;
  width: fit-content;
  display: flex;
  height: 40px;
  align-items: center;
  text-align: center;
  padding: 10px;
  background-color: ${(props) =>
    props.active ? palette.whiteSmoke : opacify(palette.zinc, 0)};
  border-radius: ${(props) => (props.active ? '5px' : '0px')};
  // cursor: ${(props) => (props.active ? '' : 'pointer')};
`;

export const DashboardQuickFilterLabel = styled.div`
  // display: flex;
  text-align: center;
  color: ${(props) => (props.active ? palette.newBrightBlue : palette.zinc)};
`;

export const DashboardQuickFilterClear = styled.div`
  // display: flex;
  padding: 2px 0px 0px 5px;
  align-items: center;
  // width: auto;
  cursor: pointer;
  // background: red;
  color: ${palette.coolGrey1};
`;

export const DashboardTabHighlight = styled.div`
  background-color: ${palette.brightBlue};
  height: 4px;
  position: absolute;
  bottom: -3px;
  width: ${(props) => props.width};
  left: ${(props) => props.left};
  transition: left 0.2s ease-out;
`;

export const TipsSwitchLabel = styled.label`
  font-family: 'Outfit', sans-serif;
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.regular};
  vertical-align: middle;
  text-transform: uppercase;
`;

export const TaskViewSelectWrapper = styled.div`
  @media print {
    display: none;
  }
`;
