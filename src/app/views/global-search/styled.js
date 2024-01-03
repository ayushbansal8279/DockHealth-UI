import styled from 'styled-components';
import { Grid } from '@mui/material';
import spacing from 'styles/spacing';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const EmptyGlobalSearchImage = styled.img`
  width: 420px;
  height: 270px;
`;

export const VerticalScrollContainer = styled.div`
  padding: 0 ${spacing.large};
  box-sizing: border-box;
  width: 100%;
  position: relative;
`;

export const GlobalSearchWrapper = styled.div`
  position: relative;
  padding: 10px 0; // per design
`;

export const TopSectionGrid = styled(Grid)`
  padding-bottom: ${spacing.largePlus};
`;

export const InputWrapper = styled.div`
  width: 645px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: ${typography.text};
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;

export const GlobalSearchStickyHeader = styled.div`
  z-index: 13;
  background: ${palette.blueGrey};
`;

export const ViewSidePadding = styled.div``;

export const EmptyGlobaSearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
`;

export const EmptySearchText = styled(Text)`
  text-transform: uppercase;
`;

export const EmptyResultsText = styled(Text)`
  font-size: ${fontSizes.huge};
`;
