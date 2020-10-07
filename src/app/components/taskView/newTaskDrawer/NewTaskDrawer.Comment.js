/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useRef } from 'react';
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
  CommentAvatarContainer,
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  EditCommentButton,
} from './NewTaskDrawer.CommentSection.Styled';

const ADMIN_USER_ROLE = 'ADMIN';

const Comment = ({
  comment,
  removeComment,
  updateComment,
  currentUser,
  isOneByOne,
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

  let dateLabel = '';

  if (moment(dateUpdated).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(dateUpdated).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(dateUpdated).format('MM/DD/YYYY');
  }

  const commentDetails = isOneByOne
    ? `${dateLabel} @ ${moment(dateUpdated).format('h:mma')}`
    : `${creator.firstName} ${creator.lastName} ${dateLabel} @ ${moment(
        dateUpdated,
      ).format('h:mma')}`;

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
      <CommentWrapper isCommentAuthor={isCommentAuthor} isOneByOne={isOneByOne}>
        <CommentContainer
          isCommentAuthor={isCommentAuthor}
          isOneByOne={isOneByOne}
        >
          <CommentDetails
            isCommentAuthor={isCommentAuthor}
            isOneByOne={isOneByOne}
          >
            {commentDetails}
          </CommentDetails>
          <CommentContent isCommentAuthor={isCommentAuthor}>
            {!isOneByOne && (
              <CommentAvatarContainer isCommentAuthor={isCommentAuthor}>
                <Member member={creator} size={42} />
              </CommentAvatarContainer>
            )}
            <CommentText
              isOneByOne={isOneByOne}
              isCommentAuthor={isCommentAuthor}
            >
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
            </CommentText>
          </CommentContent>
        </CommentContainer>
        {isCommentAuthor && (
          <>
            <Spacing horizontal={4} />
            <EditCommentButton isEditing={isEditing}>
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
      </CommentWrapper>
    </React.Fragment>
  );
};

export default Comment;
