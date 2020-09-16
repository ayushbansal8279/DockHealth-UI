import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const FirstDescription = styled.span`
  font-weight: ${fontWeights.extraLight};
  text-align: center;
`;

export const SecondDescription = styled(FirstDescription)`
  margin-top: ${spacing.regular};
`;
