import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import {
  getBillingDetails,
  getInvoiceDetails,
} from '../../../actions/organization-actions';
import { saveBillingDetails } from '../../../api/organization-api';
import { showAlert } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import BillingData from './BillingsView.BillingData';
// import InvoicesList from './BillingsView.InvoicesList';
import { BillingsViewContainer, Title } from './BillingsView.Styled';

/**
 * @param stripe - Stripe instance
 * @param unsetUpdatingBilling - method to finish updating billing
 */
const onSubmit = ({ stripe, unsetUpdatingBilling }) => data => {
  stripe
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
          toggleAlert('Billing information updated successfully!', 'success');
        })
        .catch(() => {
          showAlert({
            status: 'error',
            title: 'Error',
            text:
              'Could not update billing information, please try again later',
          });
        });
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ??
          'Could not update billing information, please try again later',
      });
    });
};

const SaveBillingElement = ({ isUpdatingBilling, unsetUpdatingBilling }) =>
  isUpdatingBilling && (
    <Grid item sm={12} container justify="flex-end">
      <Grid item sm={6} md={3}>
        <Button fullWidth onClick={unsetUpdatingBilling} variant="text">
          Cancel
        </Button>
      </Grid>
      <Grid item sm={6} md={4}>
        <Button fullWidth type="submit" variant="contained">
          Save billing information
        </Button>
      </Grid>
    </Grid>
  );

const BillingsView = () => {
  const dispatch = useDispatch();

  const { organizationIdentifier } = useSelector(
    store => store.userState.userProfile,
  );

  const [
    isUpdatingBilling,
    setUpdatingBilling,
    unsetUpdatingBilling,
  ] = useBoolean(false);

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Billing & Invoices</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });

    getBillingDetails({ organizationIdentifier })(dispatch);
    getInvoiceDetails({ organizationIdentifier })(dispatch);
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
        <BillingData
          isUpdatingBilling={isUpdatingBilling}
          setUpdatingBilling={setUpdatingBilling}
          unsetUpdatingBilling={unsetUpdatingBilling}
          onSubmit={onSubmit}
          SaveBillingElement={SaveBillingElement}
        />
      </Elements>
      {/* <InvoicesList /> */}
    </BillingsViewContainer>
  );
};

export default BillingsView;
