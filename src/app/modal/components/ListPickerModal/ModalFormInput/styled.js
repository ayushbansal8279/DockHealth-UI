import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const Input = styled.input`
  width: 100%;
  padding: ${spacing.small} 0;
  border: none;
  border-bottom: 1px solid
    ${({ hasError }) => (hasError ? palette.error : palette.coolGrey2)};
  border-radius: 0;
  font-size: ${fontSizes.regular};

  &:placeholder {
    color: ${palette.lightGrey};
  }

  &:disabled {
    background: transparent;
  }

  &:focus {
    outline: none;
  }
`;

export const InputLabel = styled.label`
  font-size: ${fontSizes.small};
  color: ${({ hasError }) => (hasError ? palette.error : palette.coolGrey2)};
  text-transform: uppercase;
`;

export const InputErrorLabel = styled.div`
  margin-top: ${spacing.tiny};
  color: ${palette.error};
  font-size: ${fontSizes.small};
`;

export const InputWrapper = styled.div`
  width: 100%;
  font-family: 'Roboto Condensed';
`;
