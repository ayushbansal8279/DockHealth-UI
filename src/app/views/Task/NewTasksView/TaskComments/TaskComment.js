import React, { useEffect, useRef } from 'react';
import { EditorState } from 'draft-js';
import moment from 'moment';
import Member from 'components/members/Member/Member';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/MentionsEditor/create-mention-entities';
import {
  TaskCommentAvatarContainer,
  TaskCommentContainer,
  TaskCommentText,
  TaskCommentDetails,
  TaskCommentContent,
} from './styled';

const TaskComment = ({
  creator,
  dateUpdated,
  comment,
  tokenizedComment,
  commentMentions,
  dateCreated,
  highlightedValue,
  isOneByOne,
  onClickComment,
}) => {
  const previousCommentValue = useRef(null);
  const [commentState, setCommentState] = useMentionsEditorState(
    convertToEditorState({
      rawText: comment,
      tokenizedText: tokenizedComment,
      mentions: commentMentions,
    }),
  );

  useEffect(() => {
    if (previousCommentValue.current !== null) {
      const newContent = createMentionEntities(
        tokenizedComment,
        comment,
        commentMentions,
      );
      setCommentState(EditorState.push(commentState, newContent));
    }
    previousCommentValue.current = comment;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  const commentDetails = isOneByOne
    ? moment(dateUpdated).format('h:mma')
    : `${creator.firstName} ${creator.lastName} ${moment(dateUpdated).format(
        'h:mma',
      )}`;

  const isCurrentUser =
    sessionStorage.getItem('userIdentifier') === creator?.userIdentifier;
  return (
    <TaskCommentContainer isCurrentUser={isCurrentUser} isOneByOne={isOneByOne}>
      <TaskCommentDetails isCurrentUser={isCurrentUser}>
        {commentDetails} here
      </TaskCommentDetails>
      <TaskCommentContent
        onClick={onClickComment}
        isCurrentUser={isCurrentUser}
      >
        {!isOneByOne && (
          <TaskCommentAvatarContainer isCurrentUser={isCurrentUser}>
            <Member member={creator} size={42} />
          </TaskCommentAvatarContainer>
        )}
        <TaskCommentText isOneByOne={isOneByOne} isCurrentUser={isCurrentUser}>
          <MentionsEditor
            readOnly
            withEditedLabel={dateCreated !== dateUpdated}
            state={commentState}
            onChange={setCommentState}
            highlightedValues={highlightedValue?.toLowerCase().split(/\s+/)}
          />
        </TaskCommentText>
      </TaskCommentContent>
    </TaskCommentContainer>
  );
};

export default TaskComment;
