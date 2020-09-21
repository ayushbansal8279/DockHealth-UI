import React from 'react';
import moment from 'moment';
import Member from 'components/members/Member/Member';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { convertToEditorState } from 'components/common/MentionsEditor/helpers';
import Highlighter from 'react-highlight-words';
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
  return (
    <TaskCommentContainer>
      <TaskCommentAvatarContainer>
        <Member member={creator} size={38} />
      </TaskCommentAvatarContainer>
      <div>
        <TaskCommentText>
          {highlightedValue ? (
            <Highlighter
              highlightClassName="list-highlight"
              searchWords={highlightedValue?.toLowerCase().split(/\s+/)}
              autoEscape
              textToHighlight={comment}
            />
          ) : (
            <MentionsEditor
              readOnly
              withEditedLabel={dateCreated !== dateUpdated}
              initialState={convertToEditorState({
                rawText: comment,
                tokenizedText: tokenizedComment,
                mentions: commentMentions,
              })}
            />
          )}
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
