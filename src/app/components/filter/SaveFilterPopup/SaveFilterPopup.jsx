import React, { useEffect, useState } from 'react';

import { Popover, TextField } from '@mui/material';
import CheckedCircle from 'img/Checks-Radio-Buttons-Checked.svg';
import BlankCircle from 'img/Checks-Radio-Buttons-Blank.svg';
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
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import Spacing from '../../common/Spacing';
import { getUniqueQuickFilterLabelName } from '../CustomFilters/helpers';
import NewFilterContainer from '../NewFilterContainer/NewFilterContainer';
import palette from '@/app/styles/palette';

const SaveFilterPopup = ({
  isSavePopupOpen,
  setSavePopupOpen,
  refrence,
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
  onSelectFilters,
  setCustomFinalFilter,
  customFinalFilter,
  setSelectedQuickFilter,
  customFilteredData,
  setCustomFilteredData,
  selectedCustomFilter,
  selectedQuickFilter,
  selectQuickFilter,
  isPatientListPage,
}) => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [quickfilterName, setQuickfilterName] = useState('');
  const [onlyone, setOnlyone] = useState(true);
  const [everyOne, setEveryOne] = useState(false);
  const [isQuickFilterEdit, setIsQuickFilterEdit] = useState(false);

  useEffect(() => {
    if (editIdentifier !== '' && editIdentifier !== undefined) {
      quickFiltersList.map((item) => {
        if (item.quickFilterIdentifier === editIdentifier) {
          setSearchInputValue(item.name);
          setQuickfilterName(item.name);
          setIsQuickFilterEdit(true);
        }
      });
    } else {
      setSearchInputValue(getUniqueQuickFilterLabelName(quickFiltersList));
      setIsQuickFilterEdit(false);
    }
  }, [quickFiltersList, editIdentifier, isQuickFilterEdit]);

  // If we need the disable option later
  // const [isDisable, setDisable] = useState(false);
  // useEffect(() => {
  //   const isFilterOptionsSame =
  //     isQuickFilterEdit &&
  //     JSON.stringify(selectedCustomFilter) ===
  //       JSON.stringify(customFinalFilter);

  //   const isQuickfilterNameSame =
  //     quickfilterName && searchInputValue === quickfilterName;

  //   setDisable(
  //     searchInputValue === '' || (isFilterOptionsSame && isQuickfilterNameSame),
  //   );
  // }, [
  //   isQuickFilterEdit,
  //   selectedCustomFilter,
  //   customFinalFilter,
  //   searchInputValue,
  // ]);

  const updateFilter = () => {
    handleSaveQuickFilter(editIdentifier, customFilteredData);
    if (selectedQuickFilter === editIdentifier) {
      selectQuickFilter(editIdentifier, customFilteredData);
    }
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
    onQuickFilterCreate(searchInputValue, filteredData);
    setSavePopupOpen(false);
    setFinalFilter({});
  };

  const handleQuickFilterUpdate = () => {
    !isPatientListPage && onQuickFilterUpdate(editIdentifier, searchInputValue);
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
            {/* <img
              onClick={toggleSharedList}
              src={everyOne ? CheckedCircle : BlankCircle}
            />
            <Spacing horizontal={3} />
            <CheckboxDescription>Everyone</CheckboxDescription> */}
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
            />
          </div>
        )}
        <ButtonContainer>
          <CancelButton onClick={handleClear} style={{ width: '270px' }}>
            Cancel
          </CancelButton>
          <ConfirmButton
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
