import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { Box, Chip, Grid } from '@material-ui/core';
import { getCustomerUniqueIDShortLabel } from 'helpers/customer-type-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { userProfileSelector } from 'selectors/user-selectors';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import { concat } from 'ramda';
import PatientDetailsDrawer from '../PatientDetailsDrawer/PatientDetailsDrawer';
import PatientDetailsLoader from '../PatientDetailsLoader/PatientDetailsLoader';
import EditorLink from '../../../components/common/TextEditor/EditorLink/EditorLink';
import {
  PatientDetailsContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetailsInformation,
  PatientDetails,
  PatientDetailsLabel,
  ButtonContainer,
  IconWrapper,
  ContactContainer,
  PatientMRNAnchor,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientDetailsHeader = () => {
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen, unsetIsDrawerOpen] = useBoolean(false);
  const patient = useSelector(patientSelector);
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    dob,
    age,
    mrn,
    gender,
    genderIdentity,
  } = patient || {};
  const isFetchingPatient = useSelector(isFetchingPatientSelector);
  const currentUser = useSelector(userProfileSelector);
  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(currentUser);
  const organization = useSelector(organizationSelector);
  const emrPatientLink = organization?.emrPatientLink;

  const isLoadingDetails = isFetchingPatient || !patient;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function validURL(string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(string);
  }

  const validLinkGenerator = value => {
    if (value.includes('https')) {
      return value;
    }
    if (value.includes('http')) {
      return value;
    }
    return concat('https://', value);
  };

  const CreatePatientInfoElement = ({
    customFieldName,
    displayName,
    value,
  }) => {
    const displayedValue = displayName || value;
    return (
      <>
        <PatientInfo>
          {customFieldName}:{' '}
          {validURL(displayedValue) ? (
            <EditorLink
              href={validLinkGenerator(displayedValue)}
              target="_blank"
            >
              {displayedValue}
            </EditorLink>
          ) : (
            displayedValue
          )}
        </PatientInfo>
        <PatientInfoDivider />
      </>
    );
  };

  return (
    <PatientDetailsContainer>
      {!isLoadingDetails ? (
        <>
          <Box display="flex" alignItems="center">
            <Box flex="1 0 0" display="flex" alignItems="center">
              <Grid container alignItems="center">
                <Box flexBasis={30}>
                  <button type="button" onClick={history.goBack}>
                    <img
                      src={ArrowLeftIcon}
                      alt="back-navigation"
                      style={{ width: '16px' }}
                    />
                  </button>
                </Box>
                <PatientName>
                  {[`${lastName},`, firstName, middleName].join(' ')}
                </PatientName>
                <Box mx={1} />
                <ButtonContainer onClick={setIsDrawerOpen}>
                  <PatientDetailsLabel>View details</PatientDetailsLabel>
                </ButtonContainer>
                <Box mx={1} />
                <Box flex="500px 0 0">
                  {patient?.patientLabels?.map(
                    ({ labelIdentifier, labelName }) => (
                      <Box
                        key={labelIdentifier}
                        display="inline-block"
                        py="1px"
                      >
                        <Chip label={labelName} />
                      </Box>
                    ),
                  )}
                </Box>
              </Grid>
            </Box>
            <ContactContainer>
              {email && (
                <Tooltip title={email} placement="bottom">
                  <IconWrapper href={`mailto:${email}`}>
                    <img
                      src={EmailIcon}
                      alt="email icon"
                      style={{ height: '16px' }}
                    />
                  </IconWrapper>
                </Tooltip>
              )}
              {phoneHome && (
                <Tooltip title={phoneHome} placement="bottom">
                  <IconWrapper href={`tel:${phoneHome}`}>
                    <img
                      src={PhoneIcon}
                      alt="phone icon"
                      style={{ height: '16px' }}
                    />
                  </IconWrapper>
                </Tooltip>
              )}
              {phoneMobile && (
                <Tooltip title={phoneMobile} placement="bottom">
                  <IconWrapper href={`tel:${phoneMobile}`}>
                    <img
                      src={MobileIcon}
                      alt="mobile phon icon"
                      style={{ height: '16px' }}
                    />
                  </IconWrapper>
                </Tooltip>
              )}
            </ContactContainer>
          </Box>
          {(dob || age || gender || mrn) && (
            <PatientDetails>
              <PatientDetailsInformation>
                {(age || gender) && (
                  <>
                    <PatientInfo>
                      {age && `${age} `}
                      {gender && `${gender?.charAt(0)?.toUpperCase()}`}
                      {genderIdentity &&
                        `, ${genderIdentity?.charAt(0)?.toUpperCase()} `}
                    </PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
                {mrn && (
                  <>
                    {!emrPatientLink && (
                      <PatientInfo>
                        {uniqueIdentifierLabel}# {mrn}
                      </PatientInfo>
                    )}
                    {emrPatientLink && (
                      <PatientInfo>
                        {uniqueIdentifierLabel}#{' '}
                        <PatientMRNAnchor
                          href={emrPatientLink.replace('{mrn}', mrn)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {mrn}
                        </PatientMRNAnchor>
                      </PatientInfo>
                    )}
                    <PatientInfoDivider />
                  </>
                )}
                {patient?.patientMetaData?.map(
                  ({ customFieldName, displayName, value, displayOptions }) => (
                    <>
                      {displayOptions?.includes('PATIENT_HEADER') && value && (
                        <CreatePatientInfoElement
                          customFieldName={customFieldName}
                          displayName={displayName}
                          value={value}
                        />
                      )}
                    </>
                  ),
                )}
              </PatientDetailsInformation>
            </PatientDetails>
          )}
          <PatientDetails>
            <PatientDetailsInformation>
              {patient?.patientMetaData?.map(
                ({ customFieldName, displayName, value, contextType }) => (
                  <>
                    {contextType === 'PREDEFINED' && value && (
                      <CreatePatientInfoElement
                        customFieldName={customFieldName}
                        displayName={displayName}
                        value={value}
                      />
                    )}
                  </>
                ),
              )}
            </PatientDetailsInformation>
          </PatientDetails>
          <PatientDetailsDrawer
            patient={patient}
            isOpenedDetails={isDrawerOpen}
            closeDetails={unsetIsDrawerOpen}
          />
        </>
      ) : (
        <Box pl="30px">
          <PatientDetailsLoader />
        </Box>
      )}
    </PatientDetailsContainer>
  );
};

export default PatientDetailsHeader;
