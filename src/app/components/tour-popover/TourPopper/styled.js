import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export const CloseIconButton = styled(IconButton)`
  &&& {
    .MuiIconButton-root {
      position: absolute;
      top: 4px;
      right: 4px;
      display: block;
      color: ${palette.white};
    }
  }
`;

export const CloseIcon = styled(Close)`
  &&& {
    .MuiClose-root {
      width: 16px;
      height: 16px;
    }
  }
`;

export const PopperTopArrow = styled.div`
  position: absolute;
  top: -2px;
  width: 20px;
  height: 22px;
  border-bottom: 22px solid ${palette.darkBlue};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
`;

export const PopperBottomArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: -2px;
  transform: rotate(-180deg);
`;

export const PopperLeftArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: auto;
  left: -2px;
  transform: rotate(-90deg);
`;

export const PopperRightArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: auto;
  right: -2px;
  transform: rotate(-270deg);
`;

export const PopperWrapper = styled.div`
  position: relative;
  ${({ yAxisMargin }) =>
    yAxisMargin && `margin: ${spacing.regular} ${spacing.tiny};`}
  ${({ xAxisMargin }) => xAxisMargin && `margin: 0 ${spacing.regular};`}
  background: ${palette.darkBlue};
  border-radius: 5px;
`;
