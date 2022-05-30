/* eslint-disable import/extensions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { descend, prop } from 'ramda';
import moment from 'moment';
import { Box, Popper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as PatientApi from 'api/patient-api';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import Spacing from 'components/common/Spacing';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDShortLabel,
} from 'helpers/customer-type-helper';
import { organizationSelector } from 'selectors/organization-selectors';
// eslint-disable-next-line import/no-cycle
import TextTypeHeader from 'components/common/TextTypeHeader/TextTypeHeader';
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
  CustomFieldPatientInfo,
  PatientNotesWrapper,
  PinnedNotesWrapper,
} from './styled';
import PatientCardDetailsLoader from './PatientCardDetailsLoader';
import PatientCardNotesLoader from './PatientCardNotesLoader';

const renderPatientNotes = (
  unpinnedNotes,
  pinnedNotes,
  { firstName, middleName, lastName },
) => {
  const patientName = middleName
    ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`
    : `${lastName}, ${firstName}`;

  const pinnedSorted = pinnedNotes?.sort(descend(prop('dateUpdated')));
  const unpinnedSorted = unpinnedNotes?.sort(descend(prop('dateUpdated')));
  const notes = [...(pinnedSorted ?? []), ...(unpinnedSorted ?? [])];

  const renderNoteDescription = (description, dateUpdated) => {
    return (
      <>
        <NoteDescription>{description || <br />}</NoteDescription>
        <NoteInfo>
          {patientName} {moment(dateUpdated).format('h:mma M/DD/YY')}
        </NoteInfo>
      </>
    );
  };

  const renderNote = ({ description, dateUpdated, pinned }, index) => {
    return (
      <PatientNote>
        {index !== 0 && (
          <>
            <Spacing vertical={2} />
            <NoteDivider />
            <Spacing vertical={1} />
          </>
        )}
        {pinned && (
          <PinnedNotesWrapper>
            {renderNoteDescription(description, dateUpdated)}
          </PinnedNotesWrapper>
        )}
        {!pinned && (
          <PatientNotesWrapper>
            {renderNoteDescription(description, dateUpdated)}
          </PatientNotesWrapper>
        )}
      </PatientNote>
    );
  };

  return notes?.length > 0 ? (
    <>
      <Divider />
      <PatientNotesSection>
        <NotesTitle>Notes</NotesTitle>
        {notes.map(note => {
          return renderNote(note);
        })}
      </PatientNotesSection>
    </>
  ) : null;
};

const PatientCard = ({
  children,
  patientIdentifier,
  disabled,
  disableLink,
}) => {
  const reference = useRef(null);
  const [patientData, setPatientData] = useState(null);
  const [cardOpen, openCard, closeCard] = useBooleanWithTimeout();
  const [patientNotes, setPatientNotes] = useState(null);

  const [pinnedNotes, unpinnedNotes] = useMemo(
    () =>
      patientNotes?.reduce(
        (accumulator, note) => {
          if (note.pinned) {
            accumulator[0].push(note);
          } else {
            accumulator[1].push(note);
          }
          return accumulator;
        },
        [[], []],
      ) || [null, null],
    [patientNotes],
  );

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
          setPatientNotes(fetchedPatient.allNotes);
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
                  {!disableLink && (
                    <Link to={`/core/patient/${patientIdentifier}`}>
                      <PatientLinkText>
                        view {customerTypeLabel}
                      </PatientLinkText>
                    </Link>
                  )}
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
                        </InfoItem>
                      )}
                      {genderIdentity && (
                        <InfoItem>gender identity: {genderIdentity}</InfoItem>
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
                <Box display="flex" flexWrap="wrap">
                  {patientData?.patientMetaData?.map(
                    ({
                      customFieldName,
                      displayName,
                      value,
                      displayOptions,
                    }) => (
                      <>
                        {displayOptions?.includes('PATIENT_HEADER') && value && (
                          <CustomFieldPatientInfo>
                            <Typography>{customFieldName}: </Typography>
                            <Box ml={1} />
                            <TextTypeHeader text={displayName || value} />
                          </CustomFieldPatientInfo>
                        )}
                      </>
                    ),
                  )}
                </Box>
              </>
            ) : (
              <PatientCardDetailsLoader />
            )}
          </PatientInfoSection>
          {patientData ? (
            renderPatientNotes(unpinnedNotes, pinnedNotes, patientData)
          ) : (
            <PatientCardNotesLoader />
          )}
        </PatientCardContainer>
      </Popper>
    </PatientCellWrapper>
  );
};

export default PatientCard;
