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
import { patientLabelsSelector } from 'selectors/patient-details-selectors';
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

const PatientLabels = () => {
  const labels = useSelector(patientLabelsSelector);
  const [inputState, setInputState] = useState();
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const optionReferences = useRef({});
  const [inputReference, setInputReference] = useState(null);

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    } else {
      inputReference?.focus();
    }
  }, [currentEditableOption, inputReference]);

  const getInputReference = element => setInputReference(element);

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
        onSaveEdit: () => {},
        onDelete: () => {},
      }),
    [],
  );

  const renderTagsCallback = useCallback(
    () =>
      labels.map(option => (
        <LabelChip
          key={option.labelIdentifier}
          onDelete={() => {}}
          label={option.labelName}
        />
      )),
    [labels],
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
            if (inputState) {
              event.stopPropagation();
              event.preventDefault();
            }
          }}
        >
          {inputState ? (
            <>
              No results - Create{' '}
              <NoOptionTextLabel>{inputState}</NoOptionTextLabel> label
            </>
          ) : (
            <>No results</>
          )}
        </NoOptionContainer>
      </div>
    ),
    [inputState],
  );

  return (
    <Autocomplete
      options={labels}
      label="Labels"
      placeholder="Are there labels you'd like to add?"
      value={labels}
      disableCloseOnSelect={!!currentEditableOption}
      getInputReference={getInputReference}
      getOptionLabel={option => option?.labelName}
      isDisabled={!!currentEditableOption}
      renderOption={renderOptionCallback}
      renderTags={renderTagsCallback}
      onInputChange={setInputState}
      InputProps={{
        onKeyDown: event => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            event?.target?.blur();
          }
        },
      }}
      noOptionsText={noOptionText}
      onOpen={() => {}}
      isLoading={false}
      onChange={values => {
        const valuesLength = values.length;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const value = values[valuesLength - 1];
        // saveAddLabel(value);
        if (currentEditableOption) {
          setCurrentEditableOption(null);
        }
      }}
      multiple
    />
  );
};

export default PatientLabels;
