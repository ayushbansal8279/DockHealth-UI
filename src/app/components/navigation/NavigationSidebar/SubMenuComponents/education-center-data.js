/* eslint-disable import/prefer-default-export */

export const EDUCATION_CENTER_CATEGORIES = [
  {
    name: 'Getting Started',
    items: [
      {
        name: 'Home Page Tour',
        overview:
          "Home is a place for you to see all of your or your team's tasks aggregated from all of your lists by due dates",
        videoUrl: 'https://www.youtube.com/embed/-LBenmywNrA',
      },
      {
        name: 'Making Lists',
        overview: 'Add a new list for just yourself or a group of users',
        additionalOverview:
          'Lists are a great way to get organized around tasks or teams',
        videoUrl: 'https://www.youtube.com/embed/Ddb96fncKTU',
      },
      {
        name: 'Create a Task',
        overview:
          'Tasks are the to-dos for you and your team. Add patient context, due dates, status, assignments and attachments to get the most from tasks',
        helpUrl: 'https://www.dock.health/101',
      },
      {
        name: 'Invite Users to a List',
        overview:
          'Users who are members of your organization can easily be invited to a list by simply clicking on the "+" button on the top of a list',
        additionalOverview:
          'Only users who have been invited to your organization can be added to lists',
      },
      {
        name: 'Organizing Lists with Groups',
        overview: 'Groups are a great way to organize tasks within a list',
        videoUrl: 'https://www.youtube.com/embed/U5A1OBX3V9M',
      },
      {
        name: 'Inbox and email integration',
        overview:
          'Forward emails to your Dock account and automagically turn them into tasks',
        additionalOverview:
          'Simply forward emails to task@dockhealth.email and check out "Tips" in your Dock Inbox for more details',
      },
    ],
  },
  {
    name: 'How Tos',
    items: [
      {
        name: 'Get Help',
        overview:
          "We're here to help every step of the way. Feel free to ping us on Intercom (little blue button on bottom right) or simply grab a time to connect on Zoom",
        additionalOverview:
          "Let's chat about setting up integrations, automations, and some workflows for your practice",
        helpUrl: 'https://www.dock.health/calendar',
        helpUrlLabel: 'Schedule a Meeting',
      },
      {
        name: 'Guests',
        overview:
          'Guests are outside collaborators that you can invite to a specific list with visibility on tasks and patients only in that list',
        additionalOverview:
          'Only guests who have been invited to your organization by an owner/admin can be added to lists',
      },
      {
        name: '@ Mentions',
        overview:
          'Mentions is a way to assign members to tasks and call them out in comments',
        additionalOverview:
          'Simply use the @ symbol before their name in the task description or comments',
        videoUrl: 'https://www.youtube.com/embed/72hQU9jx89g',
      },
      {
        name: '# Patients',
        overview:
          'Quickly add patient context to a task by typing #PatientName in the task description',
        videoUrl: 'https://www.youtube.com/embed/72hQU9jx89g',
      },
    ],
  },
];
