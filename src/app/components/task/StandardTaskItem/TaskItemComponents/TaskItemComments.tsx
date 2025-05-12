import React, { FC, useCallback } from 'react';

import { Popover } from '@mui/material';
import Grid from '@mui/material/Grid';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { Task } from '@/app/types/Task';
import { CommentsContainer, CommentsWrapper, GridImg } from '../../styled';
import CommentsInPopover from '../../CommentsInPopover/CommentsInPopover';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import { IComment } from '@/app/types/Comment';

interface TaskItemCommentsProps {
  matchComments: boolean;
  comments: Array<IComment>;
  task: Task;
  isBorderColumnItem: boolean;
}

const TaskItemComments: FC<TaskItemCommentsProps> = ({
  matchComments,
  comments,
  task,
  isBorderColumnItem,
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
    <CommentsContainer>
      <Grid container wrap="nowrap">
        <GridImg item xs={12} matched={matchComments}>
          <Tooltip placement="top" title={tooltipTitle}>
            <button type="button" onClick={onCommentClick}>
              <CommentsWrapper
                isBorderColumnItem={isBorderColumnItem}
                hasComments={hasComments}
              >
                <TaskIcon
                  type="comments"
                  isActive={hasComments}
                  isNew={task.updatedComment}
                />
              </CommentsWrapper>
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
    </CommentsContainer>
  );
};

export default TaskItemComments;
