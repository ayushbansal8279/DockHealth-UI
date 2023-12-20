import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const StyledHyperLink = styled.a`
  color: ${palette.darkBlue};
  &:hover,
  &:active,
  &:focus {
    color: ${palette.darkBlue};
  }
`;

export const CircleIcon = styled.img`
  cursor: pointer;
  margin-right: ${spacing.small};
  align-self: center;
  margin-left: ${spacing.tiny};
`;
