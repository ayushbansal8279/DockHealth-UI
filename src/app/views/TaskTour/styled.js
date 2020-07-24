import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const TaskTourWrapper = styled.div`
  padding: 28px 43px; // per design
  font-family: 'Montserrat', sans-serif;
`;

export const Title = styled.h2`
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.bold};
  font-family: inherit;
`;

export const Description = styled.p`
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const TaskTourImgWide = styled.img`
  display: block;
  width: 1200px;
  min-width: 1200px;
`;

export const TaskTourImgNarrow = styled.img`
  display: block;
  width: 1000px;
  min-width: 1000px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
`;

export const ButtonWrapper = styled.div`
  width: 307px;
  margin-left: auto;
`;
