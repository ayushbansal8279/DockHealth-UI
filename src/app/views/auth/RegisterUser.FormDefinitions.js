import head from 'ramda/es/head';

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
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    key: 'password',
    label: 'Password',
    isPassword: true,
    required: true,
  },
  {
    key: 'accountPhoneNumber',
    label: 'Your Mobile Phone Number', 
    isPhoneNumber: true,
    required: true,
  },
];
