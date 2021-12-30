/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled, { css } from 'styled-components';
import { Collapse } from '@material-ui/core';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TaskCommentsContainer = styled(Collapse)`
  width: calc(100vw - 130px) !important;
  position: sticky;
  left: 24px;
`;

export const TaskCommentsPadding = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 34px;
  padding-right: 34px;
  border: 1px solid ${palette.coolGrey3};
  border-top: none;
  background-color: white;
`;

export const TaskCommentContainer = styled.div`
  display: flex;
  padding: ${spacing.smallPlus} 0;
  border-bottom: 1px solid ${palette.coolGrey3};
  ${({ isLastComment, showMore }) =>
    isLastComment && !showMore && `border-bottom: none`};
  font-size: ${fontSizes.smallPlus};
`;

export const TaskCommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  cursor: pointer;
  font-size: ${fontSizes.small};
`;

export const SmallText = styled.span`
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
`;

export const TaskCommentText = styled.div`
  position: relative;
  padding-right: ${spacing.giga};
  color: ${palette.mediumGrey};
  font-weight: normal;
  max-width: 575px;
  overflow: hidden;
  max-height: ${({ wholeCommentVisible }) =>
    !wholeCommentVisible ? `2.2rem` : 'auto'};
`;

export const MoreButton = styled.button`
  position: absolute;
  bottom: 1px;
  right: 0;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.light};
  cursor: pointer;

  & > span {
    color: ${palette.brightBlue};
  }
`;

export const TaskCommentDetails = styled.div`
  color: ${palette.coolGrey1};
  margin-bottom: ${spacing.tiny};

  & b {
    font-weight: ${fontWeights.bold};
  }
`;

export const TaskCommentAvatarContainer = styled.div`
  margin-right: ${spacing.regular};
`;

export const ShowMoreButton = styled.button`
  width: fit-content;
  margin: ${spacing.small} 0;
  font-size: ${fontSizes.smallPlus};
  color: ${palette.brightBlue};
  font-family: 'Roboto Condensed', sans-serif;
  cursor: pointer;
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
