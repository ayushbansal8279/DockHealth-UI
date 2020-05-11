import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TaskCommentsContainer = styled.div`
  display: flex;
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  border-top: none;
  flex-direction: column;
  padding: ${spacing.largePlus} ${spacing.regular};
`;

export const TaskCommentsGroupedDay = styled.div`
  display: flex;
  margin-bottom: ${spacing.regular};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const TaskCommentsDate = styled.div`
  color: ${palette.lightGrey};
  padding-top: 6px; //per design
`;

export const TaskCommentContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing.large};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const TaskCommentText = styled.div`
  color: ${palette.darkGrey};
  max-width: 656px; //per design
`;

export const TaskCommentDetails = styled.div`
  color: ${palette.lightGrey};
`;

export const TaskCommentAvatarContainer = styled.div`
  margin: 0 ${spacing.huge};
`;

export const ShowMoreButton = styled.button`
  cursor: pointer;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  margin-top: ${spacing.large};
  margin-left: 180px; // per design
  width: fit-content;
`;
