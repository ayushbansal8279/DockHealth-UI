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
  },
  {
    key: 'specialty',
    label: 'My Specialty',
  },
  {
    key: 'subspecialty',
    label: 'My Subspecialty',
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
