import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
import Arrow from 'components/common/Arrow/Arrow';
import { getCustomerUniqueIDShortLabel } from 'helpers/customer-type-helper';
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
      <PatientDetailsBio style={{ flexDirection: 'row' }}>
        <div style={{ width: '30px' }}>
          <button type="button" onClick={history.goBack}>
            <img
              src={ArrowLeftIcon}
              alt="back-navigation"
              style={{ width: '20px' }}
            />
          </button>
        </div>
        <div>
          {!isLoadingDetails ? (
            <>
              <PatientName>
                {[`${lastName},`, firstName, middleName].join(' ')}
              </PatientName>
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
