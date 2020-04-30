import styled from 'styled-components';

import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const AddCommentContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: ${spacing.smallPlus};
  position: relative;
`;

export const AddCommentInput = styled.input`
  background-color: ${palette.white};
  border: 0;
  box-shadow: none;
  color: ${palette.darkGrey};
  font-family: 'Roboto Condensed', sans-serif;
  margin: 0;
  outline: 0;
  padding: ${spacing.regular};
`;

export const AddCommentLoaderContainer = styled.div`
  position: absolute;
  right: ${spacing.regular};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;
