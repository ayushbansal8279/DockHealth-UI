import { Grid, Dialog } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { downloadPatientImportTemplate } from 'api/patient-api';

import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import useBoolean from 'hooks/useBoolean';
import SearchInput from 'components/common/SearchInput/SearchInput';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { SearchInputWrapper, Container, ImportButton } from './styled';

const PatientsToolbar = ({
  hasPatients,
  refreshPatientList,
  setImportPopoverOpen,
  isGuest,
  searchValue,
  onSearchChange,
  onAddPatientClick,
  hideButtons,
}) => {
  const [
    isSearchFocused,
    setIsSearchFocused,
    unsetIsSearchFocused,
  ] = useBoolean(false);

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser).toUpperCase();

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  return (
    <Container>
      <Grid
        container
        item
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
      >
        <Grid item xs={6} xl={6} md={5} lg={4}>
          <SearchInputWrapper fullWidth={isSearchFocused || searchValue}>
            <SearchInput
              value={searchValue}
              onValueChange={onSearchChange}
              onFocus={setIsSearchFocused}
              onBlur={unsetIsSearchFocused}
            />
          </SearchInputWrapper>
        </Grid>
        <Grid
          container
          item
          xs={6}
          xl={7}
          md={5}
          lg={4}
          justify="flex-end"
          alignItems="center"
          wrap="nowrap"
          spacing={2}
        >
          {hasPatients && !isGuest && !hideButtons && (
            <>
              <Grid item>
                <ImportButton
                  onClick={() => {
                    setImportPopupOpen(true);
                  }}
                >
                  IMPORT {customerTypeLabel}S FROM EXCEL
                </ImportButton>
              </Grid>
              <Grid item>
                <AdornedButton
                  adornment={<AddIcon />}
                  onClick={onAddPatientClick}
                >
                  ADD A {customerTypeLabel}
                </AdornedButton>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={importPopupOpen}
        onClose={() => setImportPopupOpen(false)}
        PaperProps={{
          elevation: 0,
          square: true,
          style: {},
        }}
      >
        <ImportPatientsModal
          closeModal={() => {
            setImportPopupOpen(false);
          }}
          downloadTemplate={downloadPatientImportTemplate}
          setImportPopoverOpen={setImportPopoverOpen}
          refreshPatientList={refreshPatientList}
          step={1}
        />
      </Dialog>
    </Container>
  );
};

export default PatientsToolbar;
