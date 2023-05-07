import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
// import { EditorState } from 'draft-js';
// import { useBoolean } from 'hooks/useBoolean';
// import usePrevious from 'hooks/use-previous';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
// import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
// import {
//   convertFromEditorStateToOutput,
//   convertToEditorState,
// } from 'components/common/TextEditor/helpers';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
// import { FieldCharakterLimit } from 'helpers/field-type-helpers';
import { Text, LongTextBox, Divider } from './styled';
import TextEditor from '../../../../../../ui-toolkit/Form/TextEditor/TextEditor';
import { convertToSimpleString } from '../../../../../../ui-toolkit/Form/TextEditor/helpers';

const TaskItemLongText = ({
  value = '',
  onChange,
  openDrawer,
  // field,
  readOnly = false,
}) => {
  const [rawDetails, setRawDetails] = useState(null);

  // const detailsReference = useRef(null);
  // const [detailsState, setDetailsState] = useMentionsEditorState(
  //   convertToEditorState({
  //     rawText: value,
  //     tokenizedText: value,
  //     mentions: [],
  //     handleRichText: true,
  //   }),
  // );

  useEffect(() => {
    // const { tokenizedText } = convertFromEditorStateToOutput(
    //   detailsState,
    //   true,
    // );
    // if (value !== tokenizedText) {
    //   // const newContent = createMentionEntities(value, value, [], true);
    //   // setDetailsState(EditorState.push(detailsState, newContent));
    // }
    const rawTextUnFormatted = convertToSimpleString(value);
    setRawDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // const { rawText: rawTextUnFormatted } = convertFromEditorStateToOutput(
  //   detailsState,
  //   false,
  // );

  // const [isFocused, setFocused, unsetFocused] = useBoolean();

  // const previousIsFocused = usePrevious(isFocused);

  // const updateDetails = useCallback(
  //   (state) => {
  //     const { tokenizedText } = convertFromEditorStateToOutput(state, true);
  //     onChange(tokenizedText);
  //   },
  //   [onChange],
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
    // eslint-disable-next-line no-shadow
    (_, { value }) => {
      onChange(value);
      closePopover();
  }

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover }) => (
          <Box
            width="100%"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <TextEditor
              value={value}
              onBlur={handleTextEditorBlur(closePopover)}
            />
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button type="button" onClick={closePopover}>
                Close
              </PopoverBottomBar.Button>
              {openDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    openDrawer();
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

export default TaskItemLongText;
