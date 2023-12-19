import styled from 'styled-components';
import palette from 'styles/palette';

export const StyledHyperLink = styled.a`
  color: ${palette.darkBlue};
  &:hover,
  &:active,
  &:focus {
    color: ${palette.darkBlue};
  }
`;
