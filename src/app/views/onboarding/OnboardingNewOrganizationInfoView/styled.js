import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const InfoContainer = styled.div`
  width: 100%;
  font-family: 'Outfit', sans-serif;
`;

export const Title = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const CancelButtonContainer = styled.div`
  width: 265px;
`;
export const ContinueButtonContainer = styled.div`
  width: 265px;
`;
