import { IconButton, Box, Modal } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import { Close } from '@mui/icons-material';

export const CustomModal = styled(Modal)``;

export const ListModalWrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Roboto Condensed', sans-serif;
  background-color: white;
  width: 600px;
  min-height: 340px;
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.giga};
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.huge};
`;

export const Body = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: ${spacing.huge};
  max-width: 798px;
  margin: 0 auto;
  padding-top: 10px;
  color: ${palette.mediumGrey};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
`;

export const CloseIconButton = styled(IconButton)`
  &&& {
    &.MuiIconButton-root {
      position: absolute;
      top: 8px;
      right: 8px;
      display: block;
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    &.MuiClose-root {
      width: 16px;
      height: 16px;
    }
  }
`;
