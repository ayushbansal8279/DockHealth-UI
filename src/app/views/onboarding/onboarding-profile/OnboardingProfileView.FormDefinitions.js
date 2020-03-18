import { head } from 'ramda';

export const formFieldDefinitions = [
  {
    key: 'title',
    label: 'Title',
    required: true,
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
    key: 'department',
    label: 'Department',
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
    defaultValue: true,
  },
  {
    key: 'pushNotificationsEnabled',
    label: 'Push Notifications to mobile phone',
    sublabels: [
      'Notify me via push notification when there is new activity.',
      '*Mobile app required.',
    ],
    defaultValue: true,
  },
];
