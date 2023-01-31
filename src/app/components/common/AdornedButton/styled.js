import { ButtonBase as MuiButtonBase } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';

export const ButtonBase = styled(MuiButtonBase)`
  &&& {
    &.MuiButtonBase-root {
      background-color: ${palette.white};
      border: 0.0625rem solid ${palette.coolGrey3};
      border-radius: 0;
      height: 2.75rem;
      white-space: nowrap;
    }

    &.MuiButtonBase-label {
      align-items: center;
      color: ${palette.brightBlue};
      font-size: 1.1875rem;
      display: flex;
      padding: 0 0.75rem;
    }

    &.MuiButtonBase-adornment {
      align-items: center;
      border-right: 0.0625rem solid ${palette.coolGrey3};
      color: ${palette.coolGrey1};
      display: flex;
      height: 2.75rem;
      justify-content: center;
      padding: 0;
      width: 2.75rem;
    }
  }
`;

export const Label = styled(MontserratTypography)`
  &&& {
    &.MuiTypography-root {
      align-items: center;
      color: ${palette.brightBlue};
      font-size: 1.1875rem;
      display: flex;
      padding: 0 0.75rem;
    }
  }
`;

export const Adornment = styled.div`
  align-items: center;
  border-right: 0.0625rem solid ${palette.coolGrey3};
  color: ${palette.coolGrey1};
  display: flex;
  height: 2.75rem;
  justify-content: center;
  padding: 0;
  width: 2.75rem;
`;
