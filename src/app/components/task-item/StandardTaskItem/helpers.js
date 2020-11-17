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
