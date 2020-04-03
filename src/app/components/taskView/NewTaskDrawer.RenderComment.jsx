import moment from 'moment';
import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import { mentionifyAndLinkifyTaskText } from '../../helpers/utility-functions';
import BubbleFinishIcon from '../../img/bubble-finish';
import RemoveCommentIcon from '../../img/remove-comment-icon.svg';
import palette from '../../palette';

const CommentBubble = styled.div`
  ${props => {
    const strokeColor = props.isCurrentUser
      ? palette.paleBlue
      : palette.unknownGrey4;
    const fillColor = props.isEditing ? palette.white : strokeColor;

    return `
      background-color: ${fillColor};
      box-shadow: 0 0 0 0.125rem ${strokeColor} inset;
    `;
  }};
  border-radius: 0.25rem;
  cursor: text;
  flex: 1;
  float: left;
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  position: relative;
  transition: all 0.25s ease-out;
  width: 20rem;

  &:not(:first-child) {
    margin-top: 0.25rem;
  }

  &:last-child {
    margin-bottom: 0.125rem;
  }

  &:hover {
    background-color: ${palette.white};
    box-shadow: 0 0 0 0.125rem
      ${props =>
        props.isCurrentUser ? palette.paleBlue : palette.unknownGrey4}
      inset;
  }

  &:hover svg {
    fill: ${palette.white};
    stroke: ${props =>
      props.isCurrentUser ? palette.paleBlue : palette.unknownGrey4};
  }
`;

const CommentBubbleText = styled.div`
  min-height: 1em;
  outline: none;
  word-break: break-word;
`;

const BubbleFinish = styled.div`
  bottom: -1px;
  pointer-events: none;
  position: absolute;
  user-select: none;

  ${props =>
    props.isCurrentUser ? 'right: -3px; transform: scaleX(-1);' : 'left: -3px;'}

  & svg {
    transition: all 0.25s ease-out;
    ${props => {
      const strokeColor = props.isCurrentUser
        ? palette.paleBlue
        : palette.unknownGrey4;
      const fillColor = props.isEditing ? palette.white : strokeColor;

      return `fill: ${fillColor}; stroke: ${strokeColor};`;
    }}
  }
`;

const RemoveCommentButton = styled.img`
  align-items: center;
  display: flex;
  cursor: pointer;
  float: right;
  height: 1rem;
  margin-left: 0.25rem;
  margin-top: 0.0625rem;
  justify-content: center;
  transition: all 0.25s ease-out;
  width: 1rem;
`;

const CommentsDateContainer = styled.div`
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  width: 100%;

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }
`;

const CommentGroupContainer = styled.div`
  padding: 0 2rem;
  width: 95%;

  &:not(:first-of-type) {
    margin-top: 1rem;
  }

  &:first-of-type {
    margin-top: 0.5rem;
  }

  ${props =>
    props.isCurrentUser &&
    `
    align-self: flex-end;
  `}
`;

const InitialsRelativeContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const InitialsContainer = styled.span`
  background-color: ${palette.unknownGrey3};
  border-radius: 0.125rem;
  top: -0.375rem;
  color: ${palette.white};
  display: flex;
  font-size: 0.5625rem;
  left: 0.25rem;
  justify-content: center;
  padding: 0.125rem;
  position: absolute;
  width: 1.1875rem;
`;

const SmallLabel = styled.label`
  color: ${palette.unknownGrey3};
  font-size: 0.625rem;
`;

class SingleComment extends Component {
  state = {
    commentBubbleTextFocused: false,
    newComment: '',
  };

  commentBubbleTextRef = React.createRef();

  componentDidUpdate(_previousProps, previousState) {
    const { commentBubbleTextFocused } = this.state;
    if (
      commentBubbleTextFocused !== previousState.commentBubbleTextFocused &&
      commentBubbleTextFocused
    ) {
      // eslint-disable-next-line no-unused-expressions
      this.commentBubbleTextRef.current?.focus();
    }
  }

  setCommentBubbleTextFocused = () => {
    this.setState({
      commentBubbleTextFocused: true,
    });
  };

  unsetCommentBubbleTextFocused = () => {
    this.setState({
      commentBubbleTextFocused: false,
    });
  };

  saveComment = () => {
    const { updateComment, commentIdentifier } = this.props;

    updateComment({
      comment: this.commentBubbleTextRef.current?.textContent,
      commentIdentifier,
    });
  };

