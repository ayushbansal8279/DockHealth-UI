import React from 'react';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { Container } from '@mui/material';
import ApiKeySection from './ApiKeySection';

const DevelopersPage = () => {
  return (
    <ViewLayout header={<BasicLayoutHeader title="Developers" />}>
      <Container sx={{ py: 3 }}>
        <ApiKeySection />
      </Container>
    </ViewLayout>
  );
};

export default DevelopersPage;
