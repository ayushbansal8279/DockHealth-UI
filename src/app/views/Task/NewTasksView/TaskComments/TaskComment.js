import React from 'react';
import moment from 'moment';
import Member from 'components/members/Member';
import {
  TaskCommentAvatarContainer,
  TaskCommentContainer,
  TaskCommentDetails,
  TaskCommentText,
  SmallText,
} from './styled';

const TaskComment = ({ creator, dateUpdated, comment, dateCreated }) => {
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
          {comment}{' '}
          {dateCreated !== dateUpdated && <SmallText> (Edited)</SmallText>}
        </TaskCommentText>
        <TaskCommentDetails>
          <span>{commentDetails}</span>
        </TaskCommentDetails>
      </div>
    </TaskCommentContainer>
  );
};

export default TaskComment;
