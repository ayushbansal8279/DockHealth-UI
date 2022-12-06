import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import Button from 'components/common/Button/Button';
import {
  getBillingDetails,
  getBillingEstimate,
  getOrganizationById,
} from 'actions/organization-actions';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  H2,
  SubscriptionPaymentViewContainer,
} from './SubscriptionPaymentView.Components';

const SubscriptionPaymentFinishedView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { organizationIdentifier } = useSelector(userProfileSelector);

  useMount(() => {
    getOrganizationById({ organizationIdentifier })(dispatch);
    getBillingDetails({ organizationIdentifier })(dispatch);
    getBillingEstimate()(dispatch);
    sessionStorage.setItem('refreshOrgMemo', true);
  });

  return (
    <ViewLayout header={<LayoutHeader />}>
      <SubscriptionPaymentViewContainer>
        <Grid container spacing={4}>
          <Grid item sm={12}>
            <H2>Your purchase is complete</H2>
          </Grid>
          <Grid item sm={12} container justify="flex-end">
            <Box m={2} />
            <Grid item sm={12} container>
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
    </ViewLayout>
  );
};

export default SubscriptionPaymentFinishedView;
