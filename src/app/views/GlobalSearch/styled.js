import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const GlobalSearchWrapper = styled.div`
  position: relative;
  padding: 30px 0; // per design
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

export const GlobalSearchStickyHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background: ${palette.blueGrey};
`;

export const ViewSidePadding = styled.div`
  padding: 0 43px;
`;
