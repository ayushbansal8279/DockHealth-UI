import React, {
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import { FieldCharakterLimit, FieldType } from 'helpers/field-type-helpers';
import { BOOL_SELECT_OPTIONS } from 'helpers/custom-fields-helpers';
import FormInput from 'components/common/Input/FormInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { useFormContext } from 'react-hook-form';
import { taskDrawerFocusFieldSelector } from 'selectors/task-drawer-selectors';
import { useSelector } from 'react-redux';
import { TaskItemType } from 'helpers/task-helpers';
import { workflowAutofocusFieldSelector } from 'selectors/workflow-drawer-selectors';
import { Box } from '@mui/material';
import CustomFieldRichTextEditor from './CustomFieldRichTextEditor';
import { ColorIndicator } from './styled';
import MultiFormSelect from '../MultiSelect/MultiFormSelect';
import CustomFieldErrorContext from './CustomFieldErrorContext';

const CustomField = ({
  readOnly,
  field,
  initialValue,
  onBlur,
  fieldsGroupKey,
  taskIdentifier,
  task,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const containerReference = useRef(null);
  const { identifier, name, placeholder, fieldType, options, displayOptions } =
    field;
  const isRequired = displayOptions.includes('TASK_REQUIRED');
  const inputReference = useRef(null);
  const componentReference = useRef(null);
  const { setValue, watch, setError, clearErrors } = useFormContext();
  const [wasChanged, setWasChanged] = useState(false);
  const [descriptionErrorState, setDescriptionErrorState] = useState(false);

  const errorContextValue = useMemo(
    () => ({
      identifier,
      descriptionErrorState,
      setDescriptionErrorState,
      isRequired,
    }),
    [descriptionErrorState, identifier, isRequired],
  );

  const isWorkflow =
    task &&
    (task.itemType === TaskItemType.BUNDLE ||
      task.itemType === TaskItemType.TEMPLATE);
  const taskDrawerFocusField = useSelector(
    isWorkflow ? workflowAutofocusFieldSelector : taskDrawerFocusFieldSelector,
  );
  const dropdownOptions = useMemo(() => {
    const o =
      options?.map((option) => ({
        label: option.name,
        value: option.identifier,
        color: option.color,
      })) || [];

    if (o.length > 0 && fieldType !== FieldType.DROPDOWN_MULTI && !isRequired) {
      o.unshift({ label: 'None', value: null });
    }
    return o;
  }, [fieldType, isRequired, options]);

  const handleBlur = useCallback(
    (data) => {
      if (onBlur) {
        onBlur(data, wasChanged);
      }
    },
    [onBlur, wasChanged],
  );

  const fieldName = `${fieldsGroupKey}.${identifier}`;
  useEffect(() => {
    if (initialValue) setValue(fieldName, initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (taskDrawerFocusField === identifier && inputReference.current) {
      if (typeof inputReference?.current?.focus === 'function')
        inputReference.current.focus();
      setTimeout(
        () =>
          containerReference.current?.scrollIntoView({
            block: 'end',
          }),
        500,
      );
    }
  }, [fieldType, identifier, taskDrawerFocusField]);

  const renderCustomField = useCallback(() => {
    switch (fieldType) {
      case FieldType.TEXT: {
        return (
          <FormInput
            type="text"
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
            characterLimit={FieldCharakterLimit.TEXT}
          />
        );
      }
      case FieldType.LONG_TEXT: {
        return (
          <CustomFieldRichTextEditor
            characterLimit={FieldCharakterLimit.LONG_TEXT}
            identifier={identifier}
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            taskIdentifier={taskIdentifier}
            task={task}
            fieldsGroupKey={fieldsGroupKey}
            inputRef={inputReference}
            onChange={() => setWasChanged(true)}
            enableRichText
          />
        );
      }
      case FieldType.NUMBER: {
        return (
          <FormInput
            type="number"
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
          />
        );
      }
      case FieldType.BOOL: {
        return (
          <FormSelect
            readOnly={readOnly}
            label={name}
            options={BOOL_SELECT_OPTIONS}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
          />
        );
      }
      case FieldType.DATE: {
        return (
          <FormInput
            readOnly={readOnly}
            label={name}
            placeholder="MM/DD/YYYY"
            inputComponent={DateInput}
            name={fieldName}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            disableClearErrorOnKeyUp
            setError={setError}
            clearErrors={clearErrors}
            required={isRequired}
          />
        );
      }
      case FieldType.DROPDOWN: {
        const value = watch(fieldName) || '';
        const colorIndicator = dropdownOptions?.find(
          (o) => o.value === value,
        )?.color;

        return (
          <Box position="relative">
            {colorIndicator && <ColorIndicator color={colorIndicator} />}
            <FormSelect
              readOnly={readOnly}
              label={name}
              options={dropdownOptions}
              name={fieldName}
              onBlur={handleBlur}
              inputRef={inputReference}
              ref={componentReference}
              onChange={() => setWasChanged(true)}
              required={isRequired}
            />
          </Box>
        );
      }
      case FieldType.DROPDOWN_MULTI: {
        return (
          <Box position="relative">
            <MultiFormSelect
              readOnly={readOnly}
              label={name}
              options={dropdownOptions}
              name={fieldName}
              onBlur={handleBlur}
              inputRef={inputReference}
              ref={componentReference}
              onChange={() => setWasChanged(true)}
              required={isRequired}
            />
          </Box>
        );
      }
      case FieldType.HYPERLINK: {
        return (
          <FormInput
            type="text"
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
          />
        );
      }

      default: {
        return <div>{field.name}</div>;
      }
    }
  }, [
    clearErrors,
    dropdownOptions,
    field.name,
    fieldName,
    fieldType,
    fieldsGroupKey,
    handleBlur,
    identifier,
    name,
    placeholder,
    readOnly,
    setError,
    task,
    taskIdentifier,
    watch,
    isRequired,
  ]);

  return (
    <div ref={containerReference}>
      <CustomFieldErrorContext.Provider value={errorContextValue}>
        {renderCustomField()}
      </CustomFieldErrorContext.Provider>
    </div>
  );
};

export default CustomField;
