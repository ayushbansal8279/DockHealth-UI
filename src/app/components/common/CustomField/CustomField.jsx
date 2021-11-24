import React, { useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { FieldType } from 'helpers/field-type-helpers';
import FormInput from 'components/common/Input/FormInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { useFormContext } from 'react-hook-form';

const BOOL_SELECT_OPTIONS = [
  {
    value: 'no',
    label: 'No',
  },
  {
    value: 'yes',
    label: 'Yes',
  },
];

const CustomField = ({
  readOnly,
  field,
  initialValue,
  onBlur,
  fieldsGroupKey,
  isFocused,
  scrollToRef,
}) => {
  const { identifier, name, placeholder, fieldType, options } = field;
  const inputReference = useRef(null);
  const componentReference = useRef(null);
  const { setValue } = useFormContext();

  const dropdownOptions = useMemo(
    () =>
      options?.map(option => ({
        label: option.name,
        value: option.identifier,
      })) || [],
    [options],
  );

  const fieldName = `${fieldsGroupKey}.${identifier}`;

  useEffect(() => {
    if (initialValue) setValue(fieldName, initialValue.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (inputReference.current && isFocused) {
      setTimeout(() => {
        inputReference.current.focus();
        if (scrollToRef?.current)
          scrollToRef.current.scrollIntoView({
            block: 'end',
          });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, inputReference?.current]);

  switch (fieldType) {
    case FieldType.TEXT:
      return (
        <FormInput
          readOnly={readOnly}
          label={name}
          name={fieldName}
          placeholder={placeholder}
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
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
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
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
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
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
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
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
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
        />
      );
    case FieldType.DROPDOWN:
      return (
        <FormSelect
          readOnly={readOnly}
          label={name}
          options={dropdownOptions}
          name={fieldName}
          onBlur={onBlur}
          inputRef={inputReference}
          ref={componentReference}
        />
      );
    default:
      return <div>{field.name}</div>;
  }
};

export default CustomField;
