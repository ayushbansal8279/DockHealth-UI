import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 22px;
  width: 100%;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  font-family: 'Roboto', sans-serif;
  background-color: ${palette.midnightBlue};
`;

export const Name = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.white};
  line-height: 1.2;
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.white};
`;

export const Price = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.largePlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.white};
  line-height: 1.2;
`;

export const Units = styled.span`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regular};
  color: ${palette.coolGrey2};
`;
