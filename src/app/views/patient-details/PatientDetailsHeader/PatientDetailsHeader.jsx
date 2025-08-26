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
  userHasAiSummaryViewFeatureSelector,
  userHasProfileBuilderFeatureSelector,
  userHasPatientTimelineFeatureSelector,
} from 'selectors/user-selectors';
import { PATIENTS_LIST_ALL } from 'routing/helpers/paths';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  patientSelector,
  isFetchingPatientSelector,
} from 'selectors/patient-details-selectors';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import PatientDetailsDrawer from '../PatientDetailsDrawer/PatientDetailsDrawer';
import PatientDetailsLoader from '../PatientDetailsLoader/PatientDetailsLoader';
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
  AISummaryWrapper,
  ActivityHistoryButton,
  ActivityHistoryText,
} from './styled';
import AISummaryModalOpenerHelper from '@/app/modal/components/AISummaryModal/AISummaryModalOpenerHelper';
import { SummaryType } from '@/app/helpers/ai-helper';
import PatientMetaDataField from './PatientMetaDataField';
import ProfileDetailsDrawer from '../../profile-details/ProfileDetailsDrawer/ProfileDetailsDrawer';
import PatientActivityHistoryDrawer from '@/app/components/patients/PatientActivityHistoryDrawer/PatientActivityHistoryDrawer';

const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientDetailsHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen, unsetIsDrawerOpen] = useBoolean(false);
  const [isProfileOpen, setIsProfileOpen, unsetIsProfileOpen] =
    useBoolean(false);
  const [
    isactivityHistoryDrawerOpen,
    setIsactivityHistoryDrawerOpen,
    unsetIsactivityHistoryDrawerOpen,
  ] = useBoolean(false);
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
    patientStatus,
  } = patient || {};
  const isFetchingPatient = useSelector(isFetchingPatientSelector);
  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(
    currentUser,
    currentOrganization,
  );
  const organization = useSelector(organizationSelector);
  const aiSummaryAvailable = useSelector(userHasAiSummaryViewFeatureSelector);
  const emrPatientLink = organization?.emrPatientLink;
  const isLoadingDetails = isFetchingPatient || !patient;
  const [cameFrom, setCameFrom] = useState();
  const taskListRestrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const genderIdentityDisabled =
    currentOrganization?.disabledFeatures?.includes('PATIENT_GENDER') || false;
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;
  const profileBuilderFeatureAvailable = useSelector(
    userHasProfileBuilderFeatureSelector,
  );
  const patientTimelineFeatureAvailable = useSelector(
    userHasPatientTimelineFeatureSelector,
  );

  const goBack = useCallback(() => {
    if (cameFrom) {
      history.push({ pathname: cameFrom, state: { from: location?.pathname } });
    } else {
      history.push({
        pathname: PATIENTS_LIST_ALL,
        state: { from: location?.pathname },
      });
    }
  }, [cameFrom, history]);

  useEffect(() => {
    setCameFrom(location?.state?.from || localStorage.getItem('from'));
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
                <PatientName status={patientStatus}>
                  {[`${lastName},`, firstName, middleName].join(' ')}
                </PatientName>
                {aiSummaryAvailable && (
                  <AISummaryWrapper>
                    <AISummaryModalOpenerHelper
                      type={SummaryType.PATIENT}
                      title={`${lastName}, ${firstName}`}
                      identifier={patient?.patientIdentifier}
                    />
                  </AISummaryWrapper>
                )}
                <Box mx={1} />
                {profileBuilderFeatureAvailable && (
                  <ButtonContainer onClick={setIsProfileOpen}>
                    <PatientDetailsLabel>View object</PatientDetailsLabel>
                  </ButtonContainer>
                )}
                <Box mx={1} />
                {taskListRestrictions?.createTask !== DISABLED && (
                  <ButtonContainer onClick={setIsDrawerOpen}>
                    <PatientDetailsLabel>View details</PatientDetailsLabel>
                  </ButtonContainer>
                )}
                <Box mx={1} />
                <Chip label={patientStatus} />
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
              {patientTimelineFeatureAvailable && (
                <ActivityHistoryButton onClick={setIsactivityHistoryDrawerOpen}>
                  <ActivityHistoryText>Timeline</ActivityHistoryText>
                </ActivityHistoryButton>
              )}
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
                    dateTimeIntent,
                  }) => {
                    return (
                      <React.Fragment key={customFieldIdentifier}>
                        <PatientMetaDataField
                          fieldType={fieldType}
                          customFieldName={customFieldName}
                          value={value}
                          displayNames={displayNames}
                          displayName={displayName}
                          dueDateIntent={dateTimeIntent}
                        />
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
          <ProfileDetailsDrawer
            patient={patient}
            isOpenedDetails={isProfileOpen}
            closeDrawer={unsetIsProfileOpen}
            context={'PATIENT'}
          />
          <PatientActivityHistoryDrawer
            patient={patient}
            title="Timeline"
            isOpen={isactivityHistoryDrawerOpen}
            onClose={unsetIsactivityHistoryDrawerOpen}
          />
        </>
      )}
    </PatientDetailsContainer>
  );
};

export default PatientDetailsHeader;
