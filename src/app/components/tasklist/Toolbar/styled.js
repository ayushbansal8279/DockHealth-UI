import { Typography, Grid, IconButton, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ToolbarContainer = styled.div`
  display: block;
  width: 100%;
  background-color: ${palette.white};
  color: ${palette.coolGrey1};
`;

// LEGACY STYLES - REFACTOR REQUIRED
export const ToolbarLabel = withStyles({
  root: {
    color: palette.coolGrey1,
    display: 'inline-block',
  },
})(Typography);

export const ToolbarAvatarContainer = styled.div`
  align-items: center;
  border: 0.125rem solid ${palette.white};
  border-radius: 100%;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  width: 100%;
`;

export const MenuText = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

export const HeaderActionButtonsGrid = styled(Grid)`
  padding-right: ${spacing.huge};
`;

export const ToolbarBottomGrid = styled(Grid)`
  padding-left: ${spacing.giga};
  padding-right: ${spacing.giga};
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.small};
  background-color: ${palette.coolGrey4};
`;

export const StyledIconButton = styled(IconButton)``;
export const LeftContainer = styled.div`
  margin-left: auto !important;
  display: flex;
  align-items: center;
`;

export const ListDescription = styled.div`
  padding-left: ${spacing.giga};
  padding-right: 72px;
  display: block;
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  background-color: ${palette.coolGrey4};
  font-size: ${fontSizes.smallPLus};
  font-weight: ${fontWeights.regular};
  font-family: 'Montserrat', sans-serif;
`;
