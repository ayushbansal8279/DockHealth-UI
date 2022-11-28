import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { downloadPatientImportTemplate } from 'api/patient-api';

import Spacing from 'components/common/Spacing';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import ExcelLogo from 'img/excel-logo.svg';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import {
  EmptyListContainer,
  EmptyListHeader,
  EmptyListContent,
  StyledButton,
  DownloadTemplate,
  DownloadIcon,
} from './styled';

const EmptyPatientsList = ({
  onAddPatientClick,
  importPopupOpen,
  setImportPopupOpen,
  setImportPopoverOpen,
  refreshPatientList,
}) => {
  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <>
      <EmptyListContainer>
        <div>
          <EmptyListHeader>
            Import your {customerTypeLabel} list and easily track their tasks.
          </EmptyListHeader>
          <EmptyListContent>
            Your {customerTypeLabel} list is safe with us. Only people who you
            invite to your organization will have access.
            <p />
            <StyledButton
              variant="contained"
              onClick={() => {
                setImportPopupOpen(true);
              }}
            >
              IMPORT {customerTypeLabel.toUpperCase()} LIST
            </StyledButton>
            <Spacing horizontal={4} />
            <StyledButton variant="outlined" onClick={onAddPatientClick}>
              ADD A {customerTypeLabel.toUpperCase()}
            </StyledButton>
            <Spacing vertical={5} />
            <div style={{ marginTop: '20px' }}>
              <DownloadTemplate
                onClick={() => {
                  downloadPatientImportTemplate();
                }}
              >
                <DownloadIcon src={ExcelLogo} alt="Excel Logo" />
                Download Excel {customerTypeLabelCapitalized} Template
              </DownloadTemplate>
            </div>
          </EmptyListContent>
        </div>

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
};

export default EmptyPatientsList;
