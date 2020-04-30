import styled from 'styled-components';

import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const CommentSectionContainer = styled.div`
  background-color: ${palette.coolGrey3};
  padding: 1.5rem 2.5rem;
  margin: 0 -2rem;
`;

export const CommentGroupContainer = styled.div`
  color: ${palette.coolGrey1};
`;

export const CommentActionLabel = styled.button`
  cursor: pointer;
  opacity: 0;
  text-decoration: underline;
  transition: all 0.25s ease-out;
`;

export const CommentContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;

  &:hover {
    ${CommentActionLabel} {
      opacity: 1;
    }
  }
`;

export const CommentMemberContainer = styled.div`
  padding-top: ${spacing.small};
`;

export const CommentInnerContainer = styled.div`
  background-color: ${props =>
    props.isEditing ? palette.white : 'transparent'};
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  padding: ${spacing.small} ${spacing.regular};
  transition: all 0.25s ease-out;
`;

export const CommentContentContainer = styled.div`
  color: ${palette.darkGrey};
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const AuthorLabelContainer = styled.div`
  color: ${palette.coolGrey2};
`;

export const CommentContentField = styled.div`
  && {
    background-color: transparent;
    border: 0;
    box-shadow: none;
    cursor: text;
    outline: none;
    padding: 0;
    resize: none;
  }
`;
