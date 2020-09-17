import React, { useCallback, useRef } from 'react';
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
  AuthorLabelContainer,
  CommentActionLabel,
  CommentContainer,
  CommentContentContainer,
  CommentInnerContainer,
  CommentMemberContainer,
} from './NewTaskDrawer.CommentSection.Styled';

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

  const authorLabelContent = `${creator?.firstName} ${
    creator?.lastName
  } ${getFormattedCommentDate({ dateUpdated })}`;

  const isCommentAuthor =
    currentUser?.userIdentifier === creator.userIdentifier;
  const isAdmin = currentUser?.taskListUserRole === ADMIN_USER_ROLE;

  const onCommentEdited = useCallback(() => {
    const updatedComment = convertFromEditorStateToOutput(commentState);
    const commentTokenizedText = updatedComment.tokenizedText;

    if (!commentTokenizedText) {
      return;
    }

    unsetEditing();
    updateComment({
      commentIdentifier,
      comment: commentTokenizedText,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentIdentifier, unsetEditing, updateComment, commentState]);

  return (
    <React.Fragment key={commentIdentifier}>
      <CommentContainer>
        <CommentMemberContainer>
          <Member member={creator} size={40} />
        </CommentMemberContainer>
        <Spacing horizontal={3} />
        <CommentInnerContainer isEditing={isEditing}>
          <CommentContentContainer>
            <MentionsEditor
              ref={commentEditorReference}
              readOnly={!isEditing}
              withEditedLabel={dateCreated !== dateUpdated}
              state={commentState}
              onChange={setCommentState}
              onBlur={onCommentEdited}
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
                  commentEditorReference.current.blur();
                  return 'handled';
                }

                return 'not-handled';
              }}
            />
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
