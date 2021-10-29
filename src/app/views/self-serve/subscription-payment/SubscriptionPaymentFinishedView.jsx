import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import { setHeader } from 'actions/template-actions';
import Button from 'components/common/Button/Button';
import {
  getBillingDetails,
  getBillingEstimate,
  getOrganizationById,
} from 'actions/organization-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import {
  H2,
  SubscriptionPaymentViewContainer,
  SubscriptionPaymentViewOuterContainer,
} from './SubscriptionPaymentView.Components';

const SubscriptionPaymentFinishedView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
            <Box m={2} />
            <Grid item sm={12} container justify="flex-end">
              <Button
                width={200}
                onClick={() => history.push(SUBS_SETTINGS_PATH)}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </SubscriptionPaymentViewContainer>
    </SubscriptionPaymentViewOuterContainer>
  );
};

export default SubscriptionPaymentFinishedView;
