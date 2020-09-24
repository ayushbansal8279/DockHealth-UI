import React from 'react';
import { RobotoTypography } from 'styles/theme';
import moment from 'moment';
import { descend, groupBy, pipe, prop, sortBy } from 'ramda';

import Spacing from 'components/common/Spacing';

import Comment from './NewTaskDrawer.Comment';
import { CommentGroupContainer } from './NewTaskDrawer.CommentSection.Styled';

const DATE_ISO_FORMAT = 'YYYY-MM-DD';
const COMMENT_DATE_FORMAT = 'h:mma';
const CALENDAR_LABELS = {
  sameDay: '[Today]',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd MMMM Do',
  sameElse: 'dddd MMMM Do',
};

export const getFormattedCommentDate = ({ dateUpdated }) =>
  moment(dateUpdated).format(COMMENT_DATE_FORMAT);

export const getCommentGroupDateLabel = ({ date }) =>
  moment(date)
    .calendar(null, CALENDAR_LABELS)
    .replace(/at .+$/, '');

export const renderComment = ({
  currentUser,
  removeComment,
  updateComment,
  taskListIdentifier,
}) => comment => {
  return (
    <Comment
      key={comment.commentIdentifier}
      comment={comment}
      currentUser={currentUser}
      removeComment={removeComment}
      updateComment={updateComment}
      getFormattedCommentDate={getFormattedCommentDate}
      taskListIdentifier={taskListIdentifier}
    />
  );
};

export const renderCommentGroup = props => ([date, comments]) => {
  return (
    <CommentGroupContainer key={date}>
      <RobotoTypography condensed variant="h4" color="inherit">
        {getCommentGroupDateLabel({ date })}
      </RobotoTypography>
      <Spacing vertical={3} />
      {comments.map(renderComment(props))}
    </CommentGroupContainer>
  );
};

export const getGroupedComments = ({ comments }) =>
  pipe(
    sortBy(descend(prop('dateCreated'))),
    groupBy(({ dateCreated }) => moment(dateCreated).format(DATE_ISO_FORMAT)),
  )(comments);
