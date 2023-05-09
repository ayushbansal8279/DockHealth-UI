import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
// import { EditorState } from 'draft-js';
// import { useBoolean } from 'hooks/useBoolean';
import { useDispatch } from 'react-redux';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
// import usePrevious from 'hooks/use-previous';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { TaskItemType } from 'helpers/task-helpers';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { openDrawer } from 'actions/workflow-drawer-actions';
// import {
//   convertFromEditorStateToOutput,
//   convertToEditorState,
// } from 'components/common/TextEditor/helpers';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
// import { FieldCharakterLimit } from 'helpers/field-type-helpers';
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import { convertToSimpleString } from 'ui-toolkit/Form/TextEditor/helpers';
import {
  Text,
  LongTextBox,
  Divider,
} from '../customFieldsTaskItemComponents/TaskItemLongText/styled';

const TaskItemDetails = ({ task, onClick, readOnly }) => {
  // const detailsReference = useRef(null);

  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;

  const { identifier, details } = task;
  const dispatch = useDispatch();

  const [rawDetails, setRawDetails] = useState(null);
  // const [currentDetails, setCurrentDetails] = useState(details);

  // const [detailsState, setDetailsState] = useMentionsEditorState(
  //   convertToEditorState({
  //     rawText: details,
  //     tokenizedText: details,
  //     mentions: [],
  //     handleRichText: true,
  //   }),
  // );

  const handleOpenDrawer = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
  }, [dispatch, task]);

  // const handleChange = useCallback(
  //   (tokenizedDetails) => {
  //     if (isWorkflow) {
  //       dispatch(
  //         updatePartialWorkflow(identifier, {
  //           details: tokenizedDetails,
  //         }),
  //       );
  //     } else {
  //       dispatch(partialUpdateTask(identifier, { details: tokenizedDetails }));
  //     }
  //   },
  //   [dispatch, identifier, isWorkflow],
  // );

  useEffect(() => {
    // const { tokenizedText } = convertFromEditorStateToOutput(
    //   detailsState,
    //   true,
    // );
    // if (details !== tokenizedText) {
    //   // const newContent = createMentionEntities(details, details, [], true);
    //   // setDetailsState(EditorState.push(detailsState, newContent));
    // }
    const rawTextUnFormatted = convertToSimpleString(details);
    setRawDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  // const { rawText: rawTextUnFormatted } = convertFromEditorStateToOutput(
  //   detailsState,
  //   false,
  // );

  // const rawTextUnFormatted = convertToSimpleString(details);

  // const [isFocused, setFocused, unsetFocused] = useBoolean();
  // const previousIsFocused = usePrevious(isFocused);

  // const updateDetails = useCallback(
  //   (state) => {
  //     const { tokenizedText } = convertFromEditorStateToOutput(state, true);
  //     handleChange(tokenizedText);
  //   },
  //   [handleChange],
  // );

  // useEffect(() => {
  //   if (previousIsFocused && !isFocused) {
  //     updateDetails(detailsState);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isFocused]);

  // const onChangeDetailsEditor = useCallback(
  //   (state) => {
  //     setDetailsState(state);
  //   },
  //   [setDetailsState],
  // );

  const handleTextEditorBlur =
    (closePopover) =>
    (_, { value }) => {
      if (isWorkflow) {
        dispatch(
          updatePartialWorkflow(identifier, {
            details: value,
          }),
        );
      } else {
        dispatch(partialUpdateTask(identifier, { details: value }));
      }
      closePopover();
    };

  // const handleTextEditorOnChange =
  //   (closePopover) =>
  //   (_, { value }) => {
  //     setCurrentDetails(value);
  //     closePopover();
  //   };

  const handlePopupClose = (closePopover) => (_) => {
    // if (isWorkflow) {
    //   dispatch(
    //     updatePartialWorkflow(identifier, {
    //       details: currentDetails,
    //     }),
    //   );
    // } else {
    //   dispatch(partialUpdateTask(identifier, { details: currentDetails }));
    // }
    closePopover();
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover }) => (
          <Box
            height="100%"
            alignItems="center"
            // style={{ padding: '5px' }}
          >
            <CustomTextEditor
              key="TASK_DETAILS"
              empty={false}
              focused
              label="Details"
              richTextEnabled
            >
              <TextEditor
                autofocus
                readonly={readOnly}
                value={details}
                onBlur={handleTextEditorBlur(closePopover)}
                // onChange={handleTextEditorOnChange(closePopover)}
              />
            </CustomTextEditor>
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button
                type="button"
                onClick={handlePopupClose(closePopover)}
              >
                Close
              </PopoverBottomBar.Button>
              {handleOpenDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    onClick();
                    handlePopupClose(closePopover);
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
                  fontFamily: "'Roboto Condensed', sans-serif",
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {rawDetails}
              </pre>
            }
          >
            <Text>{rawDetails}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemDetails;
