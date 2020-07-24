import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const CloseIconButton = withStyles({
  root: {
    position: 'absolute',
    top: 4,
    right: 4,
    display: 'block',
    color: palette.white,
  },
})(IconButton);

export const CloseIcon = withStyles({
  root: {
    width: 16,
    height: 16,
  },
})(Close);

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
  ${({ xAxisMargin }) => xAxisMargin && `margin: ${spacing.regular} 0;`}
  ${({ yAxisMargin }) => yAxisMargin && `margin: 0 ${spacing.regular};`}
  background: ${palette.darkBlue};
  border-radius: 5px;
`;
