import { ApiKey } from '@/app/types/developer';
import React, { FC } from 'react';
import Field from './Field';

const fields = [
  {
    name: 'domain',
    label: 'Domain Name',
    ellipsis: false,
  },
  {
    name: 'apiKey',
    label: 'API Key',
    ellipsis: true,
  },
  {
    name: 'clientId',
    label: 'Client Id',
    ellipsis: true,
  },
  {
    name: 'clientSecret',
    label: 'Client Secret',
    ellipsis: true,
  },
] as const;

interface DisplayApiKeyProps {
  data: ApiKey;
}

const DisplayApiKey: FC<DisplayApiKeyProps> = ({ data }) => {
  return (
    <>
      {fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          ellipsis={field.ellipsis}
          value={data[field.name]}
        />
      ))}
    </>
  );
};

export default DisplayApiKey;
