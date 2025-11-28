import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

const data = {
  title: 'Forward your emails to Dock and put them to work.',
  descriptions: [
    `Turn an email into a task on Dock by forwarding it to: ${
      import.meta.env.VITE_APP_ENV === 'dev'
        ? 'Task-dev@dockhealth.email'
        : 'Task@DockHealth.email'
    }`,
    'Add any or all special characters below into the subject line of the email you are forwarding and Dock will organize them accordingly.',
  ],
  tips: [
    {
      subject: '>ListName',
      description:
        'Add the list name after > to send an email directly to that list',
    },
    {
      subject: '^ListGroup',
      description:
        'Add the task to an existing task group in the list specified',
    },
    {
      subject: '*High',
      description:
        'To make the task a high priority task, put *High in the subject line.',
    },
    {
      subject: '!Date',
      description:
        'Add a due date to a task by adding a date after ! (e.g. !02-28-2020)',
    },
    {
      subject: '@FirstLast',
      description:
        'Assign the task to a user within a list (user must be a member of this list, e.g. @ElonMusk)',
    },
    {
      subject: '#FirstLast',
      description:
        'Assign an existing patient/client to the task (e.g. #JohnDoe)',
    },
    {
      subject: '+LabelName',
      description: 'Add an existing label to the task',
    },
    {
      subject: 'Status',
      description: 'Set a default task status',
    },
  ],
};

const { title, descriptions, tips } = data;

export default function InboxHelpPanel() {
  return (
    <Box
      sx={{
        width: '700px',
        maxWidth: '100%',
        px: 4,
        py: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {descriptions.map((d, i) => (
          <Typography key={i} variant="body1">
            {d}
          </Typography>
        ))}
      </Box>
      <Divider />
      <Grid container spacing={2}>
        {tips.map((tip) => (
          <Grid item size={12} md={6} key={tip.subject}>
            <Typography variant="subtitle2" fontWeight="bold">
              {tip.subject}
            </Typography>
            <Typography variant="body2">{tip.description}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
