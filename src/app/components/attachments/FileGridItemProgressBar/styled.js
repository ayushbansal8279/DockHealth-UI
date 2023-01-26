import { CircularProgress as MuiCircularProgress } from '@mui/material';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const CircularProgress = styled(MuiCircularProgress)`
  &&& {
    .MuiCircularProgress-colorPrimary {
      color: ${palette.midnightBlue};
    }
  }
`;

export const Container = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 203px;
  height: 160px;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 14px;
`;

export const ProgressText = styled.p`
  margin: 0;
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;
