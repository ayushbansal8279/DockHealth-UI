import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ArrowLeftIcon from 'img/arrow-left.svg';
import {
  PatientDetailsInformationContainer,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetails,
  NavigationBackIcon,
} from './styled';

const formatInformation = (information, width) => {
  if (width <= 1152) {
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
  mrn,
  gender,
}) => {
  const { width } = useWindowDimensions();

  return (
    <PatientDetailsInformationContainer>
      <PatientName>
        <Link to="/patients">
          <NavigationBackIcon src={ArrowLeftIcon} />
        </Link>
        {[firstName, middleName, lastName].join(' ')}
      </PatientName>
      <PatientDetails>
        {dob && gender && (
          <>
            <PatientInfo>
              {moment(dob).format('MM/DD/YYYY')}{' '}
              {moment().diff(moment(dob), 'years')} {'y/o '}
              {gender?.charAt(0)?.toUpperCase()}
            </PatientInfo>
            <PatientInfoDivider />
          </>
        )}
        {mrn && (
          <>
            <PatientInfo>
              MRN#
              {formatInformation(mrn, width)}
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
      </PatientDetails>
    </PatientDetailsInformationContainer>
  );
};

export default PatientDetailsInformation;
