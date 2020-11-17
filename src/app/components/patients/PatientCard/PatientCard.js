/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Popper } from '@material-ui/core';
import { Link } from 'react-router';
import * as PatientApi from 'api/patient-api';
import Spacing from 'components/common/Spacing';
import {
  PatientCardContainer,
  PatientInfoSection,
  PatientName,
  PatientNotesSection,
  TopSection,
  PatientLinkText,
  Divider,
  PatientInfo,
  InfoItem,
  PatientNote,
  NoteDivider,
  NotesTitle,
  NoteDescription,
  NoteInfo,
} from './styled';
import PatientCardDetailsLoader from './PatientCardDetailsLoader';
import PatientCardNotesLoader from './PatientCardNotesLoader';

const renderPatientNotes = (notes, { firstName, middleName, lastName }) => {
  const patientName = middleName
    ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`
    : `${lastName}, ${firstName}`;

  return notes?.length > 0 ? (
    <>
      <Divider />
      <PatientNotesSection>
        <NotesTitle>Notes</NotesTitle>
        {notes.map(({ description, dateUpdated }, index) => (
          <PatientNote>
            {index !== 0 && (
              <>
                <Spacing vertical={4} />
                <NoteDivider />
                <Spacing vertical={3} />
              </>
            )}
            <NoteDescription>{description || <br />}</NoteDescription>
            <NoteInfo>
              {patientName} {moment(dateUpdated).format('h:mma M/DD/YY')}
            </NoteInfo>
          </PatientNote>
        ))}
      </PatientNotesSection>
    </>
  ) : null;
};

const PatientCard = ({ children, patientIdentifier }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (isHovered && !patientData) {
      PatientApi.getPatientById(patientIdentifier)
        .then(fetchedPatient => {
          setPatientData(fetchedPatient);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, patientData]);

  const {
    firstName,
    lastName,
    middleName,
    dob,
    age,
    gender,
    mrn,
    email,
    phoneMobile,
    phoneHome,
    allNotes,
  } = patientData || {};
  return (
    <span
      ref={reference}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={isHovered && !!patientIdentifier}
        placement="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <PatientCardContainer
          onClick={event => {
            event.stopPropagation();
          }}
        >
          <PatientInfoSection>
            {patientData ? (
              <>
                <TopSection>
                  <PatientName>
                    {[`${lastName},`, firstName, middleName?.slice(0, 1)]
                      .join(' ')
                      .toUpperCase()}
                  </PatientName>
                  <Link to={`/patient/${patientIdentifier}`}>
                    <PatientLinkText>view patient</PatientLinkText>
                  </Link>
                </TopSection>
                {(dob ||
                  age ||
                  gender ||
                  mrn ||
                  email ||
                  phoneMobile ||
                  phoneHome) && (
                  <>
                    <Spacing vertical={2} />
                    <PatientInfo>
                      {(age || gender) && (
                        <InfoItem>
                          {age && `${age} `}
                          {gender && ` ${gender?.charAt(0)?.toUpperCase()}`}
                        </InfoItem>
                      )}
                      {mrn && <InfoItem>MRN# {mrn}</InfoItem>}
                      {(dob || gender || mrn) && <br />}
                      {email && (
                        <>
                          <InfoItem>
                            <a href={`mailto:${email}`}>{email}</a>
                          </InfoItem>
                          <br />
                        </>
                      )}
                      {phoneMobile && <InfoItem>M {phoneMobile}</InfoItem>}
                      {phoneHome && <InfoItem>H {phoneHome}</InfoItem>}
                    </PatientInfo>
                  </>
                )}
              </>
            ) : (
              <PatientCardDetailsLoader />
            )}
          </PatientInfoSection>
          {patientData ? (
            renderPatientNotes(allNotes, patientData)
          ) : (
            <PatientCardNotesLoader />
          )}
        </PatientCardContainer>
      </Popper>
    </span>
  );
};

export default PatientCard;
