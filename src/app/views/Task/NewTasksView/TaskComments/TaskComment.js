import React from 'react';
import moment from 'moment';
import Member from 'components/members/Member/Member';
import Highlighter from 'react-highlight-words';
import ReactHtmlParser from 'react-html-parser';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';
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
            ReactHtmlParser(
              mentionifyAndLinkifyTaskText({ members: null, value: comment }),
            )
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
