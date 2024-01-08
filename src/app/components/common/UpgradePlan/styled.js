import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const UpgradePlanContainer = styled.div`
  font-family: inherit;
  position: relative;
  display: flex;
  width: 100%;
  background: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  box-sizing: border-box;
  border-radius: 2px;
  justify-content: center;
  flex-wrap: wrap;
  padding: ${spacing.small};
  align-items: center;
  flex-direction: column;
`;

export const IconContainer = styled.div`
  position: relative;
  display: flex;
  width: 62px;
  height: 62px;
  // background: ${palette.white};
  // border: 1px solid ${palette.coolGrey3};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  // border-radius: 50%;
`;

export const Title = styled.p`
  max-width: 200px;
  font-family: inherit;
  font-size: ${fontSizes.regularPlus};
  font-weight: 700;
  margin-bottom: 10;
`;

export const Description = styled.p`
  font-family: inherit;
  width: 250px;
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
    & .MuiLink-root {
      text-transform: none;
      font-family: inherit;
      font-size: ${fontSizes.small};
      border-radius: 2px;
    }
  }
`;
