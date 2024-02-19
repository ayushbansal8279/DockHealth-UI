import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

export const CommentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-family: inherit;
  margin-bottom: 1px solid red;
`;

export const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${spacing.small} 0;
  margin-left: ${spacing.smallPlus};
  font-size: ${fontSizes.regular};
  transition: background-color 0.25s ease-out;
  background-color: ${(props) => (props.isEditing ? 'white' : '')};
  justify-content: space-between;
`;

export const CommentContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 ${spacing.regular};
`;

export const CommentText = styled.div`
  color: ${palette.mediumGrey};
  font-weight: normal;
  // max-width: 475px;
  width: 100%;
  & p {
    margin-bottom: 2px;
  }
`;

export const CommentDetails = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
`;

export const CommentMemberContainer = styled.div`
  padding-top: ${spacing.small};
`;

export const CommentActionsSection = styled.div`
  margin-right: ${spacing.regular};
`;
