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
  border: 1px solid
    ${({ isActive }) => (isActive ? palette.crystalBlue : palette.iron)};
  color: ${({ isActive }) =>
    isActive ? palette.crystalBlue : palette.coolGrey1};
  background: ${({ isActive }) =>
    isActive ? palette.whiteSmoke : palette.lightGrey2};
  // padding: 4px 7px 4px 7px;
  gap: 7px;
  margin-left: 6px;
`;

export const DashboardTabsNumericalBadge = styled(Typography)`
  color: ${({ isActive }) =>
    isActive ? palette.crystalBlue : palette.coolGrey1};
  font-family: Outfit;
  font-weight: 500;
  font-size: 11px;
  line-height: 11.19px;
  &.MuiTypography-root {
    text-align: center;
  }
  margin-top: 4px;
`;

export const DashboardTabsLabel = styled(Typography)`
  color: ${({ isActive }) => (isActive ? palette.offBlack : palette.coolGrey1)};
  font-family: Outfit;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  font-size: 18px;
  line-height: 22.68px;
`;

export const DashboardQuickFilterContainer = styled.div`
  display: flex;
`;

export const DashboardQuickFilter = styled.div`
  width: fit-content;
  height: 32px;
  padding: 10px 8px 10px 8px;
  border-radius: 4px;
  gap: 6px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  text-align: center;
  background-color: ${palette.whiteSmoke};
  cursor: pointer;
`;

export const DashboardQuickFilterLabel = styled.div`
  font-family: Outfit;
  font-size: 14px;
  font-weight: 400;
  line-height: 11px;
  letter-spacing: 0em;
  text-align: center;
  color: ${(props) =>
    props.active ? palette.newBrightBlue : palette.shadowBlue};
`;

export const DashboardQuickFilterClear = styled.div`
  padding: 2px 0px 0px 0px;
  align-items: center;
  cursor: pointer;
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
