import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useBoolean } from 'hooks/useBoolean';
import moment from 'moment';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { getCustomerUniqueIDShortLabel } from 'helpers/customer-type-helper';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { PATIENTS_LIST_ALL } from 'routing/helpers/paths';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import { FieldType } from 'helpers/field-type-helpers';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import PatientDetailsDrawer from '../PatientDetailsDrawer/PatientDetailsDrawer';
import PatientDetailsLoader from '../PatientDetailsLoader/PatientDetailsLoader';
import LuminaStar from 'img/AI/LuminaStar';
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
  AISummaryImageWrapper,
} from './styled';
import palette from '@/app/styles/palette';
import { useDispatch } from 'react-redux';
import { openModal } from '@/app/modal/actions';

const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientDetailsHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen, unsetIsDrawerOpen] = useBoolean(false);
  const patient = useSelector(patientSelector);
  const {
    firstName,
    middleName,
    lastName,
    email,
    phoneMobile,
    phoneHome,
    age,
    dob,
    mrn,
    gender,
    genderIdentity,
  } = patient || {};
  const isFetchingPatient = useSelector(isFetchingPatientSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(
    currentUser,
    currentOrganization,
  );
  const organization = useSelector(organizationSelector);
  const emrPatientLink = organization?.emrPatientLink;
  const isLoadingDetails = isFetchingPatient || !patient;
  const [cameFrom, setCameFrom] = useState();
  const taskListRestrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const genderIdentityDisabled =
    currentOrganization?.disabledFeatures?.includes('PATIENT_GENDER') || false;
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;
  const [isAiIconHovered, setAiIconHovered] = useState(false);
  const dispatch = useDispatch();

  const goBack = useCallback(() => {
    if (cameFrom) {
      history.push(cameFrom);
    } else {
      history.push(PATIENTS_LIST_ALL);
    }
  }, [cameFrom, history]);

  useEffect(() => {
    if (location?.state?.from) setCameFrom(location.state.from);
  }, [location]);

  return (
    <PatientDetailsContainer>
      {isLoadingDetails ? (
        <Box pl="30px">
          <PatientDetailsLoader />
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center">
            <Box flex="1 0 0" display="flex" alignItems="center">
              <Grid container alignItems="center">
                <Box flexBasis={30}>
                  {(!embeddedMode || cameFrom) && (
                    <button type="button" onClick={goBack}>
                      <img
                        src={ArrowLeftIcon}
                        alt="back-navigation"
                        style={{ width: '16px' }}
                      />
                    </button>
                  )}
                </Box>
                <PatientName>
                  {[`${lastName},`, firstName, middleName].join(' ')}
                </PatientName>
                <Tooltip placement="top" title="AI Summary">
                  <AISummaryImageWrapper
                    onMouseEnter={() => setAiIconHovered(true)}
                    onMouseLeave={() => setAiIconHovered(false)}
                    onClick={() =>
                      dispatch(
                        openModal('PatientAISummary', {
                          patient: patient,
                        }),
                      )
                    }
                  >
                    <LuminaStar
                      color={
                        isAiIconHovered
                          ? palette.newBrightBlue
                          : palette.lightGrayishBlue
                      }
                    />
                  </AISummaryImageWrapper>
                </Tooltip>
                <Box mx={1} />
                {taskListRestrictions?.createTask !== DISABLED && (
                  <ButtonContainer onClick={setIsDrawerOpen}>
                    <PatientDetailsLabel>View details</PatientDetailsLabel>
                  </ButtonContainer>
                )}
                <Box mx={1} />
                <Box flex="500px 0 0">
                  {patient?.patientLabels?.map(
                    ({ labelIdentifier, labelName }) => (
                      <Box
                        key={Math.random() + 1000}
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
          <PatientDetails>
            <PatientDetailsInformation>
              {(age || gender || dob) && !embeddedMode && (
                <>
                  <PatientInfo>
                    {dob && `${moment(dob).format('MMM D, YYYY')} | `}
                    {age && `${age} | `}
                    {gender && `${gender?.charAt(0)?.toUpperCase()}`}
                  </PatientInfo>
                  {!genderIdentityDisabled && genderIdentity && (
                    <>
                      <PatientInfoDivider />
                      <PatientInfo>Gender: {genderIdentity}</PatientInfo>
                    </>
                  )}
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
              {patient?.patientMetaData
                ?.filter(
                  (meta) =>
                    meta.displayOptions?.includes('PATIENT_HEADER') &&
                    (meta.value || meta.displayNames),
                )
                .map(
                  ({
                    customFieldName,
                    displayName,
                    value,
                    displayNames,
                    fieldType,
                    customFieldIdentifier,
                  }) => {
                    return (
                      <React.Fragment key={customFieldIdentifier}>
                        {fieldType === FieldType.HYPERLINK ? (
                          <PatientInfo>
                            <a href={value} target="_blank" rel="noreferrer">
                              {customFieldName}
                            </a>
                          </PatientInfo>
                        ) : (
                          <PatientInfo>
                            <Typography>{customFieldName}: </Typography>
                            <Box ml={1} />
                            {fieldType === FieldType.DROPDOWN_MULTI
                              ? `${displayNames?.join(',') || ''}`
                              : `${displayName || value}`}
                          </PatientInfo>
                        )}
                        <PatientInfoDivider />
                      </React.Fragment>
                    );
                  },
                )}
            </PatientDetailsInformation>
          </PatientDetails>
          <PatientDetails>
            <PatientDetailsInformation>
              {patient?.patientMetaData?.map(
                ({
                  customFieldName,
                  displayName,
                  value,
                  contextType,
                  customFieldIdentifier,
                }) => (
                  <React.Fragment key={customFieldIdentifier}>
                    {contextType === 'PREDEFINED' && value && (
                      <>
                        <PatientInfo>
                          {customFieldName}: {displayName || value}
                        </PatientInfo>
                        <PatientInfoDivider />
                      </>
                    )}
                  </React.Fragment>
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
      )}
    </PatientDetailsContainer>
  );
};

export default PatientDetailsHeader;
