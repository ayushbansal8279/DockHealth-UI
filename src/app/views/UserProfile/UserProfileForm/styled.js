import styled from 'styled-components';
import { Grid, ListItem } from '@material-ui/core';
import { Link } from 'react-router';
import palette from 'styles/palette';

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

export const StyledLinkLabel = styled.div`
  display: inline-flex;
  font-size: 20px;
  margin-right: 0.5rem;
  margin-top: 4rem;
`;

export const StyledRouterLink = styled(Link)`
  color: ${palette.lighterCyanBlue};
  display: inline-flex;
  font-size: 20px;
  margin-top: 4rem;
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover {
    color: ${palette.lighterCyanBlue};
    filter: brightness(1.25);
  }
`;

export const UserAvatarGrid = styled(Grid)`
  && {
    margin-bottom: 1.5rem;
  }
`;
