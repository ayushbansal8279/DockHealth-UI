import { Grid, Dialog } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { downloadPatientImportTemplate } from 'api/patient-api';

import Button from 'components/common/Button/Button';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import useBoolean from 'hooks/useBoolean';
import SearchInput from 'components/common/SearchInput/SearchInput';
import { SearchInputWrapper, Container } from './styled';

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

  const [importPopupOpen, setImportPopupOpen] = useState(false);

  return (
    <Container>
      <Grid
        container
        item
        justify="space-between"
        alignItems="center"
        wrap="nowrap"
        spacing={6}
      >
        <Grid item xs={5} xl={4}>
          <SearchInputWrapper fullWidth={isSearchFocused || searchValue}>
            <SearchInput
              value={searchValue}
              onValueChange={onSearchChange}
              onFocus={setIsSearchFocused}
              onBlur={unsetIsSearchFocused}
            />
          </SearchInputWrapper>
        </Grid>
        {hasPatients && !isGuest && !hideButtons && (
          <Grid
            container
            item
            xs={7}
            justify="flex-end"
            alignItems="center"
            wrap="nowrap"
            spacing={3}
          >
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setImportPopupOpen(true);
                }}
              >
                IMPORT PATIENTS FROM EXCEL
              </Button>
            </Grid>
            <Grid item>
              <AdornedButton
                adornment={<AddIcon />}
                onClick={onAddPatientClick}
              >
                ADD A PATIENT
              </AdornedButton>
            </Grid>
          </Grid>
        )}
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
