import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import Button from 'components/common/Button/Button';

export const UpgradePlanContainer = styled.div`
  font-family: Roboto Condensed;
  position: relative;
  display: flex;
  width: 267px;
  background: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  box-sizing: border-box;
  border-radius: 2px;
  justify-content: center;
  flex-wrap: wrap;
  padding: ${spacing.regular};
  align-items: center;
  flex-direction: column;
`;

export const IconContainer = styled.div`
  position: relative;
  display: flex;
  width: 58px;
  height: 58px;
  background: ${palette.white};
  border: 1px solid ${palette.coolGrey3};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const Title = styled.p`
  max-width: 200px;
  font-family: inherit;
  font-size: ${fontSizes.regular};
  margin-bottom: 0;
`;

export const Description = styled.p`
  font-family: inherit;
  width: 200px;
  white-space: break-spaces;
  text-align: center;
  font-size: ${fontSizes.smallPlus};
  margin-bottom: 0;
`;

export const UpgradeButtonContainer = styled.div`
  && {
    & .MuiButton-root {
      font-family: inherit;
      font-size: ${fontSizes.small};
      border-radius: 2px;
    }
  }
`;

export const LearnMoreButtonContainer = styled.div`
  && {
    & .MuiButton-root {
      text-transform: none;
      font-family: inherit;
      font-size: ${fontSizes.small};
      border-radius: 2px;
    }
  }
`;
