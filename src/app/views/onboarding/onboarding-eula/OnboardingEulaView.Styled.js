import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { OnboardingH3 } from '../OnboardingTemplate.Components';

export const EulaContainer = styled.pre`
  border: 0.0625rem solid #ededf0;
  box-sizing: border-box;
  min-height: 4rem;
  max-height: 40rem;
  padding: 1rem 2rem;
`;

export const OnboardAcceptingGrid = styled(Grid)`
  && {
    height: 4rem;
  }
`;

export const OnboardAcceptingLabel = styled(OnboardingH3)`
  color: #ababb2;
`;
