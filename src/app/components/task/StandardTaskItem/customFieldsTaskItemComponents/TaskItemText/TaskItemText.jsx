import React, { useEffect, useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  convertToEditorState,
  // convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { useBoolean } from 'hooks/useBoolean';
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import { TextContainer } from './styled';

const TaskItemText = ({ value = '', onChange, readOnly = false }) => {
  // const editorReference = useRef(null);
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

  // eslint-disable-next-line no-shadow
  const handleTextEditorBlur = (_, { value }) => {
    onChange(value);
  };

  // eslint-disable-next-line no-shadow
  const handleTextEditorKeyDown = (_, { value, key }) => {
    if (key === 'Enter') {
      onChange(value);
    }
  };

  return (
    <Tooltip placement="top" title={value} hideTooltip={isEditing}>
      <TextContainer>
        <TextEditor
          type="input"
          readonly={false}
          value={value}
          onBlur={handleTextEditorBlur}
          onKeyDown={handleTextEditorKeyDown}
        />
      </TextContainer>
    </Tooltip>
  );
};

export default TaskItemText;
