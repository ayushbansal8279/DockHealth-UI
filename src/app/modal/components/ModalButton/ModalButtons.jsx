import styled from 'styled-components';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import { fontWeights } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import spacing from '@/app/styles/spacing';

export const ConfirmButton = styled(LoadingButton)`
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
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '200px')};

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }

  &:disabled {
    color: ${palette.white};
    background-color: ${palette.shadowBlue};
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
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '200px')};

  &:disabled {
    border-color: ${palette.shadowBlue};
  }
`;
