import { ButtonGroup } from '@mui/material';
import styled from 'styled-components';

export const ButtonGroupFlexStyled = styled(ButtonGroup)`
  &&& {
    &.MuiButtonGroup-root {
      display: flex;
      justify-content: center;
      gap: 50px;
    }
  }
`;

export const ContactStepFormStyled = styled.form`
  width: 100%;
`;
