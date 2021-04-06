import React, { useRef } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import CompletedTileIcon from 'img/tiles/completed-tile-icon';
import AssingnedTileIcon from 'img/tiles/assigned-tile-icon';
import PatientsCaredTileIcon from 'img/tiles/patients-cared-tile-icon';

import {
  DashboardStatisticsTileContainer,
  DashboardStatisticsTileText,
  DashboardStatisticsTileAmount,
  DashboardStatisticsTileLabel,
  DashboardStatisticsTileIconContainer,
  DashboardStatisticsTileLabelBox,
} from './styled';

const BACKGROUND_GRADIENTS = {
  greenTurquoise: ' linear-gradient(225.32deg, #00A2E5 0%, #BAD440 96%)',
  orangeYellow: ' linear-gradient(225.32deg, #FECD21 0%, #EF8A23 96%)',
  purpleBlue: 'linear-gradient(225.32deg, #00A2E5 0%, #581384 96%)',
  orangeRed: 'linear-gradient(225.32deg, #CC2B61 0%, #F09937 96%)',
  redPurple: 'linear-gradient(225.32deg, #553BBE 0%, #E94739 96%)',
  bluePurple: 'linear-gradient(225.32deg, #553BBE 25%, #184B8F 96%)',
};

const TILE_ICON = {
  completed: {
    src: CompletedTileIcon,
    width: 19.5,
    height: 20,
  },
  assigned: {
    src: AssingnedTileIcon,
    width: 15,
    height: 21,
  },
  patientsCared: {
    src: PatientsCaredTileIcon,
    width: 17,
    height: 21,
  },
};

const DashboardStatisticsTile = ({
  background,
  icon,
  amount = 0,
  label,
  alignText,
  showAmount = true,
  maxWidth,
}) => {
  const tileReference = useRef(null);
  const backgroundGradient = BACKGROUND_GRADIENTS[background];
  const tileIcon = TILE_ICON[icon];

  return (
    <DashboardStatisticsTileContainer
      ref={tileReference}
      background={backgroundGradient}
      maxWidth={maxWidth}
    >
      <DashboardStatisticsTileText>
        {showAmount && (
          <MontserratTypography variant="inherit">
            <DashboardStatisticsTileAmount hasBackground={!!backgroundGradient}>
              {amount}
            </DashboardStatisticsTileAmount>
          </MontserratTypography>
        )}
        <DashboardStatisticsTileLabelBox>
          <MontserratTypography variant="inherit">
            <DashboardStatisticsTileLabel
              hasBackground={!!backgroundGradient}
              alignText={alignText}
            >
              {label}
            </DashboardStatisticsTileLabel>
          </MontserratTypography>
        </DashboardStatisticsTileLabelBox>
      </DashboardStatisticsTileText>
      <DashboardStatisticsTileIconContainer>
        {tileIcon && <img {...tileIcon} alt="tile icon" />}
      </DashboardStatisticsTileIconContainer>
    </DashboardStatisticsTileContainer>
  );
};

export default DashboardStatisticsTile;
