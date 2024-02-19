import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const Wrapper = styled.div`
  padding: 0 55px;
  font-family: 'Outfit', sans-serif;
  color: ${palette.coolGrey1};
`;

export const Section = styled.section`
  margin-bottom: 50px;
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
`;

export const Description = styled.p`
  margin-bottom: 0px;
`;
