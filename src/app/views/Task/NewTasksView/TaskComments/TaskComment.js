import React from 'react';
import moment from 'moment';
import Member from 'components/members/Member';
import {
  TaskCommentAvatarContainer,
  TaskCommentContainer,
  TaskCommentDetails,
  TaskCommentText,
} from './styled';

const TaskComment = ({ creator, dateUpdated, comment }) => {
  const commentDetails = `${creator.firstName} ${creator.lastName} ${moment(
    dateUpdated,
  ).format('h:mma')}`;
  return (
    <TaskCommentContainer>
      <TaskCommentAvatarContainer>
        <Member member={creator} size={40} />
      </TaskCommentAvatarContainer>
      <div>
        <TaskCommentText>{comment}</TaskCommentText>
        <TaskCommentDetails>
          <span>{commentDetails}</span>
        </TaskCommentDetails>
      </div>
    </TaskCommentContainer>
  );
};

export default TaskComment;
