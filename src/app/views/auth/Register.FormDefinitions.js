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
  },
  {
    key: 'accountPhoneNumber',
    label: 'Your phone number',
    isPhoneNumber: true,
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    PreFieldComponent: () => (
      <PrePasswordLabel>
        8 character minimum and must include at least one number and one capital
        letter
      </PrePasswordLabel>
    ),
  },
];
