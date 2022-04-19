import React, {
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import { FieldType } from 'helpers/field-type-helpers';
import { BOOL_SELECT_OPTIONS } from 'helpers/custom-fields-helpers';
import FormInput from 'components/common/Input/FormInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { useFormContext } from 'react-hook-form';
import { taskDrawerFocusFieldSelector } from 'selectors/task-drawer-selectors';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import CustomFieldTextEditor from './CustomFieldTextEditor';
import { ColorIndicator } from './styled';

const CustomField = ({
  readOnly,
  field,
  initialValue,
  onBlur,
  fieldsGroupKey,
  taskIdentifier,
  task,
}) => {
  const containerReference = useRef(null);
  const { identifier, name, placeholder, fieldType, options } = field;
  const inputReference = useRef(null);
  const componentReference = useRef(null);
  const { setValue, watch } = useFormContext();
  const [wasChanged, setWasChanged] = useState(false);
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);

  const dropdownOptions = useMemo(() => {
    const o =
      options?.map(option => ({
        label: option.name,
        value: option.identifier,
        color: option.color,
      })) || [];

    if (o.length > 0) o.unshift({ label: 'None', value: null });

    return o;
  }, [options]);

  const handleBlur = useCallback(
    data => {
      if (onBlur) {
        onBlur(data, wasChanged);
      }
    },
    [onBlur, wasChanged],
  );

  const fieldName = `${fieldsGroupKey}.${identifier}`;

  useEffect(() => {
    if (initialValue) setValue(fieldName, initialValue.value);
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
      case FieldType.TEXT:
        return (
          <CustomFieldTextEditor
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            taskIdentifier={taskIdentifier}
            task={task}
            fieldsGroupKey={fieldsGroupKey}
            inputRef={inputReference}
            onChange={() => setWasChanged(true)}
          />
        );
      case FieldType.LONG_TEXT:
        return (
          <FormInput
            readOnly={readOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            multiline
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
          />
        );
      case FieldType.NUMBER:
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
          />
        );
      case FieldType.BOOL:
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
          />
        );
      case FieldType.DATE:
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
          />
        );
      case FieldType.DROPDOWN: {
        const value = watch(fieldName) || '';
        const colorIndicator = dropdownOptions?.find(o => o.value === value)
          ?.color;

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
            />
          </Box>
        );
      }
      default:
        return <div>{field.name}</div>;
    }
  }, [
    dropdownOptions,
    field.name,
    fieldName,
    fieldType,
    fieldsGroupKey,
    handleBlur,
    name,
    placeholder,
    readOnly,
    task,
    taskIdentifier,
    watch,
  ]);

  return <div ref={containerReference}>{renderCustomField()}</div>;
};

export default CustomField;
