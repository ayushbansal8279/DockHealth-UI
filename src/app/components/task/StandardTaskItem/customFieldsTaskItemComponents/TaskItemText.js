import React from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { CustomFieldWidthConfig, FieldType } from 'helpers/field-type-helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { StandardTaskItemCell } from './styled';

const TaskItemText = ({ value = '', onClick }) => {
  const [state, setState] = useMentionsEditorState(
    convertToEditorState({
      rawText: value,
      tokenizedText: value,
      mentions: [],
      handleRichText: false,
    }),
  );

  return (
    <StandardTaskItemCell
      paddingLeft="tiny"
      paddingRight="tiny"
      width={CustomFieldWidthConfig[FieldType.TEXT]}
      justify="center"
      onContextMenu={event => {
        event.stopPropagation();
      }}
      onClick={onClick}
    >
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
    </StandardTaskItemCell>
  );
};

export default TaskItemText;
