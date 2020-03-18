import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import {
  getBillingDetails,
  getBillingEstimate,
  getOrganizationById,
} from '../../../actions/organization-actions';
import GenericHeader from '../../../components/common/GenericHeader';
import {
  BillingButton,
  H2,
  Spacing2,
  SubscriptionPaymentViewContainer,
  SubscriptionPaymentViewOuterContainer,
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

  const organizationIdentifier = useSelector(
    store => store.userState?.userProfile?.organizationIdentifier,
  );

  useMount(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'title',
          component: <GenericHeader />,
          alignItems: 'center',
        },
      ],
    });

    getOrganizationById({ organizationIdentifier })(dispatch);
    getBillingDetails({ organizationIdentifier })(dispatch);
    getBillingEstimate()(dispatch);
  });

  return (
    <SubscriptionPaymentViewOuterContainer>
      <SubscriptionPaymentViewContainer>
        <Grid container spacing={4}>
          <Grid item sm={12}>
            <H2>Your purchase is complete</H2>
          </Grid>
          <Grid item sm={12} container justify="flex-end">
            <SaveBillingElement />
          </Grid>
        </Grid>
      </SubscriptionPaymentViewContainer>
    </SubscriptionPaymentViewOuterContainer>
  );
};

export default SubscriptionPaymentFinishedView;
