import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { useBoolean } from 'hooks/useBoolean';
import { showGlobalErrorAlert } from 'alert/actions';
import { addTaskDependencyLink } from 'actions/task-actions';
import { getAvailableTaskDependencies } from 'api/task-api';
import { prop } from 'ramda';
import QuickAddTaskInputWrapper from '../QuickAddTaskInputWrapper/QuickAddTaskInputWrapper';
import { StyledInput } from './styled';

const DependenciesAutocomplete = ({ taskIdentifier }) => {
  const [availableDependencies, setAvailableDependencies] = useState(null);
  const { 0: isLoadingDependencies, 2: unsetLoadingDependencies } = useBoolean(
    true,
  );
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [inputValue, setInputValue] = useState('');

  const dispatch = useDispatch();

  const getAvailableDependencies = () => {
    getAvailableTaskDependencies(taskIdentifier)
      .then(d => {
        setAvailableDependencies(d);
        unsetLoadingDependencies();
      })
      .catch(() => {
        unsetLoadingDependencies();
        dispatch(showGlobalErrorAlert());
      });
  };

  const handleInputChange = event => {
    setInputValue(event?.target?.value || '');
  };

  const handleSelection = (_, selectedValue) => {
    dispatch(addTaskDependencyLink(selectedValue.task, taskIdentifier));
  };

  const options = useMemo(
    () =>
      availableDependencies?.map(task => ({
        id: task.identifier,
        label: task.description,
        task,
      })) || [],
    [availableDependencies],
  );

  return (
    <Autocomplete
      inputValue={inputValue}
      autoHighlight
      options={options}
      loading={isLoadingDependencies}
      getOptionLabel={prop('label')}
      onInputChange={handleInputChange}
      onChange={handleSelection}
      onOpen={getAvailableDependencies}
      clearOnBlur={false}
      disableClearable
      forcePopupIcon={false}
      noOptionsText="No dependencies found"
      renderInput={({ inputProps, InputProps: rootProps }) => (
        <div {...rootProps}>
          <QuickAddTaskInputWrapper
            placeholder="Add a dependency"
            isFocused={isFocused}
            hasInputValue={!!inputValue}
          >
            <StyledInput
              {...inputProps}
              onFocus={event => {
                setFocused();
                if (typeof inputProps.onFocus === 'function')
                  inputProps.onFocus(event);
              }}
              onBlur={event => {
                unsetFocused();
                if (typeof inputProps.onBlur === 'function')
                  inputProps.onBlur(event);
              }}
            />
          </QuickAddTaskInputWrapper>
        </div>
      )}
    />
  );
};

export default DependenciesAutocomplete;
