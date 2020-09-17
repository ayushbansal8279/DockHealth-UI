import styled from 'styled-components';

import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const CommentSectionContainer = styled.div`
  background-color: ${palette.blueGrey};
  padding: 1.5rem 2.5rem;
  margin: 0 -2rem;
`;

export const CommentGroupContainer = styled.div`
  color: ${palette.coolGrey1};
  padding-top: ${spacing.small};
`;

export const CommentActionLabel = styled.button`
  color: ${palette.lightGrey};
  cursor: pointer;
  opacity: 0;
  text-decoration: none;
  transition: all 0.25s ease-out;
  &:hover {
    text-decoration: underline;
    color: ${palette.darkGrey};
  }
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
