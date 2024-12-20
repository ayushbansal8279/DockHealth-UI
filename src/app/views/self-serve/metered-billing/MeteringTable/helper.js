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
    version: 'VERSION_1',
    type: 'AUTOMATION',
    subtype: 'SYSTEM_TASK_EXECUTED',
    path: '1da77ed6-e56d-4e91-a8fa-438efb2fef14',
    entity: 'TASK',
    entityIdentifier: '1da77ed6-e56d-4e91-a8fa-438efb2fef14',
    entityExternalIdentifier: null,
    entityName: 'System Task',
    organizationIdentifier: '160f8db5-40c2-11ea-a4e8-124feabd863a',
    eventIdentifier: '73179128-5cc8-4da8-a4b3-bf41117e5fb2',
    parentEventIdentifier: null,
    cost: 1,
    ts: '2024-12-19T00:01:17.608Z',
    properties: {
      templateIdentifier: '6c773384-085c-4ab5-bdec-0602b0ddf847',
      organizationName: 'Dock Health Dev Organization',
      workflowName: 'Workflow',
      userName: 'Mike Abraham',
      taskIdentifier: '1da77ed6-e56d-4e91-a8fa-438efb2fef14',
      listIdentifier: 'd935be14-8f15-4c08-9a19-b174153c42e0',
      groupName: 'Group',
      userIdentifier: 'ed6f063b-2ea8-49f2-a1f5-cfedd4d75837',
      templateName: 'Template',
      taskName: 'System Task',
      listName: 'List',
      groupIdentifier: '45153e2b-e471-4e2c-a1b6-38f96fd75601',
      workflowIdentifier: '3d1de2d8-c8d6-4ced-8a7e-7735d065aec5',
    },
  },
];
