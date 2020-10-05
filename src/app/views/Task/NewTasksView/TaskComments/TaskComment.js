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
  TaskCommentDetails,
  TaskCommentText,
  SmallText,
} from './styled';

const TaskComment = ({
  creator,
  dateUpdated,
  comment,
  tokenizedComment,
  commentMentions,
  dateCreated,
  highlightedValue,
}) => {
  const commentDetails = `${creator.firstName} ${creator.lastName} ${moment(
    dateUpdated,
  ).format('h:mma')}`;

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

  return (
    <TaskCommentContainer>
      <TaskCommentAvatarContainer>
        <Member member={creator} size={38} />
      </TaskCommentAvatarContainer>
      <div>
        <TaskCommentText>
          <MentionsEditor
            readOnly
            withEditedLabel={dateCreated !== dateUpdated}
            state={commentState}
            onChange={setCommentState}
            highlightedValues={highlightedValue?.toLowerCase().split(/\s+/)}
          />
        </TaskCommentText>
        <TaskCommentDetails>
          <span>{commentDetails}</span>
          {dateCreated !== dateUpdated && <SmallText> (Edited)</SmallText>}
        </TaskCommentDetails>
      </div>
    </TaskCommentContainer>
  );
};

export default TaskComment;
