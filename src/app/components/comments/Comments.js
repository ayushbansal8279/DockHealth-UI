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
    const comment = { commentIdentifier: name, comment: value };
    editComment(task, comment);
  };

  render() {
    const { userIdentifier, comments, submit, disabled } = this.props;

    /* eslint-disable max-len */
    const sameDay = (comment1, comment2) =>
      comment1.dateCreatedObj.date() === comment2.dateCreatedObj.date();
    const sameCreator = (comment1, comment2) =>
      comment1.creator.userName === comment2.creator.userName;
    /* eslint-enable max-len */

    const isUser = creator => creator.userIdentifier === userIdentifier;

    const parsedComments = comments.map(comment => ({
      ...comment,
      dateCreatedObj: moment(comment.dateCreated),
    }));

    const days = groupWith(sameDay, parsedComments).map(dayComments => ({
      date: dayComments[0].dateCreatedObj,
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
                  key={creator.userIdentifier}
                >
                  {comments.map(
                    ({
                      comment,
                      commentIdentifier,
                      dateCreated,
                      dateUpdated,
                    }) => (
                      <Comment isOwn={isUser(creator)} key={commentIdentifier}>
                        {/* {comment} */}
                        <EditableDescription
                          placeholder="Enter your comment"
                          name={commentIdentifier}
                          value={comment}
                          onChange={this.handleCommentEdition}
                          disabled={disabled || !isUser(creator)}
                        />
                        {dateCreated != dateUpdated && (
                          <div style={{ color: '#ff8317' }}>
                            <small>(edited)</small>
                          </div>
                        )}
                      </Comment>
                    ),
                  )}
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
      commentIdentifier: PropTypes.string,
      comment: PropTypes.string,
      dateCreated: PropTypes.string,
      creator: PropTypes.shape({
        userIdentifier: PropTypes.string,
        userName: PropTypes.string,
        initials: PropTypes.string,
        profileThumbnailPictureHash: PropTypes.string,
      }),
    }),
  ).isRequired,
  userIdentifier: PropTypes.string.isRequired,
};

Comments.defaultProps = {
  disabled: false,
};

export default connect(
  undefined,
  { updateComment },
)(Comments);
