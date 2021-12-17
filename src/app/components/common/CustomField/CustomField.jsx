import React, {
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import { FieldType } from 'helpers/field-type-helpers';
import FormInput from 'components/common/Input/FormInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { useFormContext } from 'react-hook-form';
import CustomFieldTextEditor from './CustomFieldTextEditor';

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
  taskIdentifier,
}) => {
  const { identifier, name, placeholder, fieldType, options } = field;
  const inputReference = useRef(null);
  const { current } = inputReference || {};
  const componentReference = useRef(null);
  const { setValue } = useFormContext();
  const [wasChanged, setWasChanged] = useState(false);

  const dropdownOptions = useMemo(
    () =>
      options?.map(option => ({
        label: option.name,
        value: option.identifier,
      })) || [],
    [options],
  );

  const handleBlur = useCallback(
    data => {
      onBlur(data, wasChanged);
    },
    [onBlur, wasChanged],
  );

  const fieldName = `${fieldsGroupKey}.${identifier}`;

  useEffect(() => {
    if (initialValue) setValue(fieldName, initialValue.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (current && isFocused) {
      setTimeout(() => {
        current.focus();
        if (scrollToRef?.current)
          scrollToRef.current.scrollIntoView({
            block: 'end',
          });
      }, 500);
    }
  }, [current, fieldName, isFocused, scrollToRef]);

  switch (fieldType) {
    case FieldType.TEXT:
      return (
        <CustomFieldTextEditor
          readOnly={readOnly}
          label={name}
          name={fieldName}
          placeholder={placeholder}
          taskIdentifier={taskIdentifier}
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
    case FieldType.DROPDOWN:
      return (
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
      );
    default:
      return <div>{field.name}</div>;
  }
};

export default CustomField;
