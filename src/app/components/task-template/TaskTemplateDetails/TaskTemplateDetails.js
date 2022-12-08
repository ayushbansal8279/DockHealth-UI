import React, { useCallback, useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { EditorState } from 'draft-js';
import { useBoolean } from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import { partialUpdateTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import usePrevious from 'hooks/use-previous';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { TaskItemType } from 'helpers/task-helpers';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
} from 'components/common/TextEditor/helpers';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { FieldCharakterLimit } from 'helpers/field-type-helpers';
import { Text, LongTextBox, Divider } from './styled';

const TaskTemplateDetails = ({ workflow, onClick }) => {
  const detailsReference = useRef(null);

  const isWorkflow =
    workflow.itemType === TaskItemType.BUNDLE ||
    workflow.itemType === TaskItemType.TEMPLATE;

  const { identifier, description: details } = workflow;
  const dispatch = useDispatch();

  const [detailsState, setDetailsState] = useMentionsEditorState(
    convertToEditorState({
      rawText: details,
      tokenizedText: details,
      mentions: [],
      handleRichText: true,
    }),
  );

  const handleOpenDrawer = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.COMMENT,
      ),
    );
  }, [dispatch, workflow]);

  const handleChange = useCallback(
    tokenizedDetails => {
      if (isWorkflow) {
        dispatch(
          updatePartialWorkflow(identifier, {
            details: tokenizedDetails,
          }),
        );
      } else {
        dispatch(partialUpdateTask(identifier, { details: tokenizedDetails }));
      }
    },
    [dispatch, identifier, isWorkflow],
  );

  useEffect(() => {
    const { tokenizedText } = convertFromEditorStateToOutput(
      detailsState,
      true,
    );
    if (details !== tokenizedText) {
      const newContent = createMentionEntities(details, details, [], true);
      setDetailsState(EditorState.push(detailsState, newContent));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const { rawText: rawTextUnFormatted } = convertFromEditorStateToOutput(
    detailsState,
    false,
  );

  const [isFocused, setFocused, unsetFocused] = useBoolean();

  const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    state => {
      const { tokenizedText } = convertFromEditorStateToOutput(state, true);
      handleChange(tokenizedText);
    },
    [handleChange],
  );

  useEffect(() => {
    if (previousIsFocused && !isFocused) {
      updateDetails(detailsState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
    },
    [setDetailsState],
  );

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        content={({ closePopover }) => (
          <Box
            width="450px"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <CustomTextEditor
              key="TASK_DETAILS"
              empty={false}
              focused
              label="Details"
              richTextEnabled
            >
              <TextEditor
                characterLimit={FieldCharakterLimit.LONG_TEXT}
                readOnly={false}
                minHeight={100}
                ref={detailsReference}
                disableMentions
                showToolbar
                onFocus={setFocused}
                onBlur={unsetFocused}
                state={detailsState}
                onChange={onChangeDetailsEditor}
              />
            </CustomTextEditor>
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button type="button" onClick={closePopover}>
                Close
              </PopoverBottomBar.Button>
              {handleOpenDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    // onClick();
                    handleOpenDrawer();
                    closePopover();
                  }}
                >
                  Open Drawer
                </PopoverBottomBar.Button>
              )}
            </PopoverBottomBar>
          </Box>
        )}
      >
        <LongTextBox>
          <Tooltip
            placement="top"
            title={
              <pre
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {rawTextUnFormatted}
              </pre>
            }
          >
            <Text>{rawTextUnFormatted}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskTemplateDetails;
