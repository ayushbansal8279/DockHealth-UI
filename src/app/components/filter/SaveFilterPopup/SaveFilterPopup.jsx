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
import NewFilterContainer from '../NewFilterContainer/NewFilterContainer';

const SaveFilterPopup = ({
  isSavePopupOpen,
  setSavePopupOpen,
  refrence,
  finalFilter,
  quickFiltersList,
  onQuickFilterCreate,
  onQuickFilterUpdate,
  editIdentifier,
  setEditIdentifier,
  filters,
  onSelectedFiltersChange,
  menuOptions,
  setMenuOption,
  setFinalFilter,
  openPopover,
  handleSaveQuickFilter,
  filteredData,
  setFilteredData,
  onSelectFilters,
  setCustomFinalFilter,
  customFinalFilter,
  setSelectedQuickFilter,
  customFilteredData,
  setCustomFilteredData,
}) => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [onlyone, setOnlyone] = useState(true);
  const [everyOne, setEveryOne] = useState(false);
  const [isQuickFilterEdit, setIsQuickFilterEdit] = useState(false);

  useEffect(() => {
    if (editIdentifier !== '') {
      setIsQuickFilterEdit(true);
    } else {
      setIsQuickFilterEdit(false);
    }
  }, [editIdentifier]);

  useEffect(() => {
    if (isQuickFilterEdit) {
      quickFiltersList.map((item) => {
        if (item.quickFilterIdentifier === editIdentifier) {
          setSearchInputValue(item.name);
        }
      });
    } else {
      setSearchInputValue(getUniqueQuickFilterLabelName(quickFiltersList));
    }
  }, [quickFiltersList, editIdentifier, isQuickFilterEdit]);

  const updateFilter = () => {
    const data = {};
    for (const key in customFinalFilter) {
      if (customFinalFilter[key].length > 0) {
        data[key] = { options: customFinalFilter[key].map((item) => item.key) };
      }
    }
    handleSaveQuickFilter(editIdentifier, data);
  };

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
    onQuickFilterUpdate(editIdentifier, searchInputValue);
    updateFilter();
    setEditIdentifier('');
    setSavePopupOpen(false);
  };

  const handleClear = () => {
    setEditIdentifier('');
    setSavePopupOpen(false);
  };

  const onPopoverClose = () => {
    setEditIdentifier('');
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
      onClose={onPopoverClose}
    >
      <Container>
        <Header>
          <Title>{isQuickFilterEdit ? 'Edit Filter' : 'Save Filter'}</Title>
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
        {isQuickFilterEdit && (
          <div style={{ margin: '20px 0 0 40px' }}>
            <NewFilterContainer
              filters={filters}
              onSelectedFiltersChange={onSelectFilters}
              setFinalFilter={setCustomFinalFilter}
              finalFilter={customFinalFilter}
              setMenuOption={setMenuOption}
              menuOptions={menuOptions}
              openPopover={openPopover}
              quickFiltersList={quickFiltersList}
              setSavePopupOpen={setSavePopupOpen}
              onQuickFilterCreate={onQuickFilterCreate}
              handleSaveQuickFilter={handleSaveQuickFilter}
              setFilteredData={setCustomFilteredData}
              filteredData={customFilteredData}
              isQuickFilterEdit={isQuickFilterEdit}
              customFinalFilter={customFinalFilter}
            ></NewFilterContainer>
          </div>
        )}
        <ButtonContainer>
          <CancelButton onClick={handleClear} style={{ width: '270px' }}>
            Cancel
          </CancelButton>
          <ConfirmButton
            disabled={searchInputValue === ''}
            style={{ width: '270px' }}
            onClick={
              isQuickFilterEdit
                ? handleQuickFilterUpdate
                : handleQuickFilterCreate
            }
          >
            {isQuickFilterEdit ? ' Update' : 'Save'}
          </ConfirmButton>
        </ButtonContainer>
      </Container>
    </Popover>
  );
};

export default SaveFilterPopup;
