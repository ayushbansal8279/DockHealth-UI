import React, { useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import {
  getLabelsIconTooltipTitle,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
} from 'helpers/task-helpers';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { GridImg, StandardTaskItemCell } from '../../styled';

const TaskItemIcons = ({
  matchComments,
  comments,
  isHovered,
  task,
  matchLabels,
  labels,
  matchAttachments,
  attachments,
  dispatch,
}) => {
  const onCommentClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.COMMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onLabelClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.LABEL));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.ATTACHEMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);
  return (
    <StandardTaskItemCell width="150px">
      <Grid container>
        <GridImg item xs={4} matched={matchComments}>
          <Tooltip
            placement="top"
            title={
              comments?.length > 0
                ? getCommentsIconTooltipTitle(comments)
                : 'Add a new comment'
            }
          >
            <TaskIcon
              type="comments"
              isHovered={isHovered}
              isActive={comments?.length > 0}
              isNew={task.updatedComment}
              onClick={onCommentClick}
            />
          </Tooltip>
        </GridImg>
        <GridImg item xs={4} matched={matchLabels}>
          <Tooltip
            placement="top"
            title={
              labels?.length > 0
                ? getLabelsIconTooltipTitle(labels)
                : 'Add label'
            }
          >
            <TaskIcon
              type="labels"
              isHovered={isHovered}
              isActive={labels?.length > 0}
              isNew={task.updatedLabel}
              onClick={onLabelClick}
            />
          </Tooltip>
        </GridImg>
        <GridImg item xs={4} matched={matchAttachments}>
          <Tooltip
            placement="top"
            title={
              attachments?.length > 0
                ? getAttachmentsIconTooltipTitle(attachments)
                : 'Add file'
            }
          >
            <TaskIcon
              type="attachments"
              onClick={onAttachmentsClick}
              isHovered={isHovered}
              isActive={attachments?.length > 0}
              isNew={task.updatedAttachment}
            />
          </Tooltip>
        </GridImg>
      </Grid>
    </StandardTaskItemCell>
  );
};

export default TaskItemIcons;
