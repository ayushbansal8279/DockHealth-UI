import React, { useEffect, useState } from 'react';

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
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import CheckedCircle from 'img/Checks-Radio-Buttons-Checked.svg';
import BlankCircle from 'img/Checks-Radio-Buttons-Blank.svg';
import Spacing from '../../common/Spacing';
import { getUniqueQuickFilterLabelName } from '../CustomFilters/helpers';

const SaveFilterPopup = ({
  isSavePopupOpen,
  setSavePopupOpen,
  refrence,
  finalFilter,
  quickFiltersList,
  onQuickFilterCreate,
  onQuickFilterUpdate,
  quickFilterIdentifier,
  setQuickFilterIdentifier,
}) => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [onlyone, setOnlyone] = useState(true);
  const [everyOne, setEveryOne] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (quickFilterIdentifier !== '') {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [quickFilterIdentifier]);

  useEffect(() => {
    if (edit) {
      quickFiltersList.map((item) => {
        if (item.quickFilterIdentifier === quickFilterIdentifier) {
          setSearchInputValue(item.name);
        }
      });
    } else {
      setSearchInputValue(getUniqueQuickFilterLabelName(quickFiltersList));
    }
  }, [quickFiltersList, quickFilterIdentifier, edit]);

  const toggleSharedList = () => {
    setEveryOne(true);
    setOnlyone(false);
  };
  const togglePrivateList = () => {
    setEveryOne(false);
    setOnlyone(true);
  };

  const handleQuickFilterCreate = () => {
    const data = {};
    for (const key in finalFilter) {
      if (finalFilter[key].length > 0) {
        data[key] = { options: finalFilter[key].map((item) => item.key) };
      }
    }
    onQuickFilterCreate(searchInputValue, data);
    setSavePopupOpen(false);
  };

  const handleQuickFilterUpdate = () => {
    onQuickFilterUpdate(quickFilterIdentifier, searchInputValue);
    setSavePopupOpen(false);
    setQuickFilterIdentifier('');
    setEdit(false);
  };

  const handleClear = () => {
    setSavePopupOpen(false);
    setEdit(false);
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
      anchorEl={refrence.current}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={isSavePopupOpen}
      sx={{ left: '60px' }}
      onClose={() => setSavePopupOpen(false)}
    >
      <Container>
        <Header>
          <Title>{edit ? 'Edit Filter' : 'Save Filter'}</Title>
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
          <CancelButton onClick={handleClear} style={{ width: '270px' }}>
            Cancel
          </CancelButton>
          <ConfirmButton
            disabled={searchInputValue === ''}
            style={{ width: '270px' }}
            onClick={edit ? handleQuickFilterUpdate : handleQuickFilterCreate}
          >
            {edit ? ' Update' : 'Save'}
          </ConfirmButton>
        </ButtonContainer>
      </Container>
    </Popover>
  );
};

export default SaveFilterPopup;
