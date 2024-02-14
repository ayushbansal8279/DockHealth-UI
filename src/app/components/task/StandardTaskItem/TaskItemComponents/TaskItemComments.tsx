import React, { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { TaskDto } from '@/app/types/swagger/models/TaskDto';
import { CommentDto } from '@/app/types/swagger/models/CommentDto';
import useBooleanWithTimeout from '@/app/hooks/use-boolean-with-timeout';
import { CommentCard, GridImg } from '../../styled';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import Popper from '@mui/material/Popper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CommentSection from '@/app/components/task-drawer/CommentSection/CommentSection';

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
  const dispatch = useDispatch();
  const anchorElementRef = useRef();
  const [cardOpen, openCard, closeCard] = useBooleanWithTimeout();

  const onCommentClick = () => {
    dispatch(openDrawer(DrawerFieldEnum.COMMENT) as any);
    dispatch(storeAsCurrentTask(task) as any);
  };

  return (
    <Grid container wrap="nowrap">
      <GridImg
        item
        xs={12}
        matched={matchComments}
        ref={anchorElementRef}
        onMouseEnter={openCard}
        onMouseLeave={closeCard}
      >
        <button type="button" onClick={onCommentClick}>
          <TaskIcon
            type="comments"
            isActive={comments?.length > 0}
            isNew={task.updatedComment}
          />
        </button>
        <Popper
          anchorEl={anchorElementRef.current}
          open={cardOpen}
          placement="bottom"
          style={{ zIndex: 2000 }}
        >
          <CommentCard>
            <CommentSection selectedTask={task} showTitle={false} />
          </CommentCard>
        </Popper>
      </GridImg>
    </Grid>
  );
};

export default TaskItemComments;
