import React, { useCallback, useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { trunc } from 'helpers/utility-functions';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
  // isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import { Text } from './styled';

const TaskItemLongText = ({ value = '', onChange, field }) => {
  const detailsReference = useRef(null);
  // const dispatch = useDispatch();

  // const [detailsState, setDetailsState] = useState(value);
  const [detailsState, setDetailsState] = useMentionsEditorState(
    convertToEditorState({
      rawText: value,
      tokenizedText: value,
      mentions: [],
      handleRichText: true,
    }),
  );

  const [isFocused, setFocused, unsetFocused] = useBoolean();

  const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    state => {
      const {
        tokenizedText,
        rawText,
        // mentions,
      } = convertFromEditorStateToOutput(state, true);
      console.log(tokenizedText);
      console.log(rawText);
      onChange(tokenizedText);
    },
    [onChange],
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
        content={() => (
          <Box
            width="450px"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <CustomTextEditor
              key={field?.identifier}
              empty={false}
              focused
              label={field.name}
              richTextEnabled
            >
              <TextEditor
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
          </Box>
        )}
      >
        <Tooltip placement="top" title={value}>
          <Text>{trunc(value, 15)}</Text>
        </Tooltip>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemLongText;
