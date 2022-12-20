/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import descend from 'ramda/src/descend';
import prop from 'ramda/src/prop';
import moment from 'moment';
import { Box, Popper, Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import * as PatientApi from 'api/patient-api';
import useBooleanWithTimeout from 'hooks/use-boolean-with-timeout';
import Spacing from 'components/common/Spacing';
import {
  getCustomerTypeLabel,
  getCustomerUniqueIDShortLabel,
} from 'helpers/customer-type-helper';
import { organizationSelector } from 'selectors/organization-selectors';
import { FieldType } from 'helpers/field-type-helpers';
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
  NotesTitle,
  PatientCellWrapper,
  PatientMRNAnchor,
  CustomFieldPatientInfo,
} from './styled';
import PatientCardDetailsLoader from './PatientCardDetailsLoader';
import PatientCardNotesLoader from './PatientCardNotesLoader';
import PatientCardNote from './PatientCardNote';

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

  return notes?.length > 0 ? (
    <>
      <Divider />
      <PatientNotesSection>
        <NotesTitle>Notes</NotesTitle>
        {notes.map((note, index) => (
          <PatientCardNote
            key={note.identifier}
            note={note}
            patientName={patientName}
            index={index}
          />
        ))}
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
  const { pathname } = useLocation();
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

  const patientStreetAddress = patientData?.patientMetaData?.filter(
    cf => cf.customFieldName === 'Home Street Address',
  )[0]?.value;
  const patientStreetCity = patientData?.patientMetaData?.filter(
    cf => cf.customFieldName === 'City',
  )[0]?.value;
  const patientStreetState = patientData?.patientMetaData?.filter(
    cf => cf.customFieldName === 'State / Province',
  )[0]?.value;
  const patientPostalCode = patientData?.patientMetaData?.filter(
    cf => cf.customFieldName === 'Zip / Postal Code',
  )[0]?.value;
  const patientAddress =
    (patientStreetAddress || '') +
    (patientStreetCity ? `, ${patientStreetCity}` : '') +
    (patientStreetState ? `, ${patientStreetState}` : '') +
    (patientPostalCode ? ` - ${patientPostalCode}` : '');

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
                    <Link
                      to={{
                        pathname: `/core/patient/${patientIdentifier}`,
                        state: {
                          from: pathname,
                        },
                      }}
                    >
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
                      {(age || gender || dob) && (
                        <InfoItem>
                          {dob && `${moment(dob).format('MMM D, YYYY')} | `}
                          {age && `${age} | `}
                          {gender && `${gender?.charAt(0)?.toUpperCase()}`}
                        </InfoItem>
                      )}
                      {genderIdentity && (
                        <InfoItem>Gender: {genderIdentity}</InfoItem>
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
                      {patientAddress && patientAddress !== '' && (
                        <InfoItem>Address: {patientAddress}</InfoItem>
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
                      displayNames,
                      displayOptions,
                      fieldType,
                      customFieldIdentifier,
                    }) => (
                      <React.Fragment key={customFieldIdentifier}>
                        {fieldType === FieldType.HYPERLINK ? (
                          <>
                            <CustomFieldPatientInfo>
                              <a href={value} target="_blank" rel="noreferrer">
                                {customFieldName}
                              </a>
                            </CustomFieldPatientInfo>
                          </>
                        ) : (
                          <>
                            {displayOptions?.includes('PATIENT_HEADER') &&
                              value && (
                                <CustomFieldPatientInfo>
                                  <Typography>{customFieldName}: </Typography>
                                  <Box ml={1} />
                                  {fieldType === FieldType.DROPDOWN_MULTI
                                    ? `${displayNames?.join(',') || ''}`
                                    : `${displayName || value}`}
                                </CustomFieldPatientInfo>
                              )}
                          </>
                        )}
                      </React.Fragment>
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
