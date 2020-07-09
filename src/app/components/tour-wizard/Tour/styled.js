import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

export const TourContainer = styled.div`
  width: 648px;
  max-width: calc(100vw - 100px);
  padding: 25px 55px 35px 25px;
  background: linear-gradient(262.44deg, #01a0e3 0%, #074e8a 98.93%);
  border-radius: 5px;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.25);
  font-family: 'Montserrat', sans-serif;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StepImage = styled.img`
  height: 200px;
  width: 200px;
  margin-right: ${spacing.large};
`;

export const StepTextWrapper = styled.div`
  flex: 1;
  color: ${palette.white};
`;

export const StepTitle = styled.h2`
  margin-bottom: ${spacing.regular};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
`;

export const StepDescription = styled.p`
  margin-bottom: 0px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;

export const CloseIconButton = withStyles({
  root: {
    position: 'absolute',
    top: 8,
    right: 8,
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
  margin-top: ${spacing.regular};
  padding-left: 224px;
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
  width: ${({ isNext }) => (isNext ? '6px' : '100%')};
  height: ${({ isNext }) => (isNext ? '6px' : '100%')};
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

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;
