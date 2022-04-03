import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { EditorState, ContentState } from 'draft-js';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { useDispatch } from 'react-redux';
import { partialUpdateTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { TaskItemType } from 'helpers/task-helpers';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { formatMetaDataOutput } from 'components/task-drawer/CustomFieldsSection/helpers';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import TextEditor from '../TextEditor/TextEditor';
import { CustomTextEditorContainer } from './styled';

const CustomFieldTextEditor = ({
  readOnly,
  name,
  label,
  placeholder,
  taskIdentifier,
  task,
  fieldsGroupKey,
  inputRef,
}) => {
  const dispatch = useDispatch();
  const { getValues, watch, register, unregister, setValue } = useFormContext();
  const initialValue = getValues();
  const value = watch(name);
  const [isFocused, setIsFocused] = useState(false);

  const [state, setState] = useMentionsEditorState(
    convertToEditorState({
      rawText: initialValue?.[name],
      tokenizedText: initialValue?.[name],
      mentions: [],
      handleRichText: false,
    }),
  );

  useEffect(() => {
    register({ name });
    return () => {
      unregister(name);
    };
  }, [name, register, unregister]);

  useLayoutEffect(() => {
    if (value?.length) {
      const newState = EditorState.createWithContent(
        ContentState.createFromText(value),
      );
      setState(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateCustomFields = useCallback(
    text => {
      const values = getValues();
      const previousValue = values[name];
      if (!text && !previousValue) return;
      if (previousValue !== text) {
        values[name] = text;
        if (taskIdentifier) {
          const formattedValue = formatMetaDataOutput({
            taskMetaData: values,
          });
          const adjustedValues = formattedValue.taskMetaData.map(object => ({
            ...object,
            customFieldIdentifier: object.customFieldIdentifier.slice(
              fieldsGroupKey.length + 1,
            ),
          }));
          if (adjustedValues.length > 0) {
            // eslint-disable-next-line no-unused-expressions
            task.itemType === TaskItemType.BUNDLE ||
            task.itemType === TaskItemType.TEMPLATE
              ? dispatch(
                  updatePartialWorkflow(task?.identifier, {
                    taskMetaData: adjustedValues,
                  }),
                )
              : dispatch(
                  partialUpdateTask(task?.identifier, {
                    taskMetaData: adjustedValues,
                  }),
                );
            dispatch(showGlobalAlert(AlertMessages.UPDATED));
          }
        } else {
          setValue(name, text);
        }
      }
    },
    [
      dispatch,
      fieldsGroupKey.length,
      getValues,
      name,
      setValue,
      taskIdentifier,
      task,
    ],
  );

  const handleBlur = useCallback(() => {
    const { rawText } = convertFromEditorStateToOutput(state, false);
    updateCustomFields(rawText);
    setIsFocused(false);
  }, [state, updateCustomFields]);

  return (
    <CustomTextEditor
      hasError={false}
      empty={value?.length > 0}
      focused={isFocused}
      label={label}
    >
      <CustomTextEditorContainer>
        <TextEditor
          readOnly={readOnly}
          placeholder={placeholder}
          state={state}
          onChange={setState}
          onBlur={handleBlur}
          disableMentions
          oneline
          ref={inputRef}
          onFocus={() => setIsFocused(true)}
        />
      </CustomTextEditorContainer>
    </CustomTextEditor>
  );
};

export default CustomFieldTextEditor;
