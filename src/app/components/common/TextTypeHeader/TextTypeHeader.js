import { Box } from '@material-ui/core';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import useMentionsEditorState from 'components/common/TextEditor/use-mentions-editor-state';
import React, { useEffect } from 'react';

const TextTypeHeader = ({ text }) => {
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: text,
      tokenizedText: text,
      handleRichText: false,
    }),
  );
  useEffect(() => {
    if (descriptionState.getCurrentContent().getPlainText() !== text) {
      setDescriptionState(
        convertToEditorState({
          rawText: text,
          tokenizedText: text,
          handleRichText: false,
        }),
      );
    }
  }, [descriptionState, setDescriptionState, text]);

  if (!text || text === '') return '';
  return (
    <Box>
      <TextEditor
        readOnly
        oneline
        state={descriptionState}
        onChange={setDescriptionState}
        disableMentions
      />
    </Box>
  );
};

export default TextTypeHeader;
