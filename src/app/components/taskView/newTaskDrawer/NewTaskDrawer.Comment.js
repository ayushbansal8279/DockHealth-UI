/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useRef, useEffect } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import Member from 'components/members/Member/Member';
import { RobotoTypography } from 'styles/theme';
import useBoolean from 'hooks/useBoolean';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
} from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
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
} from './NewTaskDrawer.CommentSection.Styled';

const ADMIN_USER_ROLE = 'ADMIN';

const Comment = ({
  comment,
  removeComment,
  updateComment,
  currentUser,
  taskListIdentifier,
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

  const isAdmin = currentUser?.taskListUserRole === ADMIN_USER_ROLE;

  const onCommentEdited = useCallback(() => {
    unsetEditing();
    const updatedComment = convertFromEditorStateToOutput(commentState);
    const commentTokenizedText = updatedComment.tokenizedText;

    if (!commentTokenizedText) {
      return;
    }

    updateComment({
      commentIdentifier,
      comment: commentTokenizedText,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentIdentifier, unsetEditing, updateComment, commentState]);

  return (
    <React.Fragment key={commentIdentifier}>
      <CommentWrapper>
        <CommentMemberContainer>
          <Member member={creator} size={40} />
        </CommentMemberContainer>
        <CommentContainer isEditing={isEditing}>
          <CommentContent>
            <CommentText>
              <MentionsEditor
                ref={commentEditorReference}
                taskListIdentifier={taskListIdentifier}
                isDrawerEditor
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
              </>
            )}
          </CommentActionsSection>
        </CommentContainer>
      </CommentWrapper>
    </React.Fragment>
  );
};

export default Comment;
