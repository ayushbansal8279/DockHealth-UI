import moment from 'moment';
import PropTypes from 'prop-types';
import groupWith from 'ramda/src/groupWith';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateComment } from '../../actions/task-actions';
import EditableDescription from '../common/EditableDescription';
import Comment from './Comment';
import Creator from './Creator';
import Day from './Day';
import SubmitComment from './SubmitComment';

const CommentStream = styled.div`
  margin-top: 12px;
  max-height: 365px;
  overflow: auto;
  white-space: pre-line;
  padding-right: 23px;
`;

class Comments extends React.PureComponent {
  handleCommentEdition = (value, name) => {
    const { task, updateComment: editComment } = this.props;
    const comment = { commentId: name, comment: value };
    editComment(task, comment);
  };

  render() {
    const { userId, comments, submit, disabled } = this.props;

    /* eslint-disable max-len */
    const sameDay = (comment1, comment2) =>
      comment1.dateCreated.date() === comment2.dateCreated.date();
    const sameCreator = (comment1, comment2) =>
      comment1.creator.userName === comment2.creator.userName;
    /* eslint-enable max-len */

    const isUser = creator => creator.userId === userId;

    const parsedComments = comments.map(comment => ({
      ...comment,
      dateCreated: moment(comment.dateCreated),
    }));

    const days = groupWith(sameDay, parsedComments).map(dayComments => ({
      date: dayComments[0].dateCreated,
      creators: groupWith(sameCreator, dayComments).map(creatorComments => ({
        creator: creatorComments[0].creator,
        comments: creatorComments,
      })),
    }));

    return (
      <>
        <SubmitComment submit={submit} disabled={disabled} />
        <CommentStream>
          {days.map(({ date, creators }) => (
            <Day date={date} key={date.format()}>
              {creators.map((
                { creator, comments }, // eslint-disable-line no-shadow
              ) => (
                <Creator
                  {...creator}
                  isOwn={isUser(creator)}
                  key={creator.userId}
                >
                  {comments.map(({ comment, commentId }) => (
                    <Comment isOwn={isUser(creator)} key={commentId}>
                      {/* {comment} */}
                      <EditableDescription
                        placeholder="Enter your comment"
                        name={commentId}
                        value={comment}
                        onChange={this.handleCommentEdition}
                        disabled={disabled || !isUser(creator)}
                      />
                    </Comment>
                  ))}
                </Creator>
              ))}
            </Day>
          ))}
        </CommentStream>
      </>
    );
  }
}

Comments.propTypes = {
  disabled: PropTypes.bool,
  submit: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      commentId: PropTypes.number,
      comment: PropTypes.string,
      dateCreated: PropTypes.string,
      creator: PropTypes.shape({
        userId: PropTypes.number,
        userName: PropTypes.string,
        initials: PropTypes.string,
        profileThumbnailPictureHash: PropTypes.string,
      }),
    }),
  ).isRequired,
  userId: PropTypes.number.isRequired,
};

Comments.defaultProps = {
  disabled: false,
};

export default connect(
  undefined,
  { updateComment },
)(Comments);
