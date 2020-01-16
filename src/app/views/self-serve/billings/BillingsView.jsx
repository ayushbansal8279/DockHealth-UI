import React from 'react';
import { useDispatch } from 'react-redux';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';

import { setHeader } from '../../../actions/header-actions';
import BillingData from './BillingsView.BillingData';
import { BillingsViewContainer, Title } from './BillingsView.Styled';
import InvoicesList from './BillingsView.InvoicesList';

const BillingsView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Billings & Invoices</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });
  });

  return (
    <BillingsViewContainer>
      <Elements
        locale="en-US"
        fonts={[
          {
            cssSrc:
              'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
          },
        ]}
      >
        <BillingData />
      </Elements>
      <InvoicesList />
    </BillingsViewContainer>
  );
};

export default BillingsView;
