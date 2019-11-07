import moment from 'moment';
import groupBy from 'ramda/es/groupBy';
import groupWith from 'ramda/es/groupWith';
import mapObjIndexed from 'ramda/es/mapObjIndexed';
import sortBy from 'ramda/es/sortBy';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import BubbleFinishCurrentUserIcon from '../../img/bubble-finish-current-user.svg';
import BubbleFinishIcon from '../../img/bubble-finish.svg';
import { addTaskComment } from '../../actions/task-actions';
import CubesLoader from '../common/CubesLoader';

const CommentSectionLabel = styled.div`
  align-items: center;
  display: flex;
  color: #2e3a43;
  cursor: text;
  flex: 1;
  font-size: 0.875rem;
  height: 2.25rem;
  padding: 0 1.5rem;
`;

const CommentSectionInputField = styled.input`
  border: 0;
  color: #2e3a43;
  flex: 1;
  font-size: 0.875rem;
  height: 100%;
  outline: none;
  padding: 0 1.5rem;

  &::placeholder {
    color: #dedee2;
  }
`;

const CommentsDivider = styled.div`
  background-color: #ddf2f7;
  height: 2px;
  width: 100%;
`;

const CommentsContainer = styled.div`
  align-content: flex-start;
  display: flex;
  flex-flow: column wrap;
  padding: 3.625rem;
  width: 100%;
`;

const CommentBubble = styled.div`
  background-color: #ededf0;
  border-radius: 0.25rem;
  flex: 1;
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  position: relative;

  &:not(:first-child) {
    margin-top: 0.25rem;
  }
`;

const BubbleFinish = styled.img`
  bottom: -2.1758px;
  position: absolute;

  ${props =>
    props.isCurrentUser
      ? `
    right: -3.649px;
    transform: scaleX(-1);
  `
      : `
    left: -3.649px;
  `}
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
  width: 70%;

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

    ${CommentBubble} {
      background-color: #d4f3ff;
    }
  `}
`;

const InitialsRelativeContainer = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const InitialsContainer = styled.span`
  background-color: #aab8c3;
  border-radius: 0.125rem;
  top: -0.375rem;
  color: #fff;
  display: flex;
  font-size: 0.5625rem;
  left: 0.25rem;
  justify-content: center;
  padding: 0.125rem;
  position: absolute;
  width: 1.1875rem;
`;

const SmallLabel = styled.label`
  color: #aab8c3;
  font-size: 0.625rem;
`;

const CommentSectionInputFieldContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 2.25rem;
  position: relative;
  width: 100%;
`;

const CubesLoaderContainer = styled.div`
  height: 1rem;
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3.125rem;
`;

const AddCommentButtonContainer = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 2rem;
  justify-content: center;
  line-height: 1;
  width: 2.125rem;
`;

const getGroupedComments = ({ comments }) => {
  const sortedComments = sortBy(
    comment => moment(comment.dateCreated).unix(),
    comments,
  );

  const datedComments = groupBy(
    comment => moment(comment.dateCreated).format('YYYY-MM-DD'),
    sortedComments,
  );

  const groupedComments = mapObjIndexed(
    groupWith(
      (comment1, comment2) =>
        comment1.creator.userId === comment2.creator.userId,
    ),
    datedComments,
  );

  return groupedComments;
};

const renderComment = ({ currentUserId }) => ([date, commentsArray]) => {
  return (
    <CommentsDateContainer key={date}>
      <SmallLabel>{moment(date).format('dddd, MMMM Do')}</SmallLabel>
      {commentsArray.map(commentsFromSingleAuthor => {
        const commentUserId = commentsFromSingleAuthor?.[0]?.creator?.userId;
        const commentUserName =
          commentsFromSingleAuthor?.[0]?.creator?.userName;
        const commentUserInitials =
          commentsFromSingleAuthor?.[0]?.creator?.initials;
        const firstCommentId = commentsFromSingleAuthor?.[0]?.commentId;

        const isCurrentUser = currentUserId === commentUserId;

        return (
          <>
            <CommentGroupContainer
              isCurrentUser={isCurrentUser}
              key={`creator-${commentUserId}-${firstCommentId}`}
            >
              <SmallLabel>{commentUserName}</SmallLabel>
              {commentsFromSingleAuthor.map(
                ({ comment, commentId }, commentIndex) => {
                  const lastBubble =
                    commentsFromSingleAuthor.length - 1 === commentIndex;
                  return (
                    <CommentBubble key={commentId}>
                      <span>{comment}</span>

                      {lastBubble && (
                        <BubbleFinish
                          isCurrentUser={isCurrentUser}
                          src={
                            isCurrentUser
                              ? BubbleFinishCurrentUserIcon
                              : BubbleFinishIcon
                          }
                          alt="bubble"
                        />
                      )}
                    </CommentBubble>
                  );
                },
              )}
            </CommentGroupContainer>
            {!isCurrentUser && (
              <InitialsRelativeContainer>
                <InitialsContainer>{commentUserInitials}</InitialsContainer>
              </InitialsRelativeContainer>
            )}
          </>
        );
      })}
    </CommentsDateContainer>
  );
};

export default ({ task }) => {
  const currentUserId = useSelector(
    store => store.userState.userProfile.userId,
  );
  const dispatch = useDispatch();
  const [addingComment, , , toggleAddingComment] = useBoolean(false);
  const [addedComments, setAddedComments] = useState([]);
  const [
    isPublishingComment,
    setPublishingComment,
    unsetPublishingComment,
  ] = useBoolean(false);
  const [commentContent, setCommentContent] = useState('');

  const comments = (task?.comments ?? []).concat(addedComments);
  const commentsEmpty = comments.length === 0;

  const groupedComments = getGroupedComments({ comments });

  const publishComment = async () => {
    if (commentContent.trim().length === 0) {
      return;
    }

    try {
      setPublishingComment();

      const { data } = await addTaskComment(task, {
        comment: commentContent.trim(),
      })(dispatch);

      setCommentContent('');
      toggleAlert('Comment added successfully', 'success');

      setAddedComments([...addedComments, data]);
    } catch {
      toggleAlert('Error adding comment, please try again later', 'error');
    } finally {
      unsetPublishingComment();
    }
  };

  return (
    <>
      {addingComment ? (
        <CommentSectionInputFieldContainer>
          <CommentSectionInputField
            autoFocus
            onBlur={toggleAddingComment}
            onChange={event => {
              setCommentContent(event.target?.value);
            }}
            onKeyPress={event => {
              if (event.key === 'Enter' && !isPublishingComment) {
                event.preventDefault();
                event.stopPropagation();

                publishComment();
              }
            }}
            placeholder="+ add a comment"
            value={commentContent}
          />
          <AddCommentButtonContainer onClick={publishComment}>
            +
          </AddCommentButtonContainer>
          {isPublishingComment && (
            <CubesLoaderContainer>
              <CubesLoader size={16} />
            </CubesLoaderContainer>
          )}
        </CommentSectionInputFieldContainer>
      ) : (
        <CommentSectionLabel onClick={toggleAddingComment}>
          + add a comment
        </CommentSectionLabel>
      )}
      {!commentsEmpty && (
        <>
          <CommentsDivider />
          <CommentsContainer>
            {Object.entries(groupedComments).map(
              renderComment({ currentUserId }),
            )}
          </CommentsContainer>
        </>
      )}
    </>
  );
};
