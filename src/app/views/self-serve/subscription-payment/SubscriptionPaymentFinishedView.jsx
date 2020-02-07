import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import {
  getBillingDetails,
  getBillingEstimate,
} from '../../../actions/organization-actions';
import {
  BillingButton,
  H2,
  Spacing2,
  SubscriptionPaymentViewContainer,
} from './SubscriptionPaymentView.Components';

const goToMainPage = () => {
  hashHistory.replace('/');
};

const SaveBillingElement = () => (
  <>
    <Spacing2 />
    <Grid item sm={12} container justify="flex-end">
      <BillingButton onClick={goToMainPage} variant="contained">
        Let&apos;s do this
      </BillingButton>
    </Grid>
  </>
);

const SubscriptionPaymentFinishedView = () => {
  const dispatch = useDispatch();

  const organizationId = useSelector(
    store => store.userState?.userProfile?.organizationId,
  );

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: <div />,
          alignItems: 'center',
        },
      ],
    });

    getBillingDetails({ organizationId })(dispatch);
    getBillingEstimate({ organizationId })(dispatch);
  });

  return (
    <SubscriptionPaymentViewContainer>
      <Grid container spacing={32}>
        <Grid item sm={12}>
          <H2>Your purchase is complete</H2>
        </Grid>
        <Grid item sm={12} container justify="flex-end">
          <SaveBillingElement />
        </Grid>
      </Grid>
    </SubscriptionPaymentViewContainer>
  );
};

export default SubscriptionPaymentFinishedView;
