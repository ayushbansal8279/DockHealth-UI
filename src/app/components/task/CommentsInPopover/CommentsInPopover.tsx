import React, { FC, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import palette from '@/app/styles/palette';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '@/app/types/Task';
import { initializeCommentSectionHooks } from '@/app/components/task-drawer/CommentSection/helpers';
import Comment from './Comment';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from '@/app/restrictions/task-restrictions';
import { ContainerCard } from './styled';
import { useDispatch } from 'react-redux';
import {
  openDrawer,
  setCommentIdentifierToScroll,
} from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';

interface CommentsInPopoverProps {
  task: Task;
  onClose: () => void;
}

const CommentsInPopover: FC<CommentsInPopoverProps> = ({ task, onClose }) => {
  const { currentUser, addComment, comments } =
    initializeCommentSectionHooks(task);
  const dispatch = useDispatch();

  const orgUserRole = currentUser?.orgUserRole;
  const restrictions =
    orgUserRole && SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];
  const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  const handleClickComment = useCallback(
    (commentIdentifier: string) => {
      dispatch(setCommentIdentifierToScroll(commentIdentifier));
      dispatch(openDrawer(DrawerFieldEnum.COMMENT) as any);
      dispatch(storeAsCurrentTask(task) as any);
      onClose();
    },
    [task],
  );

  return (
    <ContainerCard>
      <Box sx={{ m: 1, textAlign: 'right' }}>
        <IconButton aria-label="close-comments" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: '300px', overflowY: 'scroll', paddingX: 2 }}>
        {comments.map((comment) => (
          <div key={comment.commentIdentifier}>
            <Comment
              key={comment.commentIdentifier}
              comment={comment}
              onClick={() =>
                handleClickComment(comment.commentIdentifier ?? '')
              }
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

export default CommentsInPopover;
