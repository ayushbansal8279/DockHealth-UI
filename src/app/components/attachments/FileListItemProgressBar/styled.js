import { LinearProgress as MuiLinearProgress } from '@mui/material';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const ProgressText = styled.p`
  display: block;
  margin: 0;
  margin-left: 16px;
  font-size: ${fontSizes.smallPlus};
  color: ${palette.coolGrey2};
`;

export const LinearProgress = styled(MuiLinearProgress)`
  .MuiLinearProgress-barColorPrimary {
    background-color: ${palette.midnightBlue};
  }

  .MuiLinearProgress-colorPrimary {
    background-color: ${palette.coolGrey2};
  }
`;
