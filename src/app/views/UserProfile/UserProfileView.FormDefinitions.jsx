import { head } from 'ramda';
import React from 'react';
import styled from 'styled-components';

const PrePasswordLabel = styled.div`
  margin-bottom: 1rem;
  text-align: left;
  width: 80%;
`;

export const formFieldDefinitions = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
  },
  {
    key: 'title',
    label: 'Title',
    required: true,
    defaultValueGetter: ({ titles }) => head(titles || [])?.name,
  },
  {
    key: 'specialty',
    label: 'My Specialty',
    defaultValueGetter: ({ specialties }) => head(specialties || [])?.name,
  },
  {
    key: 'subspecialty',
    label: 'My Subspecialty',
    defaultValueGetter: ({ specialties }) =>
      head(head(specialties || [])?.subSpecialties || [])?.subSpecialtyName,
  },
  {
    key: 'organizationName',
    label: 'Organization',
    readOnly: true,
  },
  {
    key: 'department',
    label: 'Department',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    readOnly: true,
  },
  {
    key: 'accountPhoneNumber',
    label: 'Your Mobile Phone Number',
    isPhoneNumber: true,
    readOnly: true,
    PreFieldComponent: () => (
      <PrePasswordLabel>
        A valid mobile phone number is required to send an authentication code
        for HIPAA compliance
      </PrePasswordLabel>
    ),
    defaultValueGetter: ({ accountPhoneNumber }) =>
      accountPhoneNumber
        ? accountPhoneNumber.replace(/^\+1/, '')
        : accountPhoneNumber,
  },
  {
    key: 'workPhoneNumber',
    label: 'Your Additional Phone Number',
    isPhoneNumber: true,
    defaultValueGetter: ({ workPhoneNumber }) =>
      workPhoneNumber ? workPhoneNumber.replace(/^\+1/, '') : workPhoneNumber,
  },
];

export const formSwitchDefinitions = [
  {
    key: 'emailNotificationsEnabled',
    label: 'Emails',
    sublabels: ['Notify me via email when there is a new activity.'],
    defaultValue: false,
  },
  {
    key: 'pushNotificationsEnabled',
    label: 'Push Notifications to mobile phone',
    sublabels: [
      'Notify me via push notification when there is new activity.',
      '*Mobile app required.',
    ],
    defaultValue: false,
  },
];
