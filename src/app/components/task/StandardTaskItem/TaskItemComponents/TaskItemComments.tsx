import React, { FC, useCallback } from 'react';

import { Task } from '@/app/types/Task';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';
import { GridImg } from '../../styled';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Popper from '@mui/material/Popper';
import Grid from '@mui/material/Grid';
import CommentsInPopper from '../../CommentsInPopper/CommentsInPopper';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

interface TaskItemCommentsProps {
  matchComments: boolean;
  comments: Array<CommentDto>;
  task: Task;
  isCommentHover: boolean;
}

const TaskItemComments: FC<TaskItemCommentsProps> = ({
  matchComments,
  comments,
  task,
  isCommentHover,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const commentPopperOpen = Boolean(anchorEl);

  const onCommentClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClosePopper = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Grid container wrap="nowrap">
      <GridImg item xs={12} matched={matchComments}>
        <Tooltip placement="top" title="Add Comment">
          <button type="button" onClick={onCommentClick}>
            {(comments?.length > 0 || isCommentHover) && (
              <TaskIcon
                type="comments"
                isActive={comments?.length > 0}
                isNew={task.updatedComment}
              />
            )}
          </button>
        </Tooltip>
        <Popper
          anchorEl={anchorEl}
          open={commentPopperOpen}
          placement="bottom"
          style={{ zIndex: 2000 }}
        >
          <CommentsInPopper task={task} onClose={handleClosePopper} />
        </Popper>
      </GridImg>
    </Grid>
  );
};

export default TaskItemComments;
