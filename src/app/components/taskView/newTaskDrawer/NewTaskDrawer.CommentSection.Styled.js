import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

export const CommentSectionContainer = styled.div`
  background-color: ${palette.coolGrey4};
  padding: ${spacing.large} 0;
  margin: 0 -2rem;
`;

export const CommentGroupContainer = styled.div`
  color: ${palette.coolGrey1};
  padding-top: ${spacing.small};
  padding-bottom: ${spacing.smallPlus};
`;

export const CommentActionLabel = styled.button`
  color: ${palette.lightGrey};
  cursor: pointer;
  opacity: 0;
  text-decoration: none;
  transition: all 0.25s ease-out;
  margin-top: ${spacing.tiny};

  &:hover {
    text-decoration: underline;
    color: ${palette.darkGrey};
  }
`;

export const CommentWrapper = styled.div`
  display: flex;
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 ${spacing.large};
  width: 100%;

  &:hover {
    ${CommentActionLabel} {
      opacity: 1;
    }
  }
`;

export const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${spacing.small} 0;
  margin-left: ${spacing.small};
  font-size: ${fontSizes.regular};
  transition: background-color 0.25s ease-out;
  background-color: ${props => props.isEditing && 'white'};
  justify-content: space-between;
`;

export const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 0 ${spacing.regular};
`;

export const CommentText = styled.div`
  color: ${palette.mediumGrey};
  font-weight: normal;
  max-width: 475px;
`;

export const CommentDetails = styled.div`
  color: ${palette.coolGrey2};
`;

export const EditCommentButton = styled.div`
  height: fit-content;
  visibility: ${props => (props.isEditing ? 'hidden' : 'visible')};
`;

export const CommentGroupDateLabel = styled.div`
  color: ${palette.coolGrey1};
  font-weight: 400;
  font-family: 'Roboto Condensed', sans-serif;
  padding: 0 ${spacing.large} ${spacing.smallPlus};
`;

export const CommentMemberContainer = styled.div`
  padding-top: ${spacing.small};
`;

export const CommentActionsSection = styled.div`
  display: flex;
  margin-right: ${spacing.regular};
`;
