import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { useMount } from 'react-use';
import { Dialog } from '@material-ui/core';
import styled from 'styled-components';
import {
  beginPatientCreation,
  highlightPatient,
  downloadPatientImportTemplate,
} from 'actions/patient-actions';
import PatientsDetailsIcon from 'img/details.svg';
import PatientsEmptyIcon from 'img/patients-empty.svg';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import PatientImportAnimals from 'img/animals/PatientImportAnimals.svg';
import ExcelLogo from 'img/ExcelLogo.svg';
import ImportPatientsModal from 'modal/components/ImportPatientsModal/ImportPatientsModal';
import PatientImportPopover from './PatientImportPopover';

const EmptyListContainer = styled.div`
  padding: 2rem;
  text-align: center;
  flex: 1;
`;

const EmptyListIcon = styled.div`
  display: inline-block;
  margin-bottom: 21px;
  height: 71px;
  width: 47px;
`;

const EmptyListHeader = styled.div`
  position: absolute;
  width: 441px;
  hegiht: 82px;
  left: 106px;
  top: 162px;

  font-family: Montserrat;
  font-size: ${fontSizes.large};
  line-height: 153%;
  text-align: left;
`;

const EmptyListContent = styled.div`
  position: absolute;
  width: 513px;
  height: 42px;
  left: 106px;
  top: 264px;

  font-family: Montserrat;
  font-size: ${fontSizes.regular};
  line-height: 130%;
  text-align: left;
`;

const StyledButton = styled(Button)`
  margin-right: 20px;
  width: 265px;
  height: 50px;
`;
const ImportAnimals = styled.img`
  position: absolute;
  width: 423px;
  height: 181.57px;
  left: 660px;
  top: 180.8px;
`;

const DownloadIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 7px;
`;

const DownloadTemplate = styled.a`
  font-family: Roboto Condensed;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regular};
  line-height: 19px;
`;

const EmptyList = ({
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

const EmptyFilteredList = () => (
  <EmptyListContainer>
    <EmptyListIcon>
      <img src={PatientsEmptyIcon} alt="Empty patients list" />
    </EmptyListIcon>
    <p>
      <strong>There are no matching patients.</strong>
    </p>
  </EmptyListContainer>
);

const NonEmptyListTable = styled.div`
  color: ${palette.unknownGrey1};
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 0.25rem;
  grid-template-columns: 1fr;
  margin: 2rem;
  ${props => props.highlightedPatient && 'margin-right: 0.25rem;'}
`;

const ListRow = styled.div`
  background: ${props =>
    props.isHighlighted ? palette.softCyan : palette.white};
  cursor: pointer;
  grid-template-columns: ${props =>
    props.isCompact ? '0.75fr 0.25fr' : '0.5fr 0.15fr 0.15fr 0.1fr 0.1fr 4rem'};
  display: grid;
  font-size: 1rem;
  height: 4rem;

  & > * {
    align-items: center;
    display: flex;
    padding-left: 1.75rem;
    overflow: hidden;

    &:first-child {
      padding-left: 2.75rem;
    }

    &:last-child {
      padding: 0 1rem;
    }
  }
`;

const ListHeader = styled(ListRow)`
  cursor: default;
  font-size: 0.875rem;
  font-weight: 600;
  height: 2rem;
  position: sticky;
  text-transform: uppercase;
  top: 0;
  z-index: 1;
`;

const StyledLink = styled(Link)`
  color: ${palette.lighterCyanBlue};
  filter: brightness(1);
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.25s ease-out;
  white-space: nowrap;

  &:hover {
    color: ${palette.lighterCyanBlue};
    filter: brightness(1.35);
  }
`;

const QuickViewCell = styled.div`
  align-items: center;
  color: ${palette.lighterCyanBlue};
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  justify-content: center;
`;

const QuickViewIcon = styled.img.attrs({
  src: PatientsDetailsIcon,
  alt: 'Show patient details',
})`
  width: 21px;
  height: 21px;
  max-width: none;
`;

const capitalize = text =>
  typeof text === 'string'
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : text;

const formatDateOfBirth = dob => dob && moment(dob).format('MMM D, YYYY');

const calculateAgeFromDateOfBirth = dob => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

const NonEmptyList = ({ patients, isCompact, highlightedPatient }) => {
  const dispatch = useDispatch();
  const selectPatient = useCallback(
    ({ patientIdentifier }) => () => {
      dispatch(highlightPatient(patientIdentifier));
    },
    [dispatch],
  );

  useMount(() => {
    selectPatient({ patientIdentifier: null });
  });

  return (
    <NonEmptyListTable
      listLength={patients?.length ?? 0}
      highlightedPatient={highlightedPatient}
    >
      <ListHeader isCompact={isCompact}>
        <div>Name</div>
        <div>MRN</div>
        {!isCompact && (
          <>
            <div>DOB</div>
            <div>Age</div>
            <div>Gender</div>
            <div>&nbsp;</div>
          </>
        )}
      </ListHeader>
      {patients.map(
        ({
          patientIdentifier,
          mrn,
          lastName,
          firstName,
          middleName,
          dob,
          gender,
        }) => (
          <ListRow
            key={patientIdentifier}
            isHighlighted={
              highlightedPatient &&
              patientIdentifier === highlightedPatient.patientIdentifier
            }
            isCompact={isCompact}
            onClick={selectPatient({ patientIdentifier })}
          >
            <div>
              <StyledLink to={`/patient/${patientIdentifier}`}>
                {`${capitalize(lastName) || '—'}, ${capitalize(firstName) ||
                  '—'} ${capitalize(middleName) || ''}`}
              </StyledLink>
            </div>
            <div>{mrn}</div>
            {!isCompact && (
              <>
                <div>{formatDateOfBirth(dob)}</div>
                <div>{calculateAgeFromDateOfBirth(dob)}</div>
                <div>{capitalize(gender)}</div>
                <QuickViewCell>
                  <QuickViewIcon
                    onClick={selectPatient({ patientIdentifier })}
                  />
                </QuickViewCell>
              </>
            )}
          </ListRow>
        ),
      )}
    </NonEmptyListTable>
  );
};

const PatientsList = ({
  patients,
  isFiltered,
  isCompact,
  highlightedPatient,
  patientImportDetails,
  refreshPatientList,
}) => {
  const dispatch = useDispatch();

  const [importPopupOpen, setImportPopupOpen] = useState(false);
  const [importPopoverOpen, setImportPopoverOpen] = useState(
    patientImportDetails && patientImportDetails.recordsProcessed,
  );

  const onAddPatientClick = useCallback(() => {
    dispatch(beginPatientCreation());
  }, [dispatch]);

  if (patients.length === 0) {
    return isFiltered ? (
      <EmptyFilteredList />
    ) : (
      <>
        <EmptyList
          onAddPatientClick={onAddPatientClick}
          importPopupOpen={importPopupOpen}
          setImportPopupOpen={setImportPopupOpen}
          setImportPopoverOpen={setImportPopoverOpen}
          refreshPatientList={refreshPatientList}
        />
        {importPopoverOpen && (
          <PatientImportPopover
            closePopover={() => {
              setImportPopoverOpen(false);
            }}
            patientImportDetails={patientImportDetails}
          />
        )}
      </>
    );
  }

  return (
    <>
      <NonEmptyList
        patients={patients}
        isCompact={isCompact}
        highlightedPatient={highlightedPatient}
      />
      {importPopoverOpen && (
        <PatientImportPopover
          closePopover={() => {
            setImportPopoverOpen(false);
          }}
          patientImportDetails={patientImportDetails}
        />
      )}
    </>
  );
};

export default PatientsList;
