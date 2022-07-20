/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing.tsx';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { RobotoTypography } from 'styles/theme';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import TextEditor from 'components/common/TextEditor/TextEditor';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
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
  taskListIdentifier,
  disableMentions,
}) => {
  const {
    comment: commentContent,
    commentMentions,
    tokenizedComment,
    creator,
    dateCreated,
    dateUpdated,
    commentIdentifier,
  } = comment;

  const commentEditorReference = useRef();
  const [isEditing, setEditing, unsetEditing] = useBoolean(false);
  const [commentState, setCommentState] = useMentionsEditorState(
    convertToEditorState({
      rawText: commentContent,
      tokenizedText: tokenizedComment,
      mentions: commentMentions,
      handleRichText: true,
    }),
  );

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

  const onCommentEdited = useCallback(() => {
    unsetEditing();
    const updatedComment = convertFromEditorStateToOutput(commentState, true);
    const commentTokenizedText = updatedComment.tokenizedText;

    if (!commentTokenizedText) {
      return;
    }

    onUpdate({
      commentIdentifier,
      comment: commentTokenizedText,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentIdentifier, unsetEditing, onUpdate, commentState]);

  return (
    <CommentWrapper>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={34} />
      </CommentMemberContainer>
      <CommentContainer isEditing={isEditing}>
        <CommentContent>
          <CommentText>
            <TextEditor
              showToolbar
              ref={commentEditorReference}
              taskListIdentifier={taskListIdentifier}
              disableMentions={disableMentions}
              readOnly={!isEditing}
              withEditedLabel={dateCreated !== dateUpdated}
              state={commentState}
              onChange={setCommentState}
              keyBindingFn={event => {
                if (event.keyCode === 13 && event.shiftKey) {
                  return undefined;
                }
                if (event.keyCode === 13) {
                  return 'enter-command';
                }
                return undefined;
              }}
              handleKeyCommand={command => {
                if (command === 'enter-command') {
                  onCommentEdited();
                  return 'handled';
                }

                return 'not-handled';
              }}
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
                    onClick={event => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCommentEdited();
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
                    onClick={event => {
                      event.preventDefault();
                      event.stopPropagation();
                      unsetEditing();
                      setCommentState(
                        convertToEditorState({
                          rawText: commentContent,
                          tokenizedText: tokenizedComment,
                          mentions: commentMentions,
                          handleRichText: true,
                        }),
                      );
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
                        onClick={event => {
                          event.preventDefault();
                          event.stopPropagation();
                          setEditing();
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
                      onClick={event => {
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
