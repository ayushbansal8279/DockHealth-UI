import React, { useState } from 'react';

import {
  Container,
  Header,
  Title,
  CheckboxContainer,
  CheckboxDescription,
  PrivacyContainer,
  PrivacyTitle,
  InputContainer,
  ButtonContainer,
} from './styled';
import { Popover, TextField } from '@mui/material';
import FormInput from 'components/common/Input/FormInput';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import CheckedCircle from 'img/Checks-Radio-Buttons-Checked.svg';
import BlankCircle from 'img/Checks-Radio-Buttons-Blank.svg';
import Spacing from '../../common/Spacing';
import { useDispatch, useSelector } from 'react-redux';
import { createQuickFilter } from '@/app/api/mega-filter-api';
import { getUniqueQuickFilterLabelName } from '../CustomFilters/helpers';
import { currentTaskListSelector } from '@/app/selectors/task-list-selectors';

const SaveFilterPopup = ({
  isSavePopupOpen,
  setSavePopupOpen,
  refrence,
  finalFilter,
  quickFiltersList,
}) => {
  const [searchInputValue, setSearchInputValue] = useState(
    getUniqueQuickFilterLabelName(quickFiltersList),
  );
  const [onlyone, setOnlyone] = useState(true);
  const [everyOne, setEveryOne] = useState(false);
  const taskList = useSelector(currentTaskListSelector);
  const { taskListIdentifier } = taskList || {};

  const dispatch = useDispatch();

  const toggleSharedList = () => {
    setEveryOne(true);
    setOnlyone(false);
  };
  const togglePrivateList = () => {
    setEveryOne(false);
    setOnlyone(true);
  };

  // console.log(typeof(getUniqueQuickFilterLabelName(quickFiltersList)));

  const handleQuickFilterCreate = () => {
    // setSavePopupOpen(false);
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        data[key] = { options: finalFilter[key].map((item) => item.key) };
      }
    }

    console.log(searchInputValue);
    console.log(data);
    console.log(taskListIdentifier);
    const contextType = 'MY_TASKS';
    dispatch(
      createQuickFilter(
        'Aditya',
        taskListIdentifier ? { taskListIdentifier } : { contextType },
        data,
      ),
    );
  };

  const onClear = () => {
    setSavePopupOpen(false);
  };

  const sx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'grey',
    },
  };

  const inputStyle = {
    style: {
      textTransform: 'none',
    },
  };

  return (
    <Popover
      anchorEl={refrence}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isSavePopupOpen}
      sx={{ top: '120px', left: '68px' }}
      onClose={() => setSavePopupOpen(false)}
    >
      <Container>
        <Header>
          <Title>Save Filter</Title>
        </Header>
        <InputContainer>
          <TextField
            variant="outlined"
            label="Filter Name"
            value={searchInputValue}
            InputLabelProps={inputStyle}
            sx={sx}
            onChange={(event) => setSearchInputValue(event.target.value)}
          />
        </InputContainer>

        <PrivacyContainer>
          <PrivacyTitle>Privacy</PrivacyTitle>
          <CheckboxContainer>
            <img
              onClick={togglePrivateList}
              src={onlyone ? CheckedCircle : BlankCircle}
            />
            <Spacing horizontal={3} />
            <CheckboxDescription>Only You</CheckboxDescription>
            <img
              onClick={toggleSharedList}
              src={everyOne ? CheckedCircle : BlankCircle}
            />
            <Spacing horizontal={3} />
            <CheckboxDescription>Everyone</CheckboxDescription>
          </CheckboxContainer>
        </PrivacyContainer>
        <ButtonContainer>
          <CancelButton
            // disabled={Object.keys(finalFilter).length === 0}
            onClick={onClear}
            style={{ width: '270px' }}
          >
            Cancel
          </CancelButton>
          <ConfirmButton
            // disabled={Object.keys(finalFilter).length === 0}
            style={{ width: '270px' }}
            onClick={handleQuickFilterCreate}
          >
            Save
          </ConfirmButton>
        </ButtonContainer>
      </Container>
    </Popover>
  );
};

export default SaveFilterPopup;