  onCommentBubbleBlur = event => {
    const { comment, members } = this.props;
    const { newComment: previousNewComment } = this.state;

    event.preventDefault();
    event.stopPropagation();

    const newComment = this.commentBubbleTextRef.current?.textContent;

    if (newComment) {
      this.unsetCommentBubbleTextFocused();
      this.saveComment();
      this.setState({
        newComment,
      });
      this.commentBubbleTextRef.current.innerHTML = mentionifyAndLinkifyTaskText(
        { members, value: newComment },
      );
    } else {
      toggleAlert('Empty comment is not allowed, please try again', 'error');
      const oldCommentContent = previousNewComment || comment;
      this.commentBubbleTextRef.current.textContent = oldCommentContent;
    }
  };

  onRemoveButtonClick = event => {
    event.preventDefault();
    event.stopPropagation();
    const { commentIdentifier, task, deleteComment } = this.props;

    deleteComment(task, {
      commentIdentifier,
    });
  };

  render() {
    const { commentBubbleTextFocused } = this.state;
    const {
      comment,
      isLastBubble,
      isCurrentUser,
      members,
      dateCreated,
      dateUpdated,
    } = this.props;

    return (
      <CommentBubble
        isEditing={commentBubbleTextFocused}
        isCurrentUser={isCurrentUser}
      >
        {isCurrentUser && (
          <RemoveCommentButton
            alt="Remove comment"
            src={RemoveCommentIcon}
            onClick={this.onRemoveButtonClick}
          />
        )}
        <CommentBubbleText
          ref={this.commentBubbleTextRef}
          onClick={
            commentBubbleTextFocused
              ? undefined
              : this.setCommentBubbleTextFocused
          }
          contentEditable={commentBubbleTextFocused && isCurrentUser}
          onBlur={this.onCommentBubbleBlur}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.onCommentBubbleBlur(event);
            }
          }}
        >
          {ReactHtmlParser(
            mentionifyAndLinkifyTaskText({ members, value: comment }),
          )}
        </CommentBubbleText>
        {dateCreated !== dateUpdated && (
          <div style={{ color: palette.coolGrey2 }}>
            <small>(edited)</small>
          </div>
        )}
        {isLastBubble && (
          <BubbleFinish
            isEditing={commentBubbleTextFocused}
            isCurrentUser={isCurrentUser}
          >
            <BubbleFinishIcon />
          </BubbleFinish>
        )}
      </CommentBubble>
    );
  }
}

const renderSingleComment = ({
  isCurrentUser,
  updateComment,
  task,
  members,
  deleteComment,
}) => (
  { comment, commentIdentifier, dateCreated, dateUpdated },
  commentIndex,
  commentsFromSingleAuthor,
) => {
  const isLastBubble = commentsFromSingleAuthor.length - 1 === commentIndex;

  const singleCommentProps = {
    isLastBubble,
    isCurrentUser,
    updateComment,
    comment,
    commentIdentifier,
    dateCreated,
    dateUpdated,
    task,
    members,
    deleteComment,
  };

  return <SingleComment key={commentIdentifier} {...singleCommentProps} />;
};

export default ({
  currentUserId,
  updateComment,
  deleteComment,
  task,
  members,
}) => ([date, commentsArray]) => {
  return (
    <CommentsDateContainer key={date}>
      <SmallLabel>{moment(date).format('dddd, MMMM Do')}</SmallLabel>
      {commentsArray.map(commentsFromSingleAuthor => {
        const {
          initials: commentUserInitials,
          userIdentifier: commentUserId,
          userName: commentUserName,
        } = commentsFromSingleAuthor?.[0]?.creator || {};

        const {
          commentIdentifier: firstCommentId,
          dateCreated: firstCommentDate,
        } = commentsFromSingleAuthor?.[0] || {};

        const formattedCreatedDate = firstCommentDate
          ? moment(firstCommentDate).format('h:mm a')
          : '';

        const isCurrentUser = currentUserId === commentUserId;

        return (
          <>
            <CommentGroupContainer
              isCurrentUser={isCurrentUser}
              key={`creator-${commentUserId}-${firstCommentId}`}
            >
              <SmallLabel>
                {`${commentUserName} ${formattedCreatedDate}`.trim()}
              </SmallLabel>
              {commentsFromSingleAuthor.map(
                renderSingleComment({
                  isCurrentUser,
                  updateComment,
                  task,
                  members,
                  deleteComment,
                }),
              )}
            </CommentGroupContainer>
            {!isCurrentUser && (
              <InitialsRelativeContainer
                key={`other-${commentUserId}-${firstCommentId}`}
              >
                <InitialsContainer>{commentUserInitials}</InitialsContainer>
              </InitialsRelativeContainer>
            )}
          </>
        );
      })}
    </CommentsDateContainer>
  );
};
