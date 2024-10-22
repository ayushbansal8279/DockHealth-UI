// topic (e.g. API, WEBHOOK, AUTOMATION, WORKFLOW)
// action (e.g. TASK_CREATED, TASK_UPDATED, TASK_COMPLETED, SYSTEM_TASK_EXECUTED, OUTBOUND_WEBHOOK_CALLED)
// type (ORGANIZATION, USER, PATIENT, PROFILE, TASK, WORKFLOW)
// typeIdentifier (specific UUID of the entity type the event is related to)
// path (string reference to the specific entity change - e.g. capture source system like Elation)
// eventIdentifier (UUID)
// parentEventIdentifier (UUID)
// eventDateTime (date and time when event was logged)
// properties (array of key / value pairs)

const dummyProperties = {
  'Property 1': {
    id: 12345678,
    type: 'File',
    menuitem: [
      { name: 'New', type: 'API' },
      { name: 'Open', type: 'Filter' },
      { name: 'Close', type: 'Filter' },
    ],
  },
};

export const dummyMeteringData = [
  {
    topic: 'API',
    action: 'TASK_CREATED',
    type: 'ORGANIZATION',
    typeIdentifier: 'ccca5fe6-a2c0-4e68-93ab-b3bb02cbd831',
    path: 'Google',
    eventDate: '2024-10-03T18:00:00.000+00:00',
    properties: dummyProperties,
  },
  {
    topic: 'WEBHOOK',
    action: 'TASK_UPDATED',
    type: 'USER',
    typeIdentifier: '1587ede9-af71-4e1d-b55a-2ce39b0d83e6',
    path: 'google.com',
    eventDate: '2024-11-04T18:00:00.000+00:00',
    properties: dummyProperties,
  },
  {
    topic: 'AUTOMATION',
    action: 'TASK_COMPLETED',
    type: 'PATIENT',
    typeIdentifier: 'f3963ca1-fdb1-455e-9621-a3d406349922',
    path: 'google.com',
    eventDate: '2024-05-23T18:00:00.000+00:00',
    properties: dummyProperties,
  },
  {
    topic: 'WORKFLOW',
    action: 'SYSTEM_TASK_EXECUTED',
    type: 'PROFILE',
    typeIdentifier: 'a4b5beef-b155-4509-8d16-800e5915d91d',
    path: 'google.com',
    eventDate: '2024-01-08T18:00:00.000+00:00',
    properties: dummyProperties,
  },
];
