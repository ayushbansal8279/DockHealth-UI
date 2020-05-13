import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const Cross = styled.span`
  color: ${palette.orange};
  cursor: pointer;
  margin-right: ${spacing.smallPlus};
`;

export const Description = styled.div`
  color: ${palette.lightGrey};
  margin-left: ${spacing.regularPlus};
`;

export const Header = styled.span`
  color: ${palette.brightBlue};
  cursor: pointer;
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const ButtonWrapper = styled.button`
  text-align: left;
`;
