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

  return (
    <TaskCommentContainer>
      <TaskCommentAvatarContainer>
        <Member member={creator} size={40} />
      </TaskCommentAvatarContainer>
      <TaskCommentContent onClick={onClickComment}>
        <TaskCommentText>
          <MentionsEditor
            readOnly
            withEditedLabel={dateCreated !== dateUpdated}
            state={commentState}
            onChange={setCommentState}
            highlightedValues={highlightedValue?.toLowerCase().split(/\s+/)}
          />
        </TaskCommentText>
        <TaskCommentDetails>{commentDetails}</TaskCommentDetails>
      </TaskCommentContent>
    </TaskCommentContainer>
  );
};

export default TaskComment;
