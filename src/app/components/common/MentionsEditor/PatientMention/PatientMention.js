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
  SkeletonLoaderTextRow,
  SkeletonLoaderText,
  NotesTitle,
  NoteDescription,
  NoteInfo,
} from './styled';

const renderNotesSkeletonLoader = () => (
  <>
    <Divider />
    <PatientNotesSection>
      {new Array(2).fill().map(() => (
        <>
          <SkeletonLoaderTextRow width={162}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={3} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={2} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={2} />
          <SkeletonLoaderTextRow width={334}>
            <SkeletonLoaderText />
          </SkeletonLoaderTextRow>
          <Spacing vertical={4} />
          <NoteDivider />
          <Spacing vertical={3} />
        </>
      ))}
      <SkeletonLoaderTextRow width={162}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
      <Spacing vertical={3} />
      <SkeletonLoaderTextRow width={334}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
      <Spacing vertical={2} />
      <SkeletonLoaderTextRow width={334}>
        <SkeletonLoaderText />
      </SkeletonLoaderTextRow>
    </PatientNotesSection>
  </>
);

const renderPatientNotes = (notes, { firstName, lastName }) => {
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
              {firstName} {lastName}{' '}
              {moment(dateUpdated).format('h:mma M/DD/YY')}
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
        open={isHovered && mention.identifier}
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
                    {[firstName, middleName, lastName].join(' ').toUpperCase()}
                  </PatientName>
                  <Link to={`/patient/${patientIdentifier}`}>
                    <PatientLinkText>view patient</PatientLinkText>
                  </Link>
                </TopSection>
                {(dob ||
                  gender ||
                  mrn ||
                  email ||
                  phoneMobile ||
                  phoneHome) && (
                  <>
                    <Spacing vertical={2} />
                    <PatientInfo>
                      {(dob || gender) && (
                        <InfoItem>
                          {dob &&
                            `${moment(dob).format(
                              'MM/DD/YYYY',
                            )} ${moment().diff(moment(dob), 'years')} yo`}
                          {gender && ` ${gender?.charAt(0)?.toUpperCase()}`}
                        </InfoItem>
                      )}
                      {mrn && <InfoItem>MRN# {mrn}</InfoItem>}
                      <br />
                      {email && (
                        <InfoItem>
                          <a href={`mailto:${email}`}>{email}</a>
                        </InfoItem>
                      )}
                      <br />
                      {phoneMobile && <InfoItem>M {phoneMobile}</InfoItem>}
                      {phoneHome && <InfoItem>H {phoneHome}</InfoItem>}
                    </PatientInfo>
                  </>
                )}
              </>
            ) : (
              <>
                <SkeletonLoaderTextRow width={162}>
                  <SkeletonLoaderText />
                </SkeletonLoaderTextRow>
                <Spacing vertical={3} />
                <SkeletonLoaderTextRow width={334}>
                  <SkeletonLoaderText />
                  <Spacing horizontal={3} />
                  <SkeletonLoaderText />
                </SkeletonLoaderTextRow>
                <Spacing vertical={2} />
                <SkeletonLoaderTextRow width={334}>
                  <SkeletonLoaderText />
                </SkeletonLoaderTextRow>
                <Spacing vertical={2} />
                <SkeletonLoaderTextRow width={334}>
                  <SkeletonLoaderText />
                  <Spacing horizontal={3} />
                  <SkeletonLoaderText />
                </SkeletonLoaderTextRow>
              </>
            )}
          </PatientInfoSection>
          {patientData
            ? renderPatientNotes(allNotes, patientData)
            : renderNotesSkeletonLoader()}
        </PatientCardContainer>
      </Popper>
    </MentionItem>
  );
};

export default PatientMention;
