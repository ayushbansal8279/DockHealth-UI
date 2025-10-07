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
    widthOffset: 27,
  },
  LIST: {
    hasCustomOffset: false,
    disableLeftOffset: false,
    enableTaskGroup: true,
    widthOffset: 87,
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
