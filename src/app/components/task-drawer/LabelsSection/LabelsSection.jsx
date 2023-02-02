/* eslint-disable no-unused-expressions */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Chip } from '@mui/material';
import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { useSelector } from 'react-redux';
import {
  selectedTaskSelector,
  taskDrawerFocusFieldSelector,
} from 'selectors/task-drawer-selectors';
import { useForm, FormProvider } from 'react-hook-form';
import usePrevious from 'hooks/use-previous';
import initializeLabelsSectionHooks from './hooks';
import {
  OptionContainer,
  OptionButtonsContainer,
  OptionButton,
  OptionButtonsInput,
  NoOptionTextLabel,
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
      onBlur={(event) => {
        event.stopPropagation();
        onBlur();
      }}
      onKeyDown={(event) => {
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
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onEdit();
        }}
      >
        Edit
      </OptionButton>
      <OptionButton
        type="button"
        onClick={(event) => {
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

const LabelsSection = ({ onTaskUpdate }) => {
  const formMethods = useForm();
  const {
    labels,
    saveAddLabel,
    saveEditLabel,
    removeLabelFromTask,
    deleteLabel,
    refreshLabels,
    isLoadingLabels,
  } = initializeLabelsSectionHooks({
    onTaskUpdate,
    formMethods,
  });
  const { labels: selectedLabelsFromStore = [] } =
    useSelector(selectedTaskSelector) || {};
  const [inputState, setInputState] = useState();
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const optionReferences = useRef({});
  const [inputReference, setInputReference] = useState(null);
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const selectedLabelsFromStoreLength = selectedLabelsFromStore?.length;
  const previousSelectedLabelsFromStoreLength = usePrevious(
    selectedLabelsFromStoreLength,
  );

  useEffect(() => {
    if (
      selectedLabelsFromStoreLength !== previousSelectedLabelsFromStoreLength
    ) {
      setSelectedLabels(selectedLabelsFromStore);
    }
  }, [
    previousSelectedLabelsFromStoreLength,
    selectedLabelsFromStore,
    selectedLabelsFromStoreLength,
  ]);

  useEffect(() => {
    if (currentEditableOption) {
      optionReferences?.current[currentEditableOption]?.focus();
    }
  }, [currentEditableOption, inputReference]);

  const getInputReference = (element) => setInputReference(element);

  const renderOptionCallback = useCallback(
    (option) =>
      renderOption({
        option,
        registerOption: (element) => {
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
        onSaveEdit: (value) => saveEditLabel(option?.labelIdentifier, value),
        onDelete: () => {
          deleteLabel(option);
        },
      }),
    [deleteLabel, saveEditLabel],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map((option) => (
        <Chip
          key={option.labelIdentifier}
          onDelete={() => {
            setSelectedLabels((state) =>
              state.filter(
                (label) => label.labelIdentifier !== option.labelIdentifier,
              ),
            );
            removeLabelFromTask(option);
          }}
          label={option.labelName}
        />
      )),
    [removeLabelFromTask, selectedLabels],
  );

  const noOptionText = useMemo(
    () => (
      <div
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={(event) => {
            if (inputState) {
              event.stopPropagation();
              event.preventDefault();
              saveAddLabel({ labelName: inputState });
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
    [inputState, saveAddLabel],
  );

  const handleSave = useCallback(
    (value) => {
      setSelectedLabels((state) => [...state, value]);
      saveAddLabel(value);
    },
    [saveAddLabel],
  );

  return (
    <FormProvider {...formMethods}>
      <Autocomplete
        autoFocus={taskDrawerFocusField === DrawerFieldEnum.LABEL}
        options={labels}
        label="Labels"
        placeholder="Are there labels you'd like to add?"
        value={selectedLabels}
        disableCloseOnSelect={!!currentEditableOption}
        getInputReference={getInputReference}
        getOptionLabel={(option) => option?.labelName}
        isDisabled={!!currentEditableOption}
        renderOption={renderOptionCallback}
        renderTags={renderTagsCallback}
        onInputChange={setInputState}
        InputProps={{
          onKeyDown: (event) => {
            if (event.key === 'Enter' && event?.target.value !== '') {
              event.stopPropagation();
              event.preventDefault();
              event?.target?.blur();
              handleSave({ labelName: inputState });
              // saveAddLabel({ labelName: inputState });
            }
          },
        }}
        noOptionsText={noOptionText}
        onOpen={refreshLabels}
        isLoading={isLoadingLabels}
        onChange={(values) => {
          const valuesLength = values.length;
          const value = values[valuesLength - 1];
          // saveAddLabel(value);
          handleSave(value);
          if (currentEditableOption) {
            setCurrentEditableOption(null);
          }
        }}
        multiple
        disableClearable
      />
    </FormProvider>
  );
};

export default LabelsSection;
