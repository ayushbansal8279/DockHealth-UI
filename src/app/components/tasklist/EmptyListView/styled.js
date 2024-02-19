import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const EmptyListContainer = styled.div`
  margin: ${spacing.huge} 0;
  text-align: center;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
`;

export const EmptyFilteredListContainer = styled.div`
  text-align: left;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
`;

export const TextWrapper = styled.div`
  flex: 1;
  padding-right: 80px;
  color: ${palette.mediumGrey};
  font-family: 'Outfit', sans-serif;
`;

export const ImageWrapper = styled.div`
  width: 390px;
`;

export const Image = styled.img`
  width: 100%;
`;

export const Title = styled.h3`
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  margin-bottom: 0;
`;

export const Description = styled.p`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.regular};
  margin-bottom: 0;
  margin-top: ${spacing.smallPlus};
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;

  @media (max-width: ${({ mediaBreakpoint }) =>
      `${mediaBreakpoint || 1153}px`}) {
    flex-direction: column;

    ${TextWrapper} {
      order: 2;
      padding-right: 0;
      margin-top: ${spacing.regularPlus};
      text-align: center;
    }

    ${ImageWrapper} {
      order: 1;
    }
  }
`;
