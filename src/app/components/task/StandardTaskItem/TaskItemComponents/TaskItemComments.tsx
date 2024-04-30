import React, { FC, useCallback } from 'react';

import { Task } from '@/app/types/Task';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';
import { GridImg } from '../../styled';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Grid from '@mui/material/Grid';
import CommentsInPopover from '../../CommentsInPopover/CommentsInPopover';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { Popover } from '@mui/material';

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
  const commentPopoverOpen = Boolean(anchorEl);
  const hasComments = comments?.length > 0;
  const tooltipTitle = hasComments ? 'Show Comments' : 'Add Comment';

  const onCommentClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseComments = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <Grid container wrap="nowrap">
      <GridImg item xs={12} matched={matchComments}>
        <Tooltip placement="top" title={tooltipTitle}>
          <button type="button" onClick={onCommentClick}>
            {(hasComments || isCommentHover) && (
              <TaskIcon
                type="comments"
                isActive={hasComments}
                isNew={task.updatedComment}
              />
            )}
          </button>
        </Tooltip>
        <Popover
          anchorEl={anchorEl}
          open={commentPopoverOpen}
          style={{ zIndex: 2000 }}
          onClose={handleCloseComments}
        >
          <CommentsInPopover task={task} onClose={handleCloseComments} />
        </Popover>
      </GridImg>
    </Grid>
  );
};

export default TaskItemComments;
