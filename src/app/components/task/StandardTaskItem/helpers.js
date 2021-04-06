import React from 'react';

import {
  SubtaskStylingLastLink,
  SubtaskStylingLinkContainer,
  SubtaskStylingVerticalPart,
  SubtaskStylingHorizontalPart,
} from '../styled';

/* eslint-disable import/prefer-default-export */
export const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers?.length > 0
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;

export const getSubtaskStylingLink = isLast => {
  if (isLast) return <SubtaskStylingLastLink />;

  return (
    <SubtaskStylingLinkContainer>
      <SubtaskStylingVerticalPart />
      <SubtaskStylingHorizontalPart />
    </SubtaskStylingLinkContainer>
  );
};

export const TASK_ITEM_DESCRIPTION_COLUMN = 'TASK_ITEM_DESCRIPTION_COLUMN';
export const TASK_ITEM_DUE_DATE_COLUMN = 'TASK_ITEM_DUE_DATE_COLUMN';
export const TASK_ITEM_ICONS_COLUMN = 'TASK_ITEM_ICONS_COLUMN';
export const TASK_ITEM_LIST_COLUMN = 'TASK_ITEM_LIST_COLUMN';
export const TASK_ITEM_MEMBERS_COLUMN = 'TASK_ITEM_MEMBERS_COLUMN';
export const TASK_ITEM_PATIENT_COLUMN = 'TASK_ITEM_PATIENT_COLUMN';
export const TASK_ITEM_SUBTASKS_COLUMN = 'TASK_ITEM_SUBTASKS_COLUMN';
export const TASK_ITEM_WORFKLOW_STATUS_COLUMN =
  'TASK_ITEM_WORFKLOW_STATUS_COLUMN';

export const checkColumnIsInConfig = (column, taskConfig) =>
  taskConfig?.includes(column);
