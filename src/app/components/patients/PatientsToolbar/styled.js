/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const SearchInputWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '300px')};
  transition: all 0.25s ease-in-out;
`;

export const Container = styled.div`
  padding: 16px;
`;

export const ImportButton = styled.button`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
