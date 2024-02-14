import React, { FC } from 'react';
import { Box, Card } from '@mui/material';
import Divider from '@mui/material/Divider';
import palette from '@/app/styles/palette';
import { Task } from '@/app/types/Task';
import { useCommentsActionHandler } from './helpers';
import Comment from 'components/drawer-common/Comment/Comment';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from '@/app/restrictions/task-restrictions';
import { ContainerCard } from './styled';

interface CommentsInPopperProps {
  task: Task;
}

const CommentsInPopper: FC<CommentsInPopperProps> = ({ task }) => {
  const {
    currentUser,
    removeComment,
    updateComment,
    addComment,
    taskListIdentifier,
  } = useCommentsActionHandler(task);

  const orgUserRole = currentUser?.orgUserRole;
  const restrictions =
    orgUserRole && SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];
  const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  return (
    <ContainerCard>
      <Box sx={{ maxHeight: '300px', overflowY: 'scroll', paddingX: 2 }}>
        {task?.comments?.map((comment, idx) => (
          <div key={comment.commentIdentifier}>
            <Comment
              key={comment.commentIdentifier}
              comment={comment}
              currentUser={currentUser}
              onDelete={removeComment}
              onUpdate={updateComment}
              selectedTask={task}
            />
            <Divider variant="middle" />
          </div>
        ))}
      </Box>
      {restrictions?.comments !== DISABLED && (
        <Box sx={{ padding: 2, backgroundColor: palette.coolGrey4 }}>
          <AddComment autoFocus onAdd={addComment} />
        </Box>
      )}
    </ContainerCard>
  );
};

export default CommentsInPopper;
