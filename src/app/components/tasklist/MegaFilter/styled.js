import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const MegaFilterNoResultsLabel = styled.p`
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 0;
`;
export const MegaFilterContainer = styled.div`
  // padding: 0 8px;
  // height: 36px;
  display: flex;
  // background: yellow;
  @media print {
    display: none;
  }
`;
