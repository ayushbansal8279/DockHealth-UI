import React, { useEffect, useState } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';

const TaskItemText = ({ value = '' }) => {
  const [textValue, setTextValue] = useState(value);
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

  return (
    <Tooltip placement="top" title={value}>
      <TextEditor
        readOnly
        state={state}
        onChange={data => {
          setState(data);
        }}
        disableMentions
        oneline
      />
    </Tooltip>
  );
};

export default TaskItemText;
