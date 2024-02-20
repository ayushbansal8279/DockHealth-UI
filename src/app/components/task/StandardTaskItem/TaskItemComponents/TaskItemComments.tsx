import React, { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { TaskDto } from '@/app/types/swagger/models/TaskDto';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';
import useBooleanWithTimeout from '@/app/hooks/use-boolean-with-timeout';
import { GridImg } from '../../styled';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Popper from '@mui/material/Popper';
import Grid from '@mui/material/Grid';
import CommentsInPopper from '../../CommentsInPopper/CommentsInPopper';

interface TaskItemCommentsProps {
  matchComments: boolean;
  comments: Array<CommentDto>;
  task: TaskDto;
}

const TaskItemComments: FC<TaskItemCommentsProps> = ({
  matchComments,
  comments,
  task,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const commentPopperOpen = Boolean(anchorEl);

  const onCommentClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container wrap="nowrap">
      <GridImg item xs={12} matched={matchComments}>
        <button type="button" onClick={onCommentClick}>
          <TaskIcon
            type="comments"
            isActive={comments?.length > 0}
            isNew={task.updatedComment}
          />
        </button>
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
