import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { organizationSelector } from 'selectors/organization-selectors';
import { useMutation } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Field from './Field';
import * as DevelopersApi from '@app/api/developers-api';
import { TCreateApiKeyMutationParams } from 'types/developer';
import { TOrganization } from 'types/organization';

const fields = [
  {
    name: 'domainName',
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

const ApiKeySection = () => {
  const organization = useSelector(organizationSelector) as TOrganization;
  const {
    organizationIdentifier,
    subscriptionDetails: { subscriptionPlan },
  } = organization || { subscriptionDetails: {} };

  // { mutate, isPending, isSuccess, isError, error, data }
  const createApiKeyMutation = useMutation({
    mutationFn: (params: TCreateApiKeyMutationParams) =>
      DevelopersApi.createApiKey(params),
  });
  const tempData = {
    domainName: 'dock.health-d5ed19ac-01ad-433d-bb61-046035a1df0b',
    apiKey: 'CehlWsU4KR3W7hE2yzVJy3FrUH2bsO5X5uFJLdTX',
    clientId: '11gogdqm4iqc42md4n2i4ki8gr',
    clientSecret: '1hm3imfccbionbt2mfjf6t2ni1faf7kqk3ivvsc315ipd0isi9lo',
  };

  const handleCreateApiKey = () => {
    createApiKeyMutation.mutate({
      organizationIdentifier,
    });
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Typography variant="h3">API Key</Typography>
          {!tempData && (
            <Button onClick={handleCreateApiKey} startIcon={<AddIcon />}>
              Create API Key
            </Button>
          )}
        </Box>
        <Box sx={{ my: 3, mx: 2 }}>
          {fields.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              ellipsis={field.ellipsis}
              value={tempData[field.name]}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApiKeySection;
