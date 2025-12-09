import styled from 'styled-components';
import { Button } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const WarningText = styled.p`
  font-family: Outfit;
  font-size: 20px;
  font-weight: ${fontWeights.regularPlus};
  font-style: SemiBold;
  line-height: 25px;
  text-align: center;
  color: ${palette.black};
  margin: 0 ${spacing.largePlus} ${spacing.largePlus} ${spacing.largePlus};
  padding: 0;
`;

export const DataRetentionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const DataRetentionTitle = styled.p`
  font-family: Outfit;
  font-weight: ${fontWeights.regularPlus};
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 0px;
  margin: 0 ${spacing.largePlus} 0 ${spacing.largePlus};
  padding: 0;
`;

export const DataRetentionText = styled.p`
  font-family: Outfit;
  font-size: 16px;
  font-weight: ${fontWeights.extraLight};
  line-height: 25px;
  color: ${palette.black};
  margin: 0 ${spacing.largePlus} ${spacing.large} ${spacing.largePlus};
  padding: 0;
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
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  min-width: 150px;

  &:hover {
    background-color: ${palette.white};
    border-color: ${palette.oPlusRed};
  }
`;

export const ConfirmCancelButton = styled(Button)`
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
  font-style: normal;
  font-weight: 500;
  line-height: 11.189px;
  text-transform: none;
  min-width: 150px;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }
`;
