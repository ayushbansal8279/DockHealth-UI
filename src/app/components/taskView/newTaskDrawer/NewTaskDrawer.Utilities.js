import moment from 'moment';
import React from 'react';

import Member from 'components/members/Member';

import {
  MemberLabelContainer,
  PatientLabelContainer,
  CondensedH4,
} from './NewTaskDrawer.Styled';

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

export const getFormattedMembers = ({ members }) =>
  (members ?? []).map(member => {
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
