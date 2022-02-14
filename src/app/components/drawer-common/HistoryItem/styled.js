import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const DescriptionContainer = styled.div`
  flex: 1;
`;

export const Text = styled.p`
  margin: 0;
  color: ${palette.coolGrey2};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const Description = styled(Text)`
  color: ${palette.mediumGrey};
`;

export const DateText = styled(Text)`
  line-height: 1;
`;

export const TypeText = styled(Text)`
  display: block;
`;
