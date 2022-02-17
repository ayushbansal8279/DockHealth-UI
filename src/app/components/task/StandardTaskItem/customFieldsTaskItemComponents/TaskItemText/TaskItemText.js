import React, { useEffect, useRef, useState, useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TextEditor from 'components/common/TextEditor/TextEditor';
import {
  convertToEditorState,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { useBoolean } from 'hooks/useBoolean';
import { TextContainer } from './styled';

const TaskItemText = ({ value = '', onChange, isHovered }) => {
  const editorReference = useRef(null);
  const [textValue, setTextValue] = useState(value);
  const [isEditing, setEditing, unsetEditing] = useBoolean(false);
  const [state, setState] = useMentionsEditorState(
    convertToEditorState({
      rawText: value,
      tokenizedText: value,
      mentions: [],
      handleRichText: false,
    }),
  );

  useEffect(() => {
    if (textValue !== value) {
      setState(
        convertToEditorState({
          rawText: value,
          tokenizedText: value,
          mentions: [],
          handleRichText: false,
        }),
      );
      setTextValue(value);
    }
  }, [setState, textValue, value]);

  const handleClick = () => {
    setEditing();
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      editorReference.current?.focus();
    });
  };

  const handleKeyBindingFn = useCallback(event => {
    if (event.key === 'Enter') {
      return 'enter-command';
    }

    return undefined;
  }, []);

  const handleKeyCommand = useCallback(
    command => {
      if (command === 'enter-command') {
        // eslint-disable-next-line no-unused-expressions
        editorReference.current?.blur();
        return 'handled';
      }

      return 'not-handled';
    },
    [editorReference],
  );

  const handleBlur = () => {
    const { rawText } = convertFromEditorStateToOutput(state, false);
    if (value !== rawText) {
      onChange(rawText);
    }
    unsetEditing();
  };

  return (
    <Tooltip placement="top" title={value} hideTooltip={isEditing}>
      <TextContainer withBorder={isHovered || isEditing} onClick={handleClick}>
        <TextEditor
          ref={editorReference}
          readOnly={!isEditing}
          state={state}
          onChange={data => {
            setState(data);
          }}
          onBlur={handleBlur}
          keyBindingFn={handleKeyBindingFn}
          handleKeyCommand={handleKeyCommand}
          disableMentions
          oneline
        />
      </TextContainer>
    </Tooltip>
  );
};

export default TaskItemText;
