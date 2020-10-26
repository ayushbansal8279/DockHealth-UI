import styled from 'styled-components';
import { Collapse } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TaskCommentsContainer = styled(Collapse)`
  display: flex;
  width: fit-content;
  border: 1px solid ${palette.coolGrey3};
  border-top: none;
  flex-direction: column;
  padding: ${props =>
    props.in ? `${spacing.regularPlus} ${spacing.regular}` : 0};
  padding-left: 56px;
  background-color: white;
  max-width: 810px;
`;

export const TaskCommentContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing.regular};
  font-size: ${fontSizes.regular};
`;

export const TaskCommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  cursor: pointer;
`;

export const SmallText = styled.span`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const TaskCommentText = styled.div`
  color: ${palette.mediumGrey};
  font-weight: normal;
  max-width: 575px;
`;

export const TaskCommentDetails = styled.div`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const TaskCommentAvatarContainer = styled.div`
  margin-right: ${spacing.regular};
`;

export const ShowMoreButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  margin-left: 56px; // per design
  width: fit-content;
`;
