import React from 'react';
import moment from 'moment';
import { descend, groupBy, pipe, prop, sortBy } from 'ramda';
import Comment from './NewTaskDrawer.Comment';
import { CommentGroupContainer } from './NewTaskDrawer.CommentSection.Styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const COMMENT_DATE_FORMAT = 'h:mma';

export const getFormattedCommentDate = ({ dateUpdated }) =>
  moment(dateUpdated).format(COMMENT_DATE_FORMAT);

export const renderComment = ({
  currentUser,
  removeComment,
  updateComment,
  comments,
}) => (comment, index) => {
  return (
    <Comment
      key={comment.commentIdentifier}
      comment={comment}
      currentUser={currentUser}
      removeComment={removeComment}
      updateComment={updateComment}
      getFormattedCommentDate={getFormattedCommentDate}
      isOneByOne={
        comments[index - 1] &&
        comments[index - 1]?.creator?.userIdentifier ===
          comment?.creator?.userIdentifier
      }
    />
  );
};

export const renderCommentGroup = props => ([date, comments]) => {
  return (
    <CommentGroupContainer key={date}>
      {comments.map(renderComment({ ...props, comments }))}
    </CommentGroupContainer>
  );
};

export const getGroupedComments = ({ comments }) =>
  pipe(
    sortBy(descend(prop('dateCreated'))),
    groupBy(({ dateCreated }) => moment(dateCreated).format(DATE_ISO_FORMAT)),
  )(comments);
