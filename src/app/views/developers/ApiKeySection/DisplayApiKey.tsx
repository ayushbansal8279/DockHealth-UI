import { ApiKey } from '@/app/types/developer';
import React, { FC } from 'react';
import Field from './Field';
import { useSelector } from 'react-redux';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { Grid } from '@mui/material';

interface DisplayApiKeyProps {
  data: ApiKey;
}

const DisplayApiKey: FC<DisplayApiKeyProps> = ({ data }) => {
  const { userIdentifier, organizationIdentifier } =
    useSelector(userProfileSelector);

  const fields = [
    {
      value: userIdentifier,
      label: 'User Identifier',
      ellipsis: false,
    },
    {
      value: organizationIdentifier,
      label: 'Organization Identifier',
      ellipsis: false,
    },
    {
      value: data.domain,
      label: 'Domain Name',
      ellipsis: false,
    },
    {
      value: data.apiKey,
      label: 'API Key',
      ellipsis: true,
    },
    {
      value: data.clientId,
      label: 'Client Id',
      ellipsis: true,
    },
    {
      value: data.clientSecret,
      label: 'Client Secret',
      ellipsis: true,
    },
  ];

  return (
    <Grid container alignItems="center" spacing={1} maxWidth="800px">
      {fields.map((field) => (
        <Field
          key={field.label}
          label={field.label}
          ellipsis={field.ellipsis}
          value={field.value}
        />
      ))}
    </Grid>
  );
};

export default DisplayApiKey;
