import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const MoreActinsWrapper = styled.div`
  display: flex;
  width: auto;
`;

export const ContentWrapper = styled.div`
  padding: 0px 10px 48px 10px;
  box-sizing: border-box;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  background: ${palette.white};
`;

export const TitleName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Outfit', sans-serif;
  text-transform: uppercase;
`;

export const NewDrawerContainer = styled.div`
  padding: 10px;
  height: 100%;
`;
