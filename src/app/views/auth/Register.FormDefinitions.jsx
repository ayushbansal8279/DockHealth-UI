import React from 'react';
import styled from 'styled-components';

const PrePasswordLabel = styled.div`
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
`;

export default [
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
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    key: 'accountPhoneNumber',
    label: 'Your Mobile Phone Number',
    isPhoneNumber: true,
    required: true,
    PreFieldComponent: () => (
      <PrePasswordLabel>
        A valid mobile phone number is required to send an authentication code
        for HIPAA compliance
      </PrePasswordLabel>
    ),
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    PreFieldComponent: () => (
      <PrePasswordLabel>
        8 character minimum and must include at least one number and one capital
        letter
      </PrePasswordLabel>
    ),
  },
];
