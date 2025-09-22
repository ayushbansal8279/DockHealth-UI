import React, { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { openDrawer } from 'actions/workflow-drawer-actions';
import {
  getLabelsIconTooltipTitle,
  getAttachmentsIconTooltipTitle,
} from 'helpers/task-helpers';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import {
  FilesContainer,
  FilesWrapper,
  GridImg,
  LabelContainer,
  LabelWrapper,
} from './styled';
import TaskLabel from '../../common/TaskLabel/TaskLabel';
import TaskTemplateComment from './TaskTemplateComment';

const TaskTemplateIcons = ({
  comments,
  workflow,
  dispatch,
  labels,
  matchLabels,
  attachments,
  matchAttachments,
  isBorderColumnItem,
}) => {
  const { restrictions } = workflow ?? {};

  const onLabelClick = useCallback(() => {
    dispatch(
      openDrawer(workflow.identifier, workflow, WorkflowDrawerFieldNames.LABEL),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.ATTACHMENT,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  return (
    <Grid container wrap="nowrap">
      {comments ? (
        <TaskTemplateComment
          comments={workflow?.comments}
          matchAttachComments={workflow?.matchComments}
          workflow={workflow}
          isBorderColumnItem={isBorderColumnItem}
        />
      ) : null}
      {labels ? (
        labels.length > 0 ? (
          isBorderColumnItem ? (
            <Box marginLeft="5px" marginTop="-2px">
              <TaskLabel
                getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
                labels={labels}
                onClick={onLabelClick}
                isBorderColumnItem={isBorderColumnItem}
              />
            </Box>
          ) : (
            <TaskLabel
              getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
              labels={labels}
              onClick={onLabelClick}
              isBorderColumnItem={isBorderColumnItem}
            />
          )
        ) : (
          <LabelContainer>
            <GridImg item size={12} matched={matchLabels}>
              <Tooltip placement="top" title="Add Label">
                <button
                  disabled={
                    restrictions?.labels ===
                    SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
                  }
                  type="button"
                  onClick={onLabelClick}
                >
                  <LabelWrapper isBorderColumnItem={isBorderColumnItem}>
                    <TaskIcon type="labels" isActive={labels?.length > 0} />
                  </LabelWrapper>
                </button>
              </Tooltip>
            </GridImg>
          </LabelContainer>
        )
      ) : null}
      {attachments ? (
        <FilesContainer>
          <GridImg item size={12} matched={matchAttachments}>
            <Tooltip
              placement="top"
              title={
                attachments?.length > 0
                  ? getAttachmentsIconTooltipTitle(attachments)
                  : 'Add File'
              }
            >
              <button type="button" onClick={onAttachmentsClick}>
                <FilesWrapper
                  isBorderColumnItem={isBorderColumnItem}
                  attachments={attachments?.length > 0}
                >
                  <TaskIcon
                    type="attachments"
                    isActive={attachments?.length > 0}
                  />
                </FilesWrapper>
              </button>
            </Tooltip>
          </GridImg>
        </FilesContainer>
      ) : null}
    </Grid>
  );
};

export default TaskTemplateIcons;
