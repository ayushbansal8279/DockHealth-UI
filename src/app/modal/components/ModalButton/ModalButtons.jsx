import { fontWeights } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import styled from 'styled-components';
import { Button } from '@mui/material';
import spacing from '@/app/styles/spacing';

export const ConfirmButton = styled.button`
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
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  width: 200px;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }
`;

export const CancelButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px ${spacing.large};
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid ${palette.oPlusRed};
  color: ${palette.oPlusRed};
  font-family: Outfit;
  text-align: center;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  width: 200px;
`;
