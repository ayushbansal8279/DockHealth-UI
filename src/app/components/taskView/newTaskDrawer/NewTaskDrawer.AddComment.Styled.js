import styled from 'styled-components';

import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const AddCommentContainer = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: ${spacing.smallPlus};
  position: relative;
  padding: 0 ${spacing.large};
`;

export const AddCommentInputContainer = styled.div`
  background-color: ${palette.white};
  border: 0;
  box-shadow: none;
  color: ${palette.darkGrey};
  font-family: 'Roboto Condensed', sans-serif;
  margin: 0;
  outline: 0;
  padding: ${spacing.regular};
  overflow: hidden;
  min-height: 60px;
  max-height: 120px;
  overflow-y: auto;

  ${({ isFocused }) =>
    isFocused &&
    `
      border: 1px solid #ababb2;
      box-shadow: 0 0 5px #c8c8ce;
      transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
  `}
`;

export const AddCommentLoaderContainer = styled.div`
  position: absolute;
  right: ${spacing.regular};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;
