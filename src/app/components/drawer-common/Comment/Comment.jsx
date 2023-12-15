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

const Comment = ({
  comment,
  onDelete,
  onUpdate,
  currentUser,
  selectedTask,
}) => {
  const {
    comment: commentContent,
    creator,
    // dateCreated,
    dateUpdated,
    commentIdentifier,
  } = comment;

  const commentEditorReference = useRef();
  const [isEdited, setIsEdited] = useState(false);
  const [isValueReset, setValueReset] = useState(false);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);

  useEffect(() => {
    if (isEdited) {
      // eslint-disable-next-line no-unused-expressions
      commentEditorReference?.current?.focus();
    }
  }, [isEdited, commentEditorReference]);

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

  const commentDetails = `${creator?.firstName} ${creator?.lastName}${
    creator?.credentials ? `, ${creator?.credentials}` : ''
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
    setIsEdited(false);
    setValueReset(true);
  };

  return (
    <CommentWrapper>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={35} />
      </CommentMemberContainer>
      <CommentContainer isEditing={isEdited}>
        <CommentContent>
          <CommentText>
            <RichTextEditor
              height={60}
              readonly={!isEdited}
              showToolbar={isEdited}
              focus={isFocused}
              value={currentValue}
              reset={isValueReset}
              onChange={handleTextEditorChange}
              initOnClick
              showCharCount
              taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
              mentions={selectedTask?.taskMentions}
            />
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
        <CommentActionsSection>
          {isEdited ? (
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
                      setIsEdited(false);
                      setValueReset(true);
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
                          setIsEdited(true);
                          setValueReset(false);
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
