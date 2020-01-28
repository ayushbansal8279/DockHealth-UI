import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import { getBillingDetails } from '../../../actions/organization-actions';
import BillingData from './BillingsView.BillingData';
import InvoicesList from './BillingsView.InvoicesList';
import { BillingsViewContainer, Title } from './BillingsView.Styled';

const BillingsView = () => {
  const dispatch = useDispatch();

  const { organizationId } = useSelector(store => store.userState.userProfile);

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

    getBillingDetails({ organizationId })(dispatch);
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
