import React, { useState, useRef, useEffect, useCallback } from 'react';

import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import { RobotoTypography } from 'styles/theme';

import { useMount } from 'react-use';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import ReactHtmlParser from 'react-html-parser';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
import {
  AuthorLabelContainer,
  CommentActionLabel,
  CommentContainer,
  CommentContentContainer,
  CommentContentField,
  CommentInnerContainer,
  CommentMemberContainer,
} from './NewTaskDrawer.CommentSection.Styled';

const sanitizeCommentValue = ({ comment }) => comment.replace(/<br.*>$/, '');

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
    dateCreated,
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
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(commentContentFieldReference.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      // eslint-disable-next-line no-unused-expressions
      commentContentFieldReference.current?.focus();
    }
  }, [isEditing]);

  useMount(() => {
    setCommentValue(commentContent);
  });

  const onCommentEdited = useCallback(
    event => {
      const sanitizedCommentValue = sanitizeCommentValue({
        comment: event.target.textContent,
      });

      if (sanitizedCommentValue === '') {
        return false;
      }

      unsetEditing();

      if (commentValue !== sanitizedCommentValue) {
        updateComment({
          commentIdentifier,
          comment: sanitizedCommentValue,
        });
        setCommentValue(sanitizedCommentValue);
      }
      return true;
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
                    event.preventDefault();
                    onCommentEdited(event);
                  }
                }}
              >
                {ReactHtmlParser(
                  mentionifyAndLinkifyTaskText({
                    members: null,
                    value: commentValue,
                  }),
                )}
                {!isEditing && dateCreated !== dateUpdated && (
                  <span
                    style={{
                      color: palette.coolGrey2,
                      paddingLeft: '10px',
                      fontSize: '.75rem',
                    }}
                  >
                    (Edited)
                  </span>
                )}
              </CommentContentField>
            </RobotoTypography>
            <AuthorLabelContainer>
              <RobotoTypography condensed variant="h4" color="inherit">
                {authorLabelContent}
              </RobotoTypography>
            </AuthorLabelContainer>
          </CommentContentContainer>
          {isCommentAuthor && !isEditing && (
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
      <Spacing vertical={1} />
    </React.Fragment>
  );
};

export default Comment;
