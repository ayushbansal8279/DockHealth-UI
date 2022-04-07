/* eslint-disable import/extensions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Popper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as PatientApi from 'api/patient-api';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import Spacing from 'components/common/Spacing';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDShortLabel,
} from 'helpers/customer-type-helper';
import { organizationSelector } from 'selectors/organization-selectors';
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
  PatientCellWrapper,
  PatientMRNAnchor,
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

const PatientCard = ({ children, patientIdentifier, disabled }) => {
  const reference = useRef(null);

  const [patientData, setPatientData] = useState(null);

  const [cardOpen, openCard, closeCard] = useBooleanWithTimeout();

  const { currentUser } = useSelector(store => ({
    currentUser: store.userState.userProfile,
  }));

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const uniqueIdentifierLabel = getCustomerUniqueIDShortLabel(currentUser);

  const organization = useSelector(organizationSelector);
  const emrPatientLink = organization?.emrPatientLink;

  useEffect(() => {
    if (cardOpen && patientIdentifier !== patientData?.patientIdentifier) {
      setPatientData(null);
      PatientApi.getPatientById(patientIdentifier)
        .then(fetchedPatient => {
          setPatientData(fetchedPatient);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardOpen, patientIdentifier]);

  useEffect(() => {
    if (disabled && cardOpen) {
      closeCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const {
    firstName,
    lastName,
    middleName,
    dob,
    age,
    gender,
    genderIdentity,
    mrn,
    email,
    phoneMobile,
    phoneHome,
    allNotes,
  } = patientData || {};
  return (
    <PatientCellWrapper
      ref={reference}
      onMouseEnter={!disabled && openCard}
      onMouseLeave={closeCard}
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={cardOpen && !!patientIdentifier}
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
                  <Link to={`/core/patient/${patientIdentifier}`}>
                    <PatientLinkText>view {customerTypeLabel}</PatientLinkText>
                  </Link>
                </TopSection>
                {(dob ||
                  age ||
                  gender ||
                  genderIdentity ||
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
                          {gender && `${gender?.charAt(0)?.toUpperCase()}`}
                          {genderIdentity &&
                            `, ${genderIdentity?.charAt(0)?.toUpperCase()} `}
                        </InfoItem>
                      )}
                      {mrn && !emrPatientLink && (
                        <InfoItem>
                          {uniqueIdentifierLabel}# {mrn}
                        </InfoItem>
                      )}
                      {mrn && emrPatientLink && (
                        <InfoItem>
                          {uniqueIdentifierLabel}#{' '}
                          <PatientMRNAnchor
                            href={emrPatientLink.replace('{mrn}', mrn)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {mrn}
                          </PatientMRNAnchor>
                        </InfoItem>
                      )}
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
                {patientData?.patientMetaData?.map(
                  ({ customFieldName, displayName, value, displayOptions }) => (
                    <>
                      {displayOptions?.includes('PATIENT_HEADER') && value && (
                        <InfoItem>
                          {customFieldName}: {displayName || value}
                        </InfoItem>
                      )}
                    </>
                  ),
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
    </PatientCellWrapper>
  );
};

export default PatientCard;
