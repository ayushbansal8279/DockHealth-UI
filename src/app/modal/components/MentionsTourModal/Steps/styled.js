import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  text-align: center;
`;

export const Image = styled.img`
  display: block;
  height: ${({ height }) => (height ? `${height}px` : '256px')};
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.hugePlus};
  font-weight: ${fontWeights.bold};
`;

export const Description = styled.p`
  display: block;
  width: 492px;
  margin-bottom: 0;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.extraLight};
  font-family: 'Roboto Condensed', sans-serif;
`;
