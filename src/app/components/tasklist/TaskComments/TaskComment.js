import React, { useEffect, useRef, useState } from 'react';
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
  MoreButton,
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
  isLastComment,
  showMore,
}) => {
  const commentTextReference = useRef(null);
  const previousCommentValue = useRef(null);
  const [commentState, setCommentState] = useMentionsEditorState(
    convertToEditorState({
      rawText: comment,
      tokenizedText: tokenizedComment,
      mentions: commentMentions,
    }),
  );
  const [wholeCommentVisible, setWholeCommentVisible] = useState(false);

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
    dateLabel = moment(dateUpdated).format('MMMM D, YYYY');
  }

  const commentAuthor = `${creator.firstName} ${creator.lastName}`.trim();

  const commentDate = ` ${dateLabel} @ ${moment(dateUpdated).format('h:mm a')}`;

  const hasMore =
    commentTextReference.current?.scrollHeight >
    commentTextReference.current?.offsetHeight;

  return (
    <TaskCommentContainer isLastComment={isLastComment} showMore={showMore}>
      <TaskCommentAvatarContainer>
        <Member member={creator} size={30} />
      </TaskCommentAvatarContainer>
      <TaskCommentContent onClick={onClickComment}>
        <TaskCommentDetails>
          <b>{commentAuthor}</b>
          {commentDate}
        </TaskCommentDetails>
        <TaskCommentText
          ref={commentTextReference}
          wholeCommentVisible={wholeCommentVisible}
        >
          <MentionsEditor
            readOnly
            withEditedLabel={dateCreated !== dateUpdated}
            state={commentState}
            onChange={setCommentState}
            highlightedValues={highlightedValue?.toLowerCase().split(/\s+/)}
          />
          {hasMore && !wholeCommentVisible && (
            <MoreButton
              type="button"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                setWholeCommentVisible(true);
              }}
            >
              ... <span>more</span>
            </MoreButton>
          )}
        </TaskCommentText>
      </TaskCommentContent>
    </TaskCommentContainer>
  );
};

export default TaskComment;
