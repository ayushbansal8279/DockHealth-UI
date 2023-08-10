import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const StyledDashboardTab = styled.button`
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: ${fontWeights.bold};
  color: ${(props) => props.isSelected && palette.brightBlue};
  text-align: left;

  &:not(:last-of-type) {
    margin-right: ${spacing.giga};
  }

  &:focus {
    outline: none;
  }
`;
