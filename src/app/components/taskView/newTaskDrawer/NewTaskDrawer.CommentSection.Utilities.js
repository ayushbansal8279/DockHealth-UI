import React from 'react';
import moment from 'moment';
import Comment from './NewTaskDrawer.Comment';

const COMMENT_DATE_FORMAT = 'h:mma';

export const getFormattedCommentDate = ({ dateUpdated }) =>
  moment(dateUpdated).format(COMMENT_DATE_FORMAT);

export const renderComment = ({
  currentUser,
  removeComment,
  updateComment,
}) => comment => {
  return (
    <Comment
      key={comment.commentIdentifier}
      comment={comment}
      currentUser={currentUser}
      removeComment={removeComment}
      updateComment={updateComment}
      getFormattedCommentDate={getFormattedCommentDate}
    />
  );
};
