import React from 'react';

import {
  SubtaskStylingLastLink,
  SubtaskStylingLinkContainer,
  SubtaskStylingVerticalPart,
  SubtaskStylingHorizontalPart,
} from '../styled';

export const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers?.length > 0
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;

export const originConfig = {
  PATIENT: {
    hasCustomOffset: true,
    disableLeftOffset: true,
    enableTaskGroup: false,
    quickAddWidthOffset: 20,
    disableRightOffset: true,
    showListPickerModal: true,
    dragAndDropDisabled: true,
  },
  LIST: {
    hasCustomOffset: false,
    disableLeftOffset: false,
    enableTaskGroup: true,
    quickAddWidthOffset: 87,
    disableRightOffset: false,
    showListPickerModal: false,
    dragAndDropDisabled: false,
  },
};

export const getSubtaskStylingLink = (isLast, origin) => {
  if (isLast)
    return (
      <SubtaskStylingLastLink
        hasCustomOffset={originConfig[origin]?.hasCustomOffset ?? false}
      />
    );

  return (
    <SubtaskStylingLinkContainer
      hasCustomOffset={originConfig[origin]?.hasCustomOffset ?? false}
    >
      <SubtaskStylingVerticalPart />
      <SubtaskStylingHorizontalPart />
    </SubtaskStylingLinkContainer>
  );
};
