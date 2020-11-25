/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled, { css } from 'styled-components';
import { Collapse } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const TaskCommentsContainer = styled(({ isLast, ...restProps }) => (
  <Collapse {...restProps} />
))`
  display: flex;
  width: fit-content;
  border: 1px solid ${palette.coolGrey3};
  border-top: 0;
  flex-direction: column;
  padding: ${props => (props.in ? `${spacing.smallExtraPlus}` : 0)};
  padding-left: 56px;
  background-color: white;
  max-width: 810px;
  position: relative;

  ${({ isLast }) =>
    !isLast &&
    css`
      border-bottom: 0;
    `}
`;

export const TaskCommentContainer = styled.div`
  display: flex;
  margin-bottom: ${({ isLastComment, showMore }) =>
    isLastComment && !showMore ? 0 : spacing.smallExtraPlus};
  font-size: ${fontSizes.smallPlus};
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

export const CommentStylingLink = styled.div`
  height: calc(1px + 100%);
  width: 18px;
  border-left: 1px solid ${palette.coolGrey2};
  border-radius: 0;
  position: absolute;
  padding: 1px 0;
  left: -19px;
  top: -1px;
`;
