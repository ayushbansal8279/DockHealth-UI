import escape from 'lodash.escape';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member';
import { RobotoTypography } from 'styles/theme';

import { useMount } from 'react-use';
import useBoolean from 'hooks/useBoolean';
import {
  AuthorLabelContainer,
  CommentActionLabel,
  CommentContainer,
  CommentContentContainer,
  CommentContentField,
  CommentInnerContainer,
  CommentMemberContainer,
} from './NewTaskDrawer.CommentSection.Styled';

const sanitizeCommentValue = ({ comment }) =>
  escape(comment.replace(/<br.*>$/, ''));

const ADMIN_USER_ROLE = 'ADMIN';

const Comment = ({
  comment,
  removeComment,
  updateComment,
  currentUser,
  getFormattedCommentDate,
}) => {
  const {
    comment: commentContent,
    creator,
    dateUpdated,
    commentIdentifier,
  } = comment;

  const commentContentFieldReference = useRef(null);
  const [isEditing, setEditing, unsetEditing] = useBoolean(false);
  const [commentValue, setCommentValue] = useState('');

  const authorLabelContent = `${creator?.firstName} ${
    creator?.lastName
  } ${getFormattedCommentDate({ dateUpdated })}`;

  const isCommentAuthor =
    currentUser?.userIdentifier === creator.userIdentifier;
  const isAdmin = currentUser?.taskListUserRole === ADMIN_USER_ROLE;

  useEffect(() => {
    if (isEditing) {
      // eslint-disable-next-line no-unused-expressions
      commentContentFieldReference.current?.focus();
    }
  }, [isEditing]);

  useMount(() => {
    setCommentValue(commentContent);
  });

  const onCommentEdited = useCallback(
    event => {
      unsetEditing();
      const sanitizedCommentValue = sanitizeCommentValue({
        comment: event.target.textContent,
      });

      if (commentValue !== sanitizedCommentValue) {
        updateComment({
          commentIdentifier,
          comment: sanitizedCommentValue,
        });
        setCommentValue(sanitizedCommentValue);
      }
    },
    [commentIdentifier, commentValue, unsetEditing, updateComment],
  );

  return (
    <React.Fragment key={commentIdentifier}>
      <CommentContainer>
        <CommentMemberContainer>
          <Member member={creator} size={40} />
        </CommentMemberContainer>
        <Spacing horizontal={3} />
        <CommentInnerContainer isEditing={isEditing}>
          <CommentContentContainer>
            <RobotoTypography condensed variant="h4" color="inherit">
              <CommentContentField
                ref={commentContentFieldReference}
                contentEditable={isEditing}
                onBlur={onCommentEdited}
                onKeyDown={event => {
                  if (isEditing && event.key === 'Enter') {
                    onCommentEdited(event);
                  }
                }}
              >
                {commentValue}
              </CommentContentField>
            </RobotoTypography>
            <AuthorLabelContainer>
              <RobotoTypography condensed variant="h4" color="inherit">
                {authorLabelContent}
              </RobotoTypography>
            </AuthorLabelContainer>
          </CommentContentContainer>
          {isCommentAuthor && (
            <>
              <Spacing horizontal={3} />
              <RobotoTypography condensed variant="h5" color="inherit">
                <CommentActionLabel
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    setEditing();
                  }}
                >
                  Edit
                </CommentActionLabel>
              </RobotoTypography>
            </>
          )}
          {(isCommentAuthor || isAdmin) && (
            <>
              <Spacing horizontal={3} />
              <RobotoTypography condensed variant="h5" color="inherit">
                <CommentActionLabel
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    removeComment(comment);
                  }}
                >
                  Delete
                </CommentActionLabel>
              </RobotoTypography>
            </>
          )}
        </CommentInnerContainer>
      </CommentContainer>
      <Spacing vertical={3} />
    </React.Fragment>
  );
};

export default Comment;
