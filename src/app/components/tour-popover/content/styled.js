import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const TourContent = styled.div`
  padding: 32px 24px;
  width: ${({ width }) => width ?? 384}px;
  color: ${palette.white};
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.regular};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
`;

export const Description = styled.p`
  margin-bottom: 0px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const CloseIconButton = withStyles({
  root: {
    position: 'absolute',
    top: 20,
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

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: ${spacing.large};
`;

export const NavigationDotsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const DotNavigationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10px;
  height: 10px;
  margin-right: ${spacing.small};
  outline: none;
  cursor: pointer;
`;

export const Dot = styled.div`
  width: ${({ isNext }) => (isNext ? '6' : '10')}px;
  height: ${({ isNext }) => (isNext ? '6' : '10')}px;
  margin: 0 auto;
  border-radius: 50%;
  background: ${({ isNext }) => (isNext ? palette.coolGrey2 : palette.white)};
`;

export const TourButton = styled.button`
  padding: ${spacing.tiny} ${spacing.huge};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.white};
  border: 2px solid ${palette.white};
  cursor: pointer;
  outline: none;
  text-transform: uppercase;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
