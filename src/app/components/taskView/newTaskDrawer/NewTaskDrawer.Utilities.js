import moment from 'moment';
import React from 'react';
import Member from 'components/members/Member';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {
  MemberLabelContainer,
  PatientLabelContainer,
  CondensedH4,
} from './NewTaskDrawer.Styled';
import palette from '../../../styles/palette';

const getFormattedAge = ({ dob }) => {
  if (!dob) {
    return '-';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '-';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

export const getFormattedPatients = ({ patients }) =>
  (patients ?? []).map(
    ({ patientIdentifier, firstName, lastName, mrn, dob }) => {
      const patientName = `${firstName} ${lastName}`.trim();

      return {
        key: patientIdentifier,
        value: patientIdentifier,
        label: (
          <PatientLabelContainer>
            <CondensedH4>{patientName}</CondensedH4>
            <CondensedH4 align="right">{getFormattedAge({ dob })}</CondensedH4>
            <CondensedH4 align="right">{mrn}</CondensedH4>
          </PatientLabelContainer>
        ),
        displayLabel: patientName,
      };
    },
  );

export const getFormattedMembers = ({ members, currentUser }) => {
  const filteredMembers = (members ?? []).filter(member => {
    return currentUser.userIdentifier !== member.userIdentifier;
  });
  const formattedMembers = filteredMembers.map(member => {
    const { userIdentifier, firstName, lastName } = member;
    const userName = `${firstName} ${lastName}`.trim();

    return {
      key: userIdentifier,
      value: userIdentifier,
      label: (
        <MemberLabelContainer>
          <CondensedH4>{userName}</CondensedH4>
          <Member member={member} size={30} />
        </MemberLabelContainer>
      ),
      displayLabel: userName,
    };
  });

  formattedMembers.unshift({
    key: currentUser.userIdentifier,
    value: currentUser.userIdentifier,
    label: (
      <MemberLabelContainer
        style={{
          paddingBottom: '5px',
          borderBottom: `1px solid ${palette.coolGrey3}`,
        }}
      >
        <CondensedH4>Assign To Me</CondensedH4>
        <Member member={currentUser} size={30} />
      </MemberLabelContainer>
    ),
    displayLabel: 'Assign To Me',
  });
  return formattedMembers;
};

export const getFormattedLabels = ({ labels }) =>
  (labels ?? []).map(label => {
    const { labelIdentifier, labelName } = label;

    return {
      key: labelIdentifier,
      value: labelIdentifier,
      label: <CondensedH4>{labelName}</CondensedH4>,
      displayLabel: labelName,
    };
  });

export const renderPartsWithHighlighting = (optionValue, inputValue) => {
  const matches = match(optionValue, inputValue);
  const parts = parse(optionValue, matches);
  return (
    <>
      {parts.map(part => (
        <span
          key={`${optionValue}_${part}`}
          style={{ fontWeight: part.highlight ? 700 : 400 }}
        >
          {part.text}
        </span>
      ))}
    </>
  );
};
