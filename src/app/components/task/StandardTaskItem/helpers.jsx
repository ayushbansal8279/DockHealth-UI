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

export const getSubtaskStylingLink = (isLast, origin) => {
  if (isLast) return <SubtaskStylingLastLink origin={origin} />;

  return (
    <SubtaskStylingLinkContainer origin={origin}>
      <SubtaskStylingVerticalPart />
      <SubtaskStylingHorizontalPart />
    </SubtaskStylingLinkContainer>
  );
};
