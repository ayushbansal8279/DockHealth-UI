/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { RobotoTypography } from 'styles/theme';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import {
  CommentActionLabel,
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  CommentMemberContainer,
  CommentActionsSection,
  EditCommentButton,
} from './styled';

const Comment = ({ comment, onDelete, onUpdate, currentUser }) => {
  const {
    comment: commentContent,
    creator,
    // dateCreated,
    dateUpdated,
    commentIdentifier,
  } = comment;

  const commentEditorReference = useRef();
  const [isEditing, setEditing, unsetEditing] = useBoolean(false);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);

  useEffect(() => {
    if (isEditing) {
      // eslint-disable-next-line no-unused-expressions
      commentEditorReference?.current?.focus();
    }
  }, [isEditing, commentEditorReference]);

  const isCommentAuthor =
    currentUser?.userIdentifier === creator.userIdentifier;

  let dateLabel = '';

  if (moment(dateUpdated).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(dateUpdated).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(dateUpdated).format('MM/DD/YYYY');
  }

  const commentDetails = `${creator.firstName} ${
    creator.lastName
  }, ${dateLabel} @ ${moment(dateUpdated).format('h:mma')}`;

  const [currentValue, setCurrentValue] = useState(commentContent);

  const handleTextEditorChange = (value) => {
    setCurrentValue(value);
  };

  const handleSave = () => {
    onUpdate({
      commentIdentifier,
      comment: currentValue,
    });
    unsetEditing();
  };

  return (
    <CommentWrapper>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={34} />
      </CommentMemberContainer>
      <CommentContainer isEditing={isEditing}>
        <CommentContent>
          <CommentText>
            <RichTextEditor
              height={60}
              readonly={!isEditing}
              showToolbar={isEditing}
              focus={isFocused}
              value={commentContent}
              onChange={handleTextEditorChange}
              initOnClick
              showCharCount
            />
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
        <CommentActionsSection>
          {isEditing ? (
            <>
              <Spacing horizontal={4} />
              <EditCommentButton>
                <RobotoTypography condensed variant="h5" color="inherit">
                  <CommentActionLabel
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSave();
                      unsetFocused();
                    }}
                  >
                    Save
                  </CommentActionLabel>
                </RobotoTypography>
              </EditCommentButton>
              <Spacing horizontal={3} />
              <EditCommentButton>
                <RobotoTypography condensed variant="h5" color="inherit">
                  <CommentActionLabel
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      unsetEditing();
                    }}
                  >
                    Cancel
                  </CommentActionLabel>
                </RobotoTypography>
              </EditCommentButton>
            </>
          ) : (
            <>
              {isCommentAuthor && (
                <>
                  <Spacing horizontal={4} />
                  <EditCommentButton>
                    <RobotoTypography condensed variant="h5" color="inherit">
                      <CommentActionLabel
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setEditing();
                          setFocused();
                        }}
                      >
                        Edit
                      </CommentActionLabel>
                    </RobotoTypography>
                  </EditCommentButton>
                </>
              )}
              {isCommentAuthor && (
                <>
                  <Spacing horizontal={3} />
                  <RobotoTypography condensed variant="h5" color="inherit">
                    <CommentActionLabel
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onDelete(comment);
                      }}
                    >
                      Delete
                    </CommentActionLabel>
                  </RobotoTypography>
                </>
              )}
            </>
          )}
        </CommentActionsSection>
      </CommentContainer>
    </CommentWrapper>
  );
};

export default Comment;
