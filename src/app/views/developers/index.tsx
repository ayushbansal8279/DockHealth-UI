import React from 'react';
import { useSelector } from 'react-redux';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { Box } from '@mui/material';
import { TOrganization } from 'types/organization';
import { useCredentialsQuery } from '@/app/react-query/developer-credentials/useCredentialsQuery';
import { organizationSelector } from 'selectors/organization-selectors';
import Loader, { LoaderSizes } from '@/app/components/common/Loader/Loader';
import HeaderCard from './HeaderCard';
import ApiKeyCard from './ApiKeyCard';

const DevelopersPage = () => {
  const organization = useSelector(organizationSelector) as TOrganization;
  const organizationIdentifier = organization?.organizationIdentifier;

  const credentialsQuery = useCredentialsQuery({
    orgId: organizationIdentifier,
    options: {
      enabled: !!organizationIdentifier, // make sure that the get request will be sent if organizationIdentifier is available
    },
  });

  return (
    <ViewLayout header={<BasicLayoutHeader title="API Credentials" />}>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {credentialsQuery.isLoading && (
          <Box display="flex" justifyContent="center">
            <Loader size={LoaderSizes.medium} />
          </Box>
        )}
        {credentialsQuery.data && (
          <>
            <HeaderCard credentialsExist={!!credentialsQuery.data.length} />
            {credentialsQuery.data.map((credential, idx) => (
              <ApiKeyCard
                key={credential.clientId}
                data={credential}
                idx={idx}
              />
            ))}
          </>
        )}
      </Box>
    </ViewLayout>
  );
};

export default DevelopersPage;
