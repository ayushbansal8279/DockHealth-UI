import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import ArrowLeftIcon from 'img/arrow-left.svg';
import Arrow from 'components/common/Arrow/Arrow';
import {
  PatientDetailsInformationContainer,
  PatientDetailsBio,
  PatientName,
  PatientInfo,
  PatientInfoDivider,
  PatientDetailsInformations,
  PatientDetails,
  PatientDetailsLabel,
  ArrowBox,
  ArrowBoxIndicator,
} from './styled';
import PatientDetailsLoader from './PatientDetailsLoader/PatientDetailsLoader';

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
  mrn,
  gender,
  isOpenedDetails,
  setIsOpenedDetails,
  isLoadingDetails,
}) => {
  const { width } = useWindowDimensions();

  return (
    <PatientDetailsInformationContainer>
      <PatientDetailsBio style={{ flexDirection: 'row' }}>
        <div style={{ width: '30px' }}>
          <Link to="/patients">
            <img
              src={ArrowLeftIcon}
              alt="back-navigation"
              style={{ width: '20px' }}
            />
          </Link>
        </div>
        <div>
          {!isLoadingDetails ? (
            <>
              <PatientName>
                {[firstName, middleName, lastName].join(' ')}
              </PatientName>
              {(dob || gender || mrn || email || phoneMobile || phoneHome) && (
                <PatientDetails>
                  <PatientDetailsInformations>
                    {(dob || gender) && (
                      <>
                        <PatientInfo>
                          {dob &&
                            `${moment(dob).format(
                              'MM/DD/YYYY',
                            )} ${moment().diff(moment(dob), 'years')} yo `}
                          {gender && gender?.charAt(0)?.toUpperCase()}
                        </PatientInfo>
                        <PatientInfoDivider />
                      </>
                    )}
                    {mrn && (
                      <>
                        <PatientInfo>MRN# {mrn}</PatientInfo>
                        <PatientInfoDivider />
                      </>
                    )}
                    {email && (
                      <>
                        <PatientInfo>
                          {formatInformation(email, width)}
                        </PatientInfo>
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
            <PatientDetailsLoader />
          )}
        </div>
      </PatientDetailsBio>
      <ArrowBox>
        <ArrowBoxIndicator>
          <Arrow isOpen={isOpenedDetails} setOpen={setIsOpenedDetails}>
            <PatientDetailsLabel>DETAILS</PatientDetailsLabel>
          </Arrow>
        </ArrowBoxIndicator>
      </ArrowBox>
    </PatientDetailsInformationContainer>
  );
};

export default PatientDetailsInformation;
