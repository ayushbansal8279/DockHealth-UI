import React from 'react';
import { useSelector } from 'react-redux';
import { organizationSelector } from 'selectors/organization-selectors';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TOrganization } from 'types/organization';
import { useApiKeyQuery } from 'react-query/developers/useApiKeyQuery';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import DisplayApiKeyHeader from './DisplayApiKeyHeader';
import DisplayApiKey from './DisplayApiKey';
import CreateApiKeyHeader from './CreateApiKeyHeader';
import EmptyContent from './EmptyContent';
import { ApiKey } from '@/app/types/developer';

const ApiKeySection = () => {
  const organization = useSelector(organizationSelector) as TOrganization;
  const organizationIdentifier = organization?.organizationIdentifier;

  const apiKeyQuery = useApiKeyQuery({
    orgId: organizationIdentifier,
    options: {
      enabled: !!organizationIdentifier, // make sure that the get request will be sent if organizationIdentifier is available
    },
  });

  const getOptionToRender = (isLoading: boolean, data: ApiKey | undefined) => {
    if (isLoading)
      return {
        header: null,
        content: (
          <Box display="flex" justifyContent="center">
            <Loader size={LoaderSizes.medium} />
          </Box>
        ),
      };
    if (!data)
      return {
        header: (
          <CreateApiKeyHeader organizationIdentifier={organizationIdentifier} />
        ),
        content: <EmptyContent />,
      };
    return {
      header: null,
      // header: (
      //   <DisplayApiKeyHeader organizationIdentifier={organizationIdentifier} />
      // ),
      content: <DisplayApiKey data={data} />,
    };
  };

  const { header, content } = getOptionToRender(
    apiKeyQuery.isLoading,
    apiKeyQuery.data,
  );

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">API Key</Typography>
          <Box display="flex" gap={2}>
            {header}
          </Box>
        </Box>
        <Box sx={{ my: 3, mx: 2 }}>{content}</Box>
      </CardContent>
    </Card>
  );
};

export default ApiKeySection;
