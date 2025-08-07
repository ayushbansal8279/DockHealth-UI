import React, {
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import propTypes from 'prop-types';
import { FieldCharacterLimit, FieldType } from 'helpers/field-type-helpers';
import {
  BOOL_SELECT_OPTIONS,
  stringToRegex,
} from 'helpers/custom-fields-helpers';
import FormInput from 'components/common/Input/FormInput';
import FormSelect from 'components/common/Select/FormSelect';
import DateInput from 'components/common/DateInput/DateInput';
import { useFormContext } from 'react-hook-form';
import { taskDrawerFocusFieldSelector } from 'selectors/task-drawer-selectors';
import { useSelector } from 'react-redux';
import { checkDateTimeIntent, TaskItemType } from 'helpers/task-helpers';
import { workflowAutofocusFieldSelector } from 'selectors/workflow-drawer-selectors';
import { Box, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CustomFieldRichTextEditor from './CustomFieldRichTextEditor';
import { ColorIndicator } from './styled';
import CustomFieldErrorContext from './CustomFieldErrorContext';
import CustomFieldAutoComplete from './CustomFieldAutoComplete';
import AutoCompleteFormSelect from '../Autocomplete/AutoCompleteFormSelect';
import palette from '@/app/styles/palette';

const CustomField = ({
  readOnly,
  field,
  selected,
  initialValue,
  onBlur,
  fieldsGroupKey,
  taskIdentifier,
  task,
  popoverZindex,
  formMethods,
}) => {
  const containerReference = useRef(null);
  const {
    identifier,
    name,
    placeholder,
    fieldType,
    options,
    displayOptions,
    validationRegex,
    validationRegexDescription,
  } = field;
  const isRequired =
    displayOptions?.includes('TASK_REQUIRED') ||
    displayOptions?.includes('PROFILE_NAME');
  const isReadOnly = displayOptions?.includes('READONLY') || readOnly;
  const inputReference = useRef(null);
  const componentReference = useRef(null);
  const formContext = useFormContext();
  const { setValue, watch, setError, clearErrors } = formMethods || formContext;
  const [wasChanged, setWasChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
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

  const validationDescription =
    validationRegexDescription || 'Not satisfying validation regex';

  const handleEditClick = () => {
    setIsEditable(true);
    setTimeout(() => {
      inputReference.current?.focus();
    }, 0);
  };

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
        data: option,
      })) || [];

    if (o.length > 0 && fieldType !== FieldType.DROPDOWN_MULTI && !isRequired) {
      o.unshift({ label: 'None', value: null });
    }
    return o;
  }, [fieldType, isRequired, options]);

  const handleBlur = useCallback(
    (data, wasDateChanged) => {
      setIsEditable(false);
      if (onBlur) {
        if (fieldType === FieldType.DATE) {
          onBlur(data, wasDateChanged);
        } else {
          onBlur(data, wasChanged);
        }
      }
    },
    [fieldType, onBlur, wasChanged],
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

  const validateWithRegex = useCallback(
    (value) => {
      if (!validationRegex) return true;

      const regex = stringToRegex(validationRegex);
      if (!value) {
        return true;
      }
      if (!(regex instanceof RegExp)) {
        return true;
      }
      const isMatch = regex.test(value);
      const result = isMatch
        ? true
        : validationDescription || 'Validation failed';
      return result;
    },
    [validationRegex, validationDescription],
  );

  const renderCustomField = useCallback(() => {
    switch (fieldType) {
      case FieldType.TEXT: {
        return (
          <FormInput
            type="text"
            readOnly={isReadOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
            characterLimit={FieldCharacterLimit.TEXT}
            validate={validationRegex ? validateWithRegex : undefined}
            disableClearErrorOnKeyUp
            formMethods={formMethods}
          />
        );
      }
      case FieldType.RELATIONSHIP: {
        return (
          <CustomFieldAutoComplete
            readOnly={isReadOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
            relatedProfileType={field.relatedProfileType}
          />
        );
      }
      case FieldType.LONG_TEXT: {
        return (
          <CustomFieldRichTextEditor
            characterLimit={FieldCharacterLimit.LONG_TEXT}
            identifier={identifier}
            readOnly={isReadOnly}
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
            readOnly={isReadOnly}
            label={name}
            name={fieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
            validate={validationRegex ? validateWithRegex : undefined}
            disableClearErrorOnKeyUp
            formMethods={formMethods}
          />
        );
      }
      case FieldType.BOOL: {
        return (
          <FormSelect
            readOnly={isReadOnly}
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
        const value = watch(fieldName) || '';
        const dateIntent = checkDateTimeIntent(value);
        return (
          <FormInput
            readOnly={isReadOnly}
            label={name}
            placeholder="MM/DD/YYYY"
            inputComponent={DateInput}
            timeEnabled
            popoverZindex={popoverZindex}
            name={fieldName}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            disableClearErrorOnKeyUp
            setError={setError}
            clearErrors={clearErrors}
            required={isRequired}
            dateIntent={dateIntent}
          />
        );
      }
      case FieldType.DROPDOWN: {
        const value = watch(fieldName) || '';
        const colorIndicator = dropdownOptions?.find(
          (o) => o.value === value,
        )?.color;

        const dependantOptions = dropdownOptions.filter((option) => {
          if (option.data?.linkedCustomFieldIdentifier) {
            const linkedCustomFieldOptionIdentifier =
              selected?.[option.data.linkedCustomFieldIdentifier];
            if (linkedCustomFieldOptionIdentifier) {
              return (
                option.data.linkedCustomFieldOptionIdentifier ===
                linkedCustomFieldOptionIdentifier
              );
            }
            return true;
          }
          return true;
        });

        return (
          <Box position="relative">
            {colorIndicator && <ColorIndicator color={colorIndicator} />}
            <AutoCompleteFormSelect
              readOnly={isReadOnly}
              label={name}
              options={
                dependantOptions?.length > 0
                  ? dependantOptions
                  : dropdownOptions
              }
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
            <AutoCompleteFormSelect
              readOnly={isReadOnly}
              label={name}
              options={dropdownOptions}
              name={fieldName}
              onBlur={handleBlur}
              inputRef={inputReference}
              ref={componentReference}
              onChange={() => setWasChanged(true)}
              required={isRequired}
              multiple={true}
            />
          </Box>
        );
      }
      case FieldType.HYPERLINK: {
        const value = watch(fieldName);
        const customFieldHasValue =
          readOnly ||
          task?.taskMetaData?.find(
            (customField) => customField?.customFieldIdentifier === identifier,
          )?.value;
        const inputFieldName =
          isEditable || !value || !customFieldHasValue ? fieldName : '';

        return (
          <FormInput
            type="text"
            readOnly={!isEditable && !!customFieldHasValue}
            label={name}
            name={inputFieldName}
            placeholder={placeholder}
            onBlur={handleBlur}
            inputRef={inputReference}
            ref={componentReference}
            onChange={() => setWasChanged(true)}
            required={isRequired}
            startAdornment={
              customFieldHasValue && !isEditable ? (
                <Link
                  href={value?.startsWith('http') ? value : `//${value}`}
                  target="_blank"
                  sx={{
                    marginTop: '18px',
                    color: palette.blueOcean,
                    fontFamily: 'Outfit',
                    textDecoration: 'none',
                    '&:hover': {
                      color: palette.brightBlue,
                    },
                  }}
                  disabled={!isEditable && !!customFieldHasValue}
                >
                  {value}
                </Link>
              ) : null
            }
            endAdornment={
              readOnly ||
              (customFieldHasValue && !isEditable ? (
                <EditIcon
                  onClick={handleEditClick}
                  sx={{
                    color: palette.coolGrey1,
                    cursor: 'pointer',
                    '&:hover': {
                      color: palette.black,
                    },
                  }}
                />
              ) : null)
            }
          />
        );
      }

      default: {
        return <div>{field.name}</div>;
      }
    }
  }, [
    fieldType,
    readOnly,
    name,
    fieldName,
    placeholder,
    handleBlur,
    isRequired,
    field.relatedProfileType,
    field.name,
    identifier,
    taskIdentifier,
    task,
    fieldsGroupKey,
    setError,
    clearErrors,
    watch,
    dropdownOptions,
    selected,
    popoverZindex,
    isEditable,
    isReadOnly,
  ]);

  return (
    <div ref={containerReference}>
      <CustomFieldErrorContext.Provider value={errorContextValue}>
        {renderCustomField()}
      </CustomFieldErrorContext.Provider>
    </div>
  );
};

CustomField.propTypes = {
  readOnly: propTypes.bool,
  field: propTypes.object.isRequired,
  selected: propTypes.object,
  initialValue: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onBlur: propTypes.func,
  fieldsGroupKey: propTypes.string.isRequired,
  taskIdentifier: propTypes.string,
  task: propTypes.object,
  popoverZindex: propTypes.number,
  formMethods: propTypes.object,
};

export default CustomField;
