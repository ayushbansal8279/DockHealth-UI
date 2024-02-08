import React from 'react';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { useSelector } from 'react-redux';
import { organizationSelector } from 'selectors/organization-selectors';
import { TOrganization } from 'types/oragnization';
import { Container } from '@mui/material';
import SubscribeToEnterprise from './SubscribeToEnterprise';
import Developers from './Developers';

const DevelopersPage = () => {
  const organization = useSelector(organizationSelector) as TOrganization;
  const {
    organizationIdentifier,
    subscriptionDetails: { subscriptionPlan },
  } = organization || { subscriptionDetails: {} };
  const isEnterpriseSubscribed = true;

  return (
    <ViewLayout header={<BasicLayoutHeader title="Developers" />}>
      <Container sx={{ m: 5 }}>
        {isEnterpriseSubscribed ? <Developers /> : <SubscribeToEnterprise />}
      </Container>
    </ViewLayout>
  );
};

export default DevelopersPage;
