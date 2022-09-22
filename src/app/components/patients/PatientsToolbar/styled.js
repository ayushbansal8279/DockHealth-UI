/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';
import spacing from 'styles/spacing';

export const ImportButton = styled.button`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const InputWrapper = styled.div`
  width: 66.67%;
  max-width: 1147px;
  margin: 0 auto;
  padding-top: ${({ hasValue }) => (hasValue ? 16 : 32)}px;
  transition: padding 0.3s ease-out;
`;

export const SearchHelperText = styled.p`
  /* max-width: 700px; */
  margin: 0 auto;
  padding-top: ${spacing.huge};
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;
