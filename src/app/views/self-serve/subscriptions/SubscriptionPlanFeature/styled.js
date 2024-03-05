import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const FeatureContainer = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
`;

export const FeatureText = styled.p`
  position: relative;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 400;
  ${({ color }) => `color: ${color};`}
`;

export const ComingSoonText = styled.span`
  position: absolute;
  left: 0;
  top: -8px;
  font-size: ${fontSizes.tiny};
  font-weight: ${fontWeights.light};
  color: inherit;
`;
