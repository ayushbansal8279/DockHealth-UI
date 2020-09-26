import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { setHeader } from 'actions/header-actions';
import {
  getBillingDetails,
  getInvoiceDetails,
} from 'actions/organization-actions';
import { saveBillingDetails } from 'api/organization-api';
import GenericHeader from 'components/common/GenericHeader';
import Spacing from 'components/common/Spacing';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import * as AlertActions from 'alert/actions';
import BillingData from './BillingsView.BillingData';
import InvoicesList from './BillingsView.InvoicesList';
import {
  BillingsViewContainer,
  BillingsViewInnerContainer,
  ErrorContainer,
  StyledCollapse,
} from './BillingsView.Styled';

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ setError, dispatch, organizationIdentifier }) => ({
  stripe,
  unsetUpdatingBilling,
  setProcessingUpdate,
  unsetProcessingUpdate,
}) => data => {
  setError('');
  setProcessingUpdate();
  return stripe
    .createToken({ name: 'cardNumber' })
    .then(token => {
      if (token.error) {
        throw token.error;
      }

      saveBillingDetails({
        billingData: data,
        token,
      })
        .then(() => {
          unsetUpdatingBilling();
          unsetProcessingUpdate();
          dispatch(
            AlertActions.showGlobalAlert(
              'Billing information updated successfully!',
              'success',
            ),
          );
          getBillingDetails({ organizationIdentifier })(dispatch);
        })
        .catch(error => {
          unsetProcessingUpdate();
          setError(
            error?.response?.data?.errorMessage ??
              'Could not update billing information, please try again later',
          );
        });
    })
    .catch(error => {
      unsetProcessingUpdate();
      setError(
        error?.message ??
          'Could not update billing information, please try again later',
      );
    });
};

const BillingsView = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState('');

  const { organizationIdentifier } = useSelector(
    store => store.userState.userProfile,
  );

  const [
    isUpdatingBilling,
    setUpdatingBilling,
    unsetUpdatingBilling,
  ] = useBoolean(false);

  const cancelUpdateBilling = () => {
    unsetUpdatingBilling();

    if (hashHistory.getCurrentLocation().pathname === '/subscription-payment') {
      hashHistory.push('/subscriptions');
    }
  };

  useMount(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'title',
          component: <GenericHeader>Billing & Invoices</GenericHeader>,
          alignItems: 'center',
        },
      ],
    });

    getBillingDetails({ organizationIdentifier })(dispatch);
    getInvoiceDetails({ organizationIdentifier })(dispatch);
  });

  return (
    <BillingsViewContainer>
      <BillingsViewInnerContainer>
        <StyledCollapse in={Boolean(error)} timeout={250}>
          <ErrorContainer>
            <MontserratTypography weight="600" variant="h4">
              {error}
            </MontserratTypography>
          </ErrorContainer>
          <Spacing vertical={4} />
        </StyledCollapse>
        <Elements
          locale="en-US"
          fonts={[
            {
              cssSrc:
                'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
            },
          ]}
        >
          <BillingData
            isUpdatingBilling={isUpdatingBilling}
            setUpdatingBilling={setUpdatingBilling}
            unsetUpdatingBilling={unsetUpdatingBilling}
            cancelUpdateBilling={cancelUpdateBilling}
            onSubmit={onSubmit({ setError, dispatch, organizationIdentifier })}
          />
        </Elements>
        <InvoicesList />
      </BillingsViewInnerContainer>
    </BillingsViewContainer>
  );
};

export default BillingsView;
