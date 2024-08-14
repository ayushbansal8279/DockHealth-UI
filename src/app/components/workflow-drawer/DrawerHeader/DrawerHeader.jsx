import React, { useMemo, useState } from 'react';
import palette from 'styles/palette';
import { useDispatch, useSelector } from 'react-redux';
import compose from 'ramda/src/compose';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { checkIfTemplateWorkflow } from 'helpers/workflow-helpers';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import * as ModalActions from 'modal/actions';
import * as WorkflowActions from 'actions/workflow-actions';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import {
  HeaderContainer,
  HeaderText,
  StyledIconButton,
  AISummaryImageWrapper,
} from './styled';
import { openModal } from '@/app/modal/actions';
import LuminaStar from '@/app/img/AI/LuminaStar';
import { getWorkflowAISummary } from '@/app/api/ai-summary-api';
import Tooltip from '../../common/Tooltip/Tooltip';

const DrawerHeader = () => {
  const [isAiIconHovered, setAiIconHovered] = useState(false);
  const dispatch = useDispatch();
  const workflow = useSelector(workflowSelector);
  const { identifier, name } = workflow || {};

  const isTemplateTask = useMemo(
    () => checkIfTemplateWorkflow(workflow),
    [workflow],
  );

  const menuOptions = useMemo(
    () => [
      {
        name: 'Move',
        onClick: () => {
          if (isTemplateTask) {
            dispatch(
              ModalActions.openModal('SelectWorkflowDestination', {
                confirmText: 'Move',
                confirm: (parentTaskWorkflowIdentifier) => {
                  dispatch(
                    TaskTemplateActions.moveWorkflowToFolder(
                      identifier,
                      parentTaskWorkflowIdentifier,
                    ),
                  );
                },
              }),
            );
          } else {
            dispatch(
              ModalActions.openModal('SelectDestination', {
                confirmText: 'Move',
                confirm: ({ taskListIdentifier, taskGroupIdentifier }) => {
                  dispatch(
                    TemplateBundleActions.moveWorkflowToList(
                      identifier,
                      taskListIdentifier,
                      taskGroupIdentifier,
                    ),
                  );
                },
              }),
            );
          }
        },
      },
      {
        name: 'Duplicate',
        onClick: () =>
          dispatch(
            ModalActions.openModal('AttachmentsDuplicate', {
              confirm: () =>
                dispatch(WorkflowActions.duplicateWorkflow(identifier, true)),
              skip: () =>
                dispatch(WorkflowActions.duplicateWorkflow(identifier, false)),
            }),
          ),
      },
      {
        name: 'Delete',
        onClick: () =>
          dispatch(
            ModalActions.openModal('DeleteConfirmation', {
              title: 'Delete workflow',
              description:
                'Are you sure you want to delete this workflow? This action cannot be undone.',
              confirm: () => {
                dispatch(WorkflowActions.deleteWorkflow(identifier));
                dispatch(ModalActions.closeModal());
              },
            }),
          ),
        color: palette.error,
      },
    ],
    [dispatch, identifier, isTemplateTask],
  );

  const handleCloseClick = compose(dispatch, WorkflowDrawerActions.closeDrawer);

  return (
    <HeaderContainer>
      <HeaderText>Workflow</HeaderText>
      <Box display="flex">
        <Box>
          {true && ( // true will be replaced with Beta Feature Enable
            <Tooltip placement="bottom" title={'AI Summary'}>
              <AISummaryImageWrapper
                onMouseEnter={() => setAiIconHovered(true)}
                onMouseLeave={() => setAiIconHovered(false)}
                onClick={() =>
                  dispatch(
                    openModal('AISummary', {
                      origin: 'Workflow',
                      title: name,
                      onsubmit: async () =>
                        await getWorkflowAISummary(identifier),
                    }),
                  )
                }
              >
                <LuminaStar
                  color={
                    isAiIconHovered
                      ? palette.newBrightBlue
                      : palette.lightGrayishBlue
                  }
                />
              </AISummaryImageWrapper>
            </Tooltip>
          )}
        </Box>
        <OptionsMenu
          customButtonComponent={StyledIconButton}
          options={menuOptions}
        >
          <MoreHoriz />
        </OptionsMenu>
        <Box mx={0.5} />
        <StyledIconButton onClick={handleCloseClick}>
          <CloseIcon />
        </StyledIconButton>
      </Box>
    </HeaderContainer>
  );
};

export default DrawerHeader;
