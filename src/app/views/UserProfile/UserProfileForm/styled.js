import styled from 'styled-components';
import { Grid, ListItem } from '@material-ui/core';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const FormSwitchListItem = styled(ListItem)`
  && {
    padding-right: 0;
  }
`;

export const SectionSubtypography = styled.div`
  font-size: 16px;
`;

export const SectionTypography = styled(SectionSubtypography)`
  font-weight: bold;
`;

export const UserAvatarGrid = styled(Grid)`
  && {
    margin-bottom: 1.5rem;
  }
`;

export const FormInfoText = styled.p`
  margin-bottom: 0;
  padding: 0 ${spacing.regularPlus};
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regular};
`;
