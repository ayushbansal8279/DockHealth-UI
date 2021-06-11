/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const SearchInputWrapper = styled.div`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '300px')};
  transition: all 0.25s ease-in-out;
`;

export const Container = styled.div`
  padding: 16px;
`;
