import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import {
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
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { CustomTextEditorContainer } from './styled';
import CustomFieldErrorContext from './CustomFieldErrorContext';
import TextEditor from "ui-toolkit/Form/TextEditor/TextEditor";

const CustomFieldRichTextEditor = React.forwardRef(
  (
    {
      readOnly,
      name,
      label,
      placeholder,
      taskIdentifier,
      identifier,
      task,
      fieldsGroupKey,
      inputRef,
      characterLimit,
      oneline,
      enableRichText = false,
    },
    reference,
  ) => {
    const dispatch = useDispatch();
    const { getValues, watch, register, unregister, setValue } =
      useFormContext();
    const value = watch(name);
    const [isFocused, setIsFocused] = useState(false);
    const [updatedValue, setUpdatedValue] = useState(value);
    const [state, setState] = useMentionsEditorState(convertToEditorState());

    const { descriptionErrorState, setDescriptionErrorState, isRequired } =
      useContext(CustomFieldErrorContext);

    useEffect(() => {
      register(name);
      return () => {
        unregister(name);
      };
    }, [name, register, unregister]);

    useEffect(() => {
      if (value !== null && value !== updatedValue) {
        // const newContent = createMentionEntities(value, value, [], true);
        setUpdatedValue(value);
        // setState(EditorState.push(state, newContent));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const updateCustomFields = useCallback(
      (text) => {
        if (!text && isRequired) {
          setDescriptionErrorState(true);
          return;
        }

        setDescriptionErrorState(false);
        const values = getValues(fieldsGroupKey);
        if (text === updatedValue) return;
        values[identifier] = text;
        if (taskIdentifier) {
          const formattedValue = formatMetaDataOutput({
            taskMetaData: values,
          });
          setUpdatedValue(text);
          const adjustedValues = formattedValue.taskMetaData.map((object) => ({
            ...object,
            customFieldIdentifier: object.customFieldIdentifier,
          }));
          if (adjustedValues.length > 0) {
            // eslint-disable-next-line no-unused-expressions
            task?.itemType === TaskItemType.BUNDLE ||
            task?.itemType === TaskItemType.TEMPLATE
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
      },
      [
        isRequired,
        getValues,
        fieldsGroupKey,
        updatedValue,
        identifier,
        taskIdentifier,
        setDescriptionErrorState,
        task,
        dispatch,
        setValue,
        name,
      ],
    );

    const [currentValue, setCurrentValue] = useState(value);

    const handleBlur = (_, { value }) => {
        updateCustomFields(value);
        setIsFocused(false);
    };

    return (
      <CustomTextEditor
        hasError={descriptionErrorState}
        empty={value?.length > 0}
        focused={isFocused}
        label={label}
        required={isRequired}
        ref={reference}
      >
        <CustomTextEditorContainer>
          <TextEditor
            type="textarea"
            readonly={readOnly}
            placeholder={placeholder}
            value={currentValue}
            onChange={(_, { value }) => setCurrentValue(value)}
            onBlur={handleBlur}
          />
        </CustomTextEditorContainer>
      </CustomTextEditor>
    );
  },
);

export default CustomFieldRichTextEditor;
