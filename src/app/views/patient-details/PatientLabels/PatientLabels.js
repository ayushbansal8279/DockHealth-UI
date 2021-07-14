/* eslint-disable no-unused-expressions */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import {
  patientSelector,
  patientLabelsSelector,
} from 'selectors/patient-details-selectors';
import initializeLabelsSectionHooks from './hooks';
import {
  OptionContainer,
  OptionButtonsContainer,
  OptionButton,
  OptionButtonsInput,
  NoOptionTextLabel,
  LabelChip,
  NoOptionContainer,
} from './styled';

const renderOption = ({
  isEditable,
  option,
  registerOption,
  onEdit,
  onBlur,
  onSaveEdit,
  onDelete,
}) => (
  <OptionContainer key={option?.labelIdentifier} isEditable={isEditable}>
    <OptionButtonsInput
      ref={registerOption}
      defaultValue={option?.labelName}
      onBlur={event => {
        event.stopPropagation();
        onBlur();
      }}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          event?.target?.blur();
          if (
            event?.target.value !== option?.labelName &&
            event?.target.value !== ''
          ) {
            onSaveEdit(event?.target.value);
          }
        }

        if (event.key === 'Escape') {
          event?.target?.blur();
          // eslint-disable-next-line no-param-reassign
          event.target.value = option?.labelName;
        }
      }}
    />
    <OptionButtonsContainer>
      <OptionButton
        type="button"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          onEdit();
        }}
      >
        Edit
      </OptionButton>
      <OptionButton
        type="button"
        onClick={event => {
          event.stopPropagation();
          event.preventDefault();
          onDelete();
        }}
      >
        Delete
      </OptionButton>
    </OptionButtonsContainer>
  </OptionContainer>
);

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientLabels = () => {
  const {
    saveAddLabel,
    saveEditLabel,
    removeLabelFromPatient,
    deleteLabel,
    refreshLabels,
    isLoadingLabels,
  } = initializeLabelsSectionHooks({});

  const patient = useSelector(patientSelector);
  const labels = useSelector(patientLabelsSelector) || [];
  const [inputValue, setInputValue] = useState('');
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const optionReferences = useRef({});
  const inputReference = useRef(null);

  const selectedLabels = useMemo(() => patient?.patientLabels || [], [patient]);

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    } else {
      inputReference.current?.focus();
    }
  }, [currentEditableOption, inputReference]);

  const getInputReference = element => {
    inputReference.current = element;
  };

  const renderOptionCallback = useCallback(
    option =>
      renderOption({
        option,
        registerOption: element => {
          if (element) {
            optionReferences.current[option?.labelIdentifier] = element;
          }
        },
        onEdit: () => {
          setCurrentEditableOption(option?.labelIdentifier);
        },
        onBlur: () => {
          setCurrentEditableOption(null);
        },
        onSaveEdit: value => saveEditLabel(option?.labelIdentifier, value),
        onDelete: () => deleteLabel(option),
      }),
    [deleteLabel, saveEditLabel],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map(option => (
        <LabelChip
          key={option.labelIdentifier}
          onDelete={() => removeLabelFromPatient(option)}
          label={option.labelName}
        />
      )),
    [removeLabelFromPatient, selectedLabels],
  );

  const noOptionText = useMemo(
    () => (
      <div
        onMouseDown={event => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={event => {
            if (inputValue) {
              event.stopPropagation();
              event.preventDefault();
              saveAddLabel({ labelName: inputValue });
            }
          }}
        >
          {inputValue ? (
            <>
              No results - Create{' '}
              <NoOptionTextLabel>{inputValue}</NoOptionTextLabel> label
            </>
          ) : (
            <>No results</>
          )}
        </NoOptionContainer>
      </div>
    ),
    [inputValue, saveAddLabel],
  );

  return (
    <Autocomplete
      options={labels}
      placeholder={
        labels && labels.length > 0 ? '' : "Are there labels you'd like to add?"
      }
      value={selectedLabels}
      disableCloseOnSelect={!!currentEditableOption}
      getInputReference={getInputReference}
      getOptionLabel={option => option?.labelName}
      isDisabled={!!currentEditableOption}
      renderOption={renderOptionCallback}
      renderTags={renderTagsCallback}
      onInputChange={setInputValue}
      InputProps={{
        onKeyDown: event => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            event?.target?.blur();
            saveAddLabel({ labelName: inputValue });
          }
        },
      }}
      noOptionsText={noOptionText}
      onOpen={refreshLabels}
      isLoading={isLoadingLabels}
      onChange={values => {
        const valuesLength = values.length;
        const value = values[valuesLength - 1];
        saveAddLabel(value);

        if (currentEditableOption) {
          setCurrentEditableOption(null);
        }
      }}
      multiple
      disableClearable
    />
  );
};

export default PatientLabels;
