import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
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

const TaskTemplateIcons = ({
  workflow,
  dispatch,
  labels,
  matchLabels,
  attachments,
  matchAttachments,
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
    <Grid container>
      {labels ? (
        <LabelContainer>
          {labels.length > 0 ? (
            <TaskLabel
              getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
              labels={labels}
              onClick={onLabelClick}
            />
          ) : (
            <GridImg item xs={12} matched={matchLabels}>
              <Tooltip placement="top" title="Add Label">
                <button
                  disabled={
                    restrictions?.labels ===
                    SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
                  }
                  type="button"
                  onClick={onLabelClick}
                >
                  <LabelWrapper>
                    <TaskIcon type="labels" isActive={labels?.length > 0} />
                  </LabelWrapper>
                </button>
              </Tooltip>
            </GridImg>
          )}
        </LabelContainer>
      ) : null}
      {attachments ? (
        <FilesContainer>
          <GridImg item xs={12} matched={matchAttachments}>
            <Tooltip
              placement="top"
              title={
                attachments?.length > 0
                  ? getAttachmentsIconTooltipTitle(attachments)
                  : 'Add File'
              }
            >
              <button type="button" onClick={onAttachmentsClick}>
                <FilesWrapper attachments={attachments?.length > 0}>
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
