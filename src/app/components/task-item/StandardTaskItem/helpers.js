/* eslint-disable import/prefer-default-export */
export const getMatchedComments = (comments, matchingCommentIdentifiers) =>
  matchingCommentIdentifiers?.length > 0
    ? comments.filter(({ commentIdentifier }) =>
        matchingCommentIdentifiers.includes(commentIdentifier),
      )
    : comments;
