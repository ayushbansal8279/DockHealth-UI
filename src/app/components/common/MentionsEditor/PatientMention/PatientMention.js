import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import { Popper } from '@material-ui/core';
import { Link } from 'react-router';
import * as PatientApi from 'api/patient-api';
import {
  MentionItem,
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
import PatientMentionDetailsLoader from './PatientMentionDetailsLoader';
import PatientMentionsNotesLoader from './PatientMentionsNotesLoader';

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

// eslint-disable-next-line sonarjs/cognitive-complexity
const PatientMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (isHovered && !patientData) {
      PatientApi.getPatientById(mention.identifier)
        .then(fetchedPatient => {
          setPatientData(fetchedPatient);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, patientData]);

  const {
    patientIdentifier,
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
    <MentionItem
      className={className}
      ref={reference}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={isHovered && !!mention.identifier}
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
              <PatientMentionDetailsLoader />
            )}
          </PatientInfoSection>
          {patientData ? (
            renderPatientNotes(allNotes, patientData)
          ) : (
            <PatientMentionsNotesLoader />
          )}
        </PatientCardContainer>
      </Popper>
    </MentionItem>
  );
};

export default PatientMention;
