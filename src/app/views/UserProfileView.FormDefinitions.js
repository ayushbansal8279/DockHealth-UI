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
    label: 'Mobile',
    isPhoneNumber: true,
    readOnly: true,
  },
  {
    key: 'workPhoneNumber',
    label: 'Additional Phone Number',
    isPhoneNumber: true,
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
