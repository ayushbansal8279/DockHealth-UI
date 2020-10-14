import React from 'react';
import moment from 'moment';
import { descend, groupBy, pipe, prop, sortBy } from 'ramda';
import Comment from './NewTaskDrawer.Comment';
import {
  CommentGroupContainer,
  CommentGroupDateLabel,
} from './NewTaskDrawer.CommentSection.Styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
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

export const renderCommentGroup = props => ([date, comments]) => {
  let dateLabel = '';

  if (moment(date).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(date).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(date).format('dddd MMMM D');
  }

  return (
    <CommentGroupContainer key={date}>
      <CommentGroupDateLabel>{dateLabel}</CommentGroupDateLabel>
      {comments.map(renderComment(props))}
    </CommentGroupContainer>
  );
};

export const getGroupedComments = ({ comments }) =>
  pipe(
    sortBy(descend(prop('dateCreated'))),
    groupBy(({ dateCreated }) => moment(dateCreated).format(DATE_ISO_FORMAT)),
  )(comments);
