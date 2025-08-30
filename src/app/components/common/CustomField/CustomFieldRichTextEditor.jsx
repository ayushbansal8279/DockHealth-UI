import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { partialUpdateTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { TaskItemType } from 'helpers/task-helpers';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { formatMetaDataOutput } from 'components/task-drawer/CustomFieldsSection/helpers';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { CustomTextEditorContainer } from './styled';
import CustomFieldErrorContext from './CustomFieldErrorContext';
import { FormHelperText } from '@mui/material';

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
      onChange,
      formMethods,
      // inputRef,
      // characterLimit,
      // oneline,
      // enableRichText = false,
    },
    reference,
  ) => {
    const dispatch = useDispatch();
    const formContext = useFormContext();
    const {
      getValues,
      watch,
      register,
      unregister,
      setValue,
      formState: { errors },
    } = formMethods || formContext;
    const value = watch(name);
    const [isFocused, setIsFocused] = useState(false);
    const [updatedValue, setUpdatedValue] = useState(value);

    const { descriptionErrorState, setDescriptionErrorState, isRequired } =
      useContext(CustomFieldErrorContext);

    const isNested = name?.includes('.');
    const nestedParts = name?.split('.');

    const error = isNested
      ? errors?.[nestedParts[0]]?.[nestedParts[1]]?.message
      : errors?.[name]?.message;

    useEffect(() => {
      if (isRequired) {
        register(name, {
          required: 'This field is required',
          validate: (value) => {
            if (!value || value.trim().length === 0) {
              return 'This field is required';
            }
            return true;
          },
        });
      } else {
        register(name);
      }
      return () => {
        unregister(name);
      };
    }, [name, register, unregister]);

    useEffect(() => {
      if (value !== null && value !== updatedValue) {
        setUpdatedValue(value);
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

    const handleBlur = (textValue) => {
      updateCustomFields(textValue);
    };

    const changeData = (textValue) => {
      setUpdatedValue(textValue);

      setValue(name, textValue, { shouldValidate: true });

      if (onChange) {
        onChange(textValue);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    return (
      <>
        <CustomTextEditor
          empty={value?.length > 0 || value !== null}
          focused={isFocused}
          label={label}
        >
          <CustomTextEditorContainer>
            <RichTextEditor
              ref={reference}
              value={updatedValue}
              readonly={readOnly}
              placeholder={placeholder}
              onBlur={handleBlur}
              onChange={changeData}
              onFocus={handleFocus}
              initOnClick
              showCharCount
              taskListIdentifier={task?.taskList?.taskListIdentifier}
              mentions={task?.taskMentions}
              disableMentions
            />
          </CustomTextEditorContainer>
        </CustomTextEditor>
        {error && (
          <FormHelperText error sx={{ pl: 1.5 }}>
            {error}
          </FormHelperText>
        )}
      </>
    );
  },
);

export default CustomFieldRichTextEditor;
