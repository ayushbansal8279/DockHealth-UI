import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';

export const GlobalSearchWrapper = styled.div`
  padding: 49px 43px; // per design
`;

export const TopSectionGrid = styled(Grid)`
  padding-bottom: ${spacing.largePlus};
`;
