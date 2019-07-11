import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import groupWith from 'ramda/src/groupWith';
import moment from 'moment';
import SubmitComment from './SubmitComment';
import Day from './Day';
import Creator from './Creator';
import Comment from './Comment';
import EditableDescription from '../EditableDescription';
import { updateComment } from '../../../actions/task-actions';

const CommentStream = styled.div`
  margin-top: 12px;
  max-height: 365px;
  overflow: auto;
  white-space: pre-line;
`;

export class Comments extends React.PureComponent {
  handleCommentEdition = (value, name) => {
    const { task, updateComment: editComment } = this.props;
    const comment = { commentId: name, comment: value };
    editComment(task, comment);
  }

  render() {
    const { userId, comments, submit, disabled } = this.props;

    const sameDay = (comment1, comment2) => comment1.dateCreated.date()
      === comment2.dateCreated.date();
    const sameCreator = (comment1, comment2) => comment1.creator.userName
      === comment2.creator.userName;

    const isUser = creator => creator.userId === userId;

    const parsedComments = comments.map(c => ({ ...c, dateCreated: moment(c.dateCreated) }));
    const days = groupWith(sameDay, parsedComments)
      .map(dayComments => ({
        date: dayComments[0].dateCreated,
        creators: groupWith(sameCreator, dayComments)
          .map(creatorComments => ({
            creator: creatorComments[0].creator,
            comments: creatorComments,
          })),
      }));

    return (
      <React.Fragment>
        <SubmitComment submit={submit} disabled={disabled} />
        <CommentStream>
          {days.map(({ date, creators }) => (
            <Day date={date} key={date.format()}>
              {creators.map(({ creator, comments }) => ( // eslint-disable-line no-shadow
                <Creator {...creator} isOwn={isUser(creator)} key={creator.userId}>
                  {comments.map(({ comment, commentId }) => (
                    <Comment isOwn={isUser(creator)} key={commentId}>
                      {/* {comment} */}
                      <EditableDescription
                        placeholder="Enter your comment"
                        name={commentId}
                        value={comment}
                        onChange={this.handleCommentEdition}
                        disabled={disabled}
                      />
                    </Comment>))
                  }
                </Creator>
              ))}
            </Day>))}
        </CommentStream>
      </React.Fragment>
    );
  }
}

Comments.propTypes = {
  disabled: PropTypes.bool,
  submit: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    commentId: PropTypes.number,
    comment: PropTypes.string,
    dateCreated: PropTypes.string,
    creator: PropTypes.shape({
      userId: PropTypes.number,
      userName: PropTypes.string,
      initials: PropTypes.string,
      profileThumbnailPictureHash: PropTypes.string,
    }),
  })).isRequired,
  userId: PropTypes.number.isRequired,
};

Comments.defaultProps = {
  disabled: false,
};

export default connect(undefined, { updateComment })(Comments);
