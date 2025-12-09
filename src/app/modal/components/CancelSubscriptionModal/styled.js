import styled from 'styled-components';
import { Button } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const ModalTitle = styled.h2`
  font-family: Outfit;
  font-size: 22px;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px;
  text-align: center;
  color: ${palette.offBlack};
  margin: ${spacing.large} 0 ${spacing.regular} 0;
  padding: 0 ${spacing.largePlus};
`;

export const ModalIntroText = styled.p`
  font-family: Outfit;
  font-size: 16px;
  font-weight: ${fontWeights.extraLight};
  line-height: 25px;
  text-align: center;
  color: ${palette.black};
  margin: 0 0 ${spacing.large} 0;
  padding: 0 ${spacing.largePlus};
`;

export const InfoBox = styled.div`
  background-color: ${palette.brightBlueWithAlpha || palette.aliceBlue};
  border-radius: 8px;
  padding: ${spacing.smallPlus} ${spacing.regular} ${spacing.smallPlus}
    ${spacing.regular};
  margin: 0 ${spacing.largePlus} ${spacing.large} ${spacing.largePlus};
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const InfoBoxText = styled.p`
  font-family: Outfit;
  font-size: 16px;
  font-weight: ${({ bold }) =>
    bold ? fontWeights.regularPlus : fontWeights.extraLight};
  line-height: 25px;
  color: ${palette.black};
  margin-bottom: 0px;
`;

export const InfoBoxTextBold = styled.span`
  font-weight: ${fontWeights.regularPlus};
`;

export const ReasonsContainer = styled.div`
  width: 100%;
  padding: 0 ${spacing.largePlus};
  margin-bottom: ${spacing.regular};
`;

export const ReasonLabel = styled.label`
  display: block;
  font-family: Outfit;
  font-size: 18px;
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.black};
  margin-bottom: ${spacing.regular};
`;

export const AdditionalFeedbackContainer = styled.div`
  width: 100%;
  padding: 0 ${spacing.largePlus};
  margin-bottom: ${spacing.large};
`;

export const AdditionalFeedbackLabel = styled.label`
  font-family: Outfit;
  font-weight: ${fontWeights.light};
  font-size: 18px;
`;

export const KeepSubscriptionButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px ${spacing.large};
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid ${palette.oPlusRed};
  background-color: ${palette.white};
  color: ${palette.oPlusRed};
  font-family: Outfit;
  text-align: center;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  min-width: 150px;

  &:hover {
    background-color: ${palette.white};
    border-color: ${palette.oPlusRed};
  }
`;

export const ContinueCancelButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  text-align: center;
  font-family: Outfit;
  font-weight: 500;
  line-height: 11.189px;
  text-transform: none;
  min-width: 150px;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }

  &:disabled {
    background-color: ${palette.shadowBlue};
    color: ${palette.white};
    border: none;
  }
`;
