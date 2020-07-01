import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const GlobalSearchWrapper = styled.div`
  padding: 49px 43px; // per design
`;

export const TopSectionGrid = styled(Grid)`
  padding-bottom: ${spacing.largePlus};
`;

export const InputWrapper = styled.div`
  width: 645px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;
