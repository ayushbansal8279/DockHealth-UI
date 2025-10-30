import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

export const CommentWrapper = styled.div`
  display: flex;
  width: 100%;
  font-family: inherit;
  margin-bottom: 1px solid red;
  ${({ $showPointer }) => ($showPointer ? 'cursor: pointer' : '')};
`;

export const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  margin-left: ${spacing.smallPlus};
  padding: ${spacing.tiny} ${spacing.small};
  font-size: ${fontSizes.regular};
  transition: background-color 0.25s ease-out;
  background-color: ${(props) => (props.isEditing ? 'white' : '')};
  justify-content: space-between;
`;

export const CommentContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const CommentText = styled.div`
  color: ${palette.mediumGrey};
  font-weight: normal;
  // max-width: 475px;
  width: 100%;
  & p {
    margin-bottom: 2px;
  }
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
`;

export const CommentDetails = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
`;

export const CommentMemberContainer = styled.div`
  padding-top: ${spacing.tiny};
  width: 35px;
`;

export const CommentActionsSection = styled.div`
  margin-right: ${spacing.regular};
`;
