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
import { taskDrawerFocusFieldSelector } from 'selectors/task-drawer-selectors';
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
  LableContainer,
  Title,
} from './styled';

const renderOption = ({
  isEditable,
  disabled,
  option,
  registerOption,
  onEdit,
  onBlur,
  onSaveEdit,
  onDelete,
  onClick,
}) => (
  <OptionContainer
    key={option?.labelIdentifier}
    isEditable={isEditable}
    disabled={disabled}
    labelIdentifier={option?.labelIdentifier}
  >
    <OptionButtonsInput
      ref={registerOption}
      greyed={disabled}
      defaultValue={option?.labelName}
      onClick={onClick}
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

const LabelsSection = ({ selectedTask, onTaskUpdate }) => {
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
  const { labels: selectedLabelsFromStore = [] } = selectedTask || {};
  const [inputState, setInputState] = useState();
  const [currentEditableOption, setCurrentEditableOption] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const optionReferences = useRef({});
  const [inputReference, setInputReference] = useState(null);
  const taskDrawerFocusField = useSelector(taskDrawerFocusFieldSelector);
  const selectedLabelsFromStoreLength = selectedLabelsFromStore?.length;
  const previousSelectedLabelsFromStoreLength = usePrevious(
    selectedLabelsFromStoreLength,
  );

  useEffect(() => {
    // if (
    //   selectedLabelsFromStoreLength !== previousSelectedLabelsFromStoreLength
    // ) {
    setSelectedLabels(selectedLabelsFromStore);
    // }
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
    (_, option) => {
      const disabled = selectedLabels.some(
        (label) => label.labelIdentifier === option.labelIdentifier,
      );
      return renderOption({
        option,
        disabled,
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
          setSelectedLabels((previousSelectedLabels) =>
            previousSelectedLabels.filter(
              (selectedLabel) =>
                selectedLabel.labelIdentifier !== option?.labelIdentifier,
            ),
          );
        },
        onClick: () => {
          if (
            currentEditableOption &&
            currentEditableOption !== option?.labelIdentifier
          ) {
            setCurrentEditableOption(null);
          }
          setSelectedLabels((previousLabels) => {
            if (
              previousLabels.some(
                (label) => label.labelIdentifier === option.labelIdentifier,
              )
            ) {
              return previousLabels;
            }
            saveAddLabel(option);
            return [...previousLabels, option];
          });
        },
      });
    },
    [deleteLabel, saveEditLabel, saveAddLabel],
  );

  const renderTagsCallback = useCallback(
    () =>
      selectedLabels.map((option) => (
        <Chip
          variant="outlined"
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
              handleSave({ labelName: inputState });
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
    <LableContainer>
      <Title>Label</Title>
      <FormProvider {...formMethods}>
        <Autocomplete
          isOpen={isOpen}
          autoFocus={taskDrawerFocusField === DrawerFieldEnum.LABEL}
          options={labels}
          // label="Labels"
          placeholder={
            selectedLabels?.length > 0
              ? ''
              : "Are there labels you'd like to add?"
          }
          value={selectedLabels}
          getInputReference={getInputReference}
          getOptionLabel={(option) => option?.labelName}
          isOptionEqualToValue={(option, value) =>
            option.labelIdentifier === value.labelIdentifier
          }
          // isDisabled={!!currentEditableOption}
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
          onOpen={() => {
            refreshLabels();
            setIsOpen(true);
          }}
          onClose={() => !currentEditableOption && setIsOpen(false)}
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
          disableCloseOnSelect
        />
      </FormProvider>
    </LableContainer>
  );
};

export default LabelsSection;
