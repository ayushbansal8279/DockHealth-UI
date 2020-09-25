import styled from 'styled-components';
import { Collapse } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TaskCommentsContainer = styled(Collapse)`
  display: flex;
  border: 1px solid ${palette.coolGrey3};
  border-top: none;
  flex-direction: column;
  padding: ${props => (props.in ? `${spacing.regular} ${spacing.regular}` : 0)};
  padding-left: 70px;
  border-left: 3px solid ${palette.brightBlue};
  background-color: ${palette.blueGrey};
`;

export const TaskCommentsGroupedDay = styled.div`
  display: flex;
  margin-bottom: ${spacing.regular};

  &:last-of-type {
    margin-bottom: 0;
  }

  & > div {
    cursor: pointer;
  }
`;

export const TaskCommentsDate = styled.div`
  color: ${palette.coolGrey6};
  font-size: ${fontSizes.small};
  margin-top: ${spacing.regular};
  margin-bottom: 10px;
`;

export const TaskCommentContainer = styled.div`
  display: flex;
  margin-top: ${props => props.isOneByOne && `-${spacing.small}`};
  margin-bottom: ${spacing.regular};
  font-size: ${fontSizes.regular};
  flex-direction: column;
  max-width: 720px;
  align-items: ${props => props.isCurrentUser && 'flex-end'};

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const TaskCommentContent = styled.div`
  display: flex;
  width: fit-content;
  flex-direction: ${props => props.isCurrentUser && 'row-reverse'};
`;

export const SmallText = styled.span`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const TaskCommentText = styled.div`
  color: ${palette.coolGrey9};
  font-weight: normal;
  background-color: white;
  border-radius: 42px;
  padding: 10px ${spacing.regularPlus};
  margin-left: ${props => props.isOneByOne && !props.isCurrentUser && '52px'};
  margin-right: ${props => props.isOneByOne && props.isCurrentUser && '60px'};
`;

export const TaskCommentDetails = styled.div`
  margin-left: ${props => !props.isCurrentUser && '60px'};
  margin-right: ${props => props.isCurrentUser && '60px'};
  font-size: ${fontSizes.small};
`;

export const TaskCommentAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: ${props => props.isCurrentUser && spacing.small};
  margin-right: ${spacing.small};
`;

export const ShowMoreButton = styled.button`
  cursor: pointer;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  margin-top: ${spacing.regularPlus};
  margin-left: 60px; // per design
  width: fit-content;
`;
