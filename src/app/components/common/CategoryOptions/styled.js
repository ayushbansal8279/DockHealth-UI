import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const LabeledCollapseHeaderButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const LabeledCollapseItemName = styled.p`
  display: block;
  flex: 1;
  margin: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Outfit', sans-serif;
  text-align: left;
`;
