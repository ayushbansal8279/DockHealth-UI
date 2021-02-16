import React from 'react';
import { Dialog } from '@material-ui/core';
import { downloadPatientImportTemplate } from 'api/patient-api';

import Spacing from 'components/common/Spacing';
import PatientImportAnimals from 'img/animals/PatientImportAnimals.svg';
import ExcelLogo from 'img/excel-logo.svg';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import {
  EmptyListContainer,
  EmptyListHeader,
  EmptyListContent,
  StyledButton,
  DownloadTemplate,
  DownloadIcon,
  ImportAnimals,
} from './styled';

const EmptyPatientsList = ({
  onAddPatientClick,
  importPopupOpen,
  setImportPopupOpen,
  setImportPopoverOpen,
  refreshPatientList,
}) => (
  <>
    <EmptyListContainer>
      <div>
        <EmptyListHeader>
          Import your patient list and easily track their tasks.
        </EmptyListHeader>
        <EmptyListContent>
          Your patient list is safe with us. Only people who you invite to your
          organization will have access.
          <p />
          <StyledButton
            variant="contained"
            onClick={() => {
              setImportPopupOpen(true);
            }}
          >
            IMPORT PATIENT LIST
          </StyledButton>
          <Spacing horizontal={4} />
          <StyledButton variant="outlined" onClick={onAddPatientClick}>
            ADD A PATIENT
          </StyledButton>
          <Spacing vertical={5} />
          <div style={{ marginTop: '20px' }}>
            <DownloadTemplate
              onClick={() => {
                downloadPatientImportTemplate();
              }}
            >
              <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
              Download Excel Patient Template
            </DownloadTemplate>
          </div>
        </EmptyListContent>
      </div>
      <ImportAnimals src={PatientImportAnimals} alt="empty view" />

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
    </EmptyListContainer>
  </>
);

export default EmptyPatientsList;
