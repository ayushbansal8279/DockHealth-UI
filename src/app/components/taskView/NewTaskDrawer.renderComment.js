import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import BubbleFinishCurrentUserIcon from '../../img/bubble-finish-current-user.svg';
import BubbleFinishIcon from '../../img/bubble-finish.svg';

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

export default ({ currentUserId }) => ([date, commentsArray]) => {
  return (
    <CommentsDateContainer key={date}>
      <SmallLabel>{moment(date).format('dddd, MMMM Do')}</SmallLabel>
      {commentsArray.map(commentsFromSingleAuthor => {
        const {
          initials: commentUserInitials,
          userId: commentUserId,
          userName: commentUserName,
        } = commentsFromSingleAuthor?.[0]?.creator || {};

        const { commentId: firstCommentId, dateCreated: firstCommentDate } =
          commentsFromSingleAuthor?.[0] || {};

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
