import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import { Box, Grid } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  userProfileSelector,
} from 'selectors/user-selectors';
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

const CustomProfileDetailsHeader = ({ onViewDetailsClick = () => undefined}) => {
  const {
    firstName,
    middleName,
    lastName,
    age,
    gender,
    dob,
    genderIdentity,
    email,
    phoneHome,
    phoneMobile,
    mrn
  } = useSelector(userProfileSelector);

  const handleViewDetailsClick = () => {
    onViewDetailsClick();
  };

  return (
    <PatientDetailsContainer>
      <>
        <Box display="flex" alignItems="center">
          <Box flex="1 0 0" display="flex" alignItems="center">
            <Grid container alignItems="center">
              <PatientName>
                {[`${lastName},`, firstName, middleName].join(' ')}
              </PatientName>
              <Box mx={1} />
              <ButtonContainer onClick={handleViewDetailsClick}>
                <PatientDetailsLabel>View details</PatientDetailsLabel>
              </ButtonContainer>
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
            {(age || gender || dob) && (
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
          </PatientDetailsInformation>
        </PatientDetails>
      </>
    </PatientDetailsContainer>
  );
};

export default CustomProfileDetailsHeader;
