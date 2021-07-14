/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { getCustomerUniqueIDShortLabel } from 'helpers/customer-type-helper';
import EmailIcon from 'img/email-icon.svg';
import PhoneIcon from 'img/phone-icon.svg';
import MobileIcon from 'img/mobile-icon.svg';
import { Box, Grid } from '@material-ui/core';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  PatientDetailsInformationContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetailsInformations,
  PatientDetails,
  PatientDetailsLabel,
  ButtonContainer,
  IconWrapper,
  ContactContainer,
  PatientsLabelContainer,
} from './styled';
import PatientDetailsLoader from './PatientDetailsLoader/PatientDetailsLoader';
import PatientLabels from '../PatientLabels/PatientLabels';

const formatInformation = (information, width) => {
  if (width <= 1152 && information?.length > 24) {
    return `${information.slice(0, 24)}...`;
  }

  return information;
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const PatientDetailsInformation = ({
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
  isOpenedDetails,
  setIsOpenedDetails,
  isLoadingDetails,
  currentUser,
}) => {
  const { width } = useWindowDimensions();
  const history = useHistory();
  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(currentUser);
  return (
    <PatientDetailsInformationContainer>
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
                <ButtonContainer
                  onClick={setIsOpenedDetails}
                  disabled={isOpenedDetails}
                >
                  <PatientDetailsLabel>View details</PatientDetailsLabel>
                </ButtonContainer>
                <PatientsLabelContainer>
                  <PatientLabels />
                </PatientsLabelContainer>
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
          {(dob ||
            age ||
            gender ||
            mrn ||
            email ||
            phoneMobile ||
            phoneHome) && (
            <PatientDetails>
              <PatientDetailsInformations>
                {(age || gender) && (
                  <>
                    <PatientInfo>
                      {age && `${age} `}
                      {gender && gender?.charAt(0)?.toUpperCase()}
                    </PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
                {mrn && (
                  <>
                    <PatientInfo>
                      {uniqueIdentifierLabel}# {mrn}
                    </PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
                {email && (
                  <>
                    <PatientInfo>{formatInformation(email, width)}</PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
                {phoneMobile && (
                  <>
                    <PatientInfo>M {phoneMobile}</PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
                {phoneHome && (
                  <>
                    <PatientInfo>H {phoneHome}</PatientInfo>
                    <PatientInfoDivider />
                  </>
                )}
              </PatientDetailsInformations>
            </PatientDetails>
          )}
        </>
      ) : (
        <Box pl="30px">
          <PatientDetailsLoader />
        </Box>
      )}
    </PatientDetailsInformationContainer>
  );
};

export default PatientDetailsInformation;
