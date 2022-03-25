import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import { prop } from 'ramda';
import { Box, ListItemText } from '@material-ui/core';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  ModalHeader,
  ModalDescription,
} from '../styled';
import { useAutocompleteStyles } from './styled';

const ShareTaskModal = props => {
  const { closeModal, taskIdentifiers } = props;
  const [inputValue, setInputValue] = useState('');

  console.log('taskIdentifiers', taskIdentifiers);

  const handleInputChange = event => {
    setInputValue(event?.target?.value || '');
  };

  const classes = useAutocompleteStyles();

  const options = [{ test: 'Test1' }, { test: 'Test2' }];

  return (
    <ModalWrapperWithPadding width="600px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Share tasks</ModalHeader>
      <ModalDescription>
        Copy here about what happens when you share the task
      </ModalDescription>
      <Box m={2} />
      <Autocomplete
        inputValue={inputValue}
        getOptionLabel={prop('test')}
        renderOption={option => (
          <Box width="100%" display="flex" justifyContent="space-between">
            <ListItemText>{option.test}</ListItemText>
            ble
          </Box>
        )}
        // loading
        options={options}
        classes={classes}
        onInputChange={handleInputChange}
        renderInput={({ inputProps, InputProps: rootProps }) => (
          <div {...rootProps}>
            <input
              placeholder="Type the name of the person or group  to invite"
              {...inputProps}
            />
          </div>
        )}
        noOptionsText={
          <AddRecordOption searchValue={inputValue} onClick={() => {}} />
        }
      />
    </ModalWrapperWithPadding>
  );
};

export default ShareTaskModal;
