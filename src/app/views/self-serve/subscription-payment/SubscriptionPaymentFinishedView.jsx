import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from 'actions/template-actions';
import {
  getBillingDetails,
  getBillingEstimate,
  getOrganizationById,
} from 'actions/organization-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import {
  H2,
  Spacing2,
  SubscriptionPaymentViewContainer,
  SubscriptionPaymentViewOuterContainer,
} from './SubscriptionPaymentView.Components';

const goToMainPage = () => {
  window.location.href = '/#/settings/subscriptions';
};

const SaveBillingElement = () => {
  return (
    <>
      <Spacing2 />
      <Grid item sm={12} container justify="flex-end">
        <Button onClick={() => goToMainPage()}>Continue</Button>
      </Grid>
    </>
  );
};

const SubscriptionPaymentFinishedView = () => {
  const dispatch = useDispatch();

  const organizationIdentifier = useSelector(
    store => store.userState?.userProfile?.organizationIdentifier,
  );

  useMount(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader />,
            alignItems: 'center',
          },
        ],
      }),
    );

    getOrganizationById({ organizationIdentifier })(dispatch);
    getBillingDetails({ organizationIdentifier })(dispatch);
    getBillingEstimate()(dispatch);
    sessionStorage.setItem('refreshOrgMemo', true);
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
