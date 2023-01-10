import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const CommentSectionContainer = styled.div`
  background-color: ${palette.coolGrey4};
  padding: ${spacing.large} 32px;
  margin: 0 -2rem;
`;

export const CommentsListContainer = styled.div`
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.smallPlus};
`;

export const Title = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
`;
