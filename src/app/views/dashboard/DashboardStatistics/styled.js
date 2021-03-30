import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const DashboardStatisticsTilesContainer = styled.div`
  display: flex;

  & > div {
    margin-right: ${spacing.small};
  }
`;

export const DashboardStatisticsTileContainer = styled.div`
  width: 25%;
  background-image: ${props => props.background};
  border-radius: 10px;
  padding: 10px 10px ${spacing.regular} ${spacing.regular};
  display: flex;
  justify-content: space-between;
  max-width: ${({ maxWidth }) => maxWidth};
`;

export const DashboardStatisticsTileText = styled.div`
  padding-top: 12px;
  display: flex;
  align-items: flex-end;
  position: relative;
  width: calc(100% - 40px);
`;

export const DashboardStatisticsTileAmount = styled.div`
  font-size: 43px;
  font-weight: ${fontWeights.regularPlus};
  color: ${props => (props.hasBackground ? 'white' : palette.mediumGrey)};
  margin-right: ${spacing.small};
  display: inline-block;
  vertical-align: top;
  height: 0.75em;
  line-height: 0.75em;
`;

export const DashboardStatisticsTileLabelBox = styled.div`
  display: flex;
`;

export const DashboardStatisticsTileLabel = styled.div`
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  color: ${props => (props.hasBackground ? 'white' : palette.mediumGrey)};
  line-height: normal;
`;

export const DashboardStatisticsTileIconContainer = styled.div`
  display: flex;
  align-items: baseline;

  & > img {
    max-width: initial;
    height: initial;
  }
`;

export const DashboardStatisticsContainer = styled.div`
  padding: ${spacing.regular};
  background-color: ${palette.coolGrey4};
  margin: ${spacing.smallPlus} 0;
  width: 100%;
`;

export const DashboardStatisticsLabel = styled.span`
  color: ${palette.coolGrey1};
  font-weight: ${fontWeights.regularPlus};
  padding-left: ${props => props.paddingLeft};
`;

export const DashboardStatisticsLabelBox = styled(Grid)`
  display: flex;
  align-items: center;
  max-width: 317px !important;
  margin-right: 8px !important;
`;
