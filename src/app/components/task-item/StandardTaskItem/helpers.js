/* eslint-disable import/prefer-default-export */
export const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;
