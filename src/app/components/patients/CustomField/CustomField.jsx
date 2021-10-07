import React, { useMemo, useEffect } from 'react';
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

const CustomField = ({ readOnly, field, initialValue }) => {
  const { identifier, name, placeholder, fieldType, options } = field;

  const { setValue, watch } = useFormContext();

  const dropdownOptions = useMemo(
    () =>
      options?.map(option => ({
        label: option.name,
        value: option.identifier,
      })) || [],
    [options],
  );

  const fieldName = `patientMetaData.${identifier}`;

  useEffect(() => {
    if (initialValue) setValue(fieldName, initialValue.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = watch(fieldName);

  switch (fieldType) {
    case FieldType.TEXT:
      return (
        <FormInput
          readOnly={readOnly}
          label={name}
          name={fieldName}
          placeholder={placeholder}
          multiline={readOnly && value}
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
        />
      );
    case FieldType.DROPDOWN:
      return (
        <FormSelect
          readOnly={readOnly}
          label={name}
          options={dropdownOptions}
          name={fieldName}
        />
      );
    default:
      return <div>{field.name}</div>;
  }
};

export default CustomField;
