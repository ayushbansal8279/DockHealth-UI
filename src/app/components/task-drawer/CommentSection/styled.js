import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const CommentSectionContainer = styled.div`
  background-color: ${palette.coolGrey4};
  padding: ${spacing.large} 32px;
  margin: 0 -2rem;
`;

export const CommentsListContainer = styled.div`
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.smallPlus};
`;
