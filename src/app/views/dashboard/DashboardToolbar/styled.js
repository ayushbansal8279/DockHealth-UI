import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import { Grid } from '@material-ui/core';

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

export const ActionsContainer = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const DashboardTabsContainer = styled.div`
  height: 100%;
  display: flex;
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
  font-family: 'Montserrat', sans-serif;
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
