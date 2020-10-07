import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

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

export const CommentWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.isCommentAuthor && 'flex-end'};
  align-items: center;
  margin-right: ${props => props.isOneByOne && props.isCommentAuthor && '58px'};

  &:hover {
    ${CommentActionLabel} {
      opacity: 1;
    }
  }
`;

export const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isCommentAuthor ? 'flex-end' : 'flex-start')};
  margin-top: ${props => props.isOneByOne && `-${spacing.small}`};
  margin-bottom: ${spacing.regular};
  margin-left: ${props => props.isCommentAuthor && '44px'};
  font-size: ${fontSizes.regular};
`;

export const CommentContent = styled.div`
  display: flex;
  width: fit-content;
  flex-direction: ${props => props.isCommentAuthor && 'row-reverse'};
`;

export const CommentText = styled.div`
  color: ${palette.coolGrey9};
  font-weight: normal;
  background-color: white;
  border-radius: 42px;
  padding: 10px ${spacing.regularPlus};
  margin-left: ${props => props.isOneByOne && !props.isCommentAuthor && '48px'};
  max-width: 475px;
`;

export const CommentDetails = styled.div`
  display: flex;
  justify-content: ${props => props.isCommentAuthor && 'flex-end'};
  margin-left: ${props => !props.isCommentAuthor && '48px'};
  margin-right: ${props =>
    !props.isOneByOne && props.isCommentAuthor && '58px'};
  margin-bottom: ${spacing.tiny};
  font-size: ${fontSizes.small};
  color: ${palette.coolGrey1};
`;

export const CommentAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: ${props => props.isCommentAuthor && spacing.small};
  margin-right: ${props => !props.isCommentAuthor && spacing.small};
`;

export const EditCommentButton = styled.div`
  visibility: ${props => (props.isEditing ? 'hidden' : 'visible')};
`;
