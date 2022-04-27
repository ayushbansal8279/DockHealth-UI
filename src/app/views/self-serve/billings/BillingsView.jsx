import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import {
  getBillingDetails,
  getInvoiceDetails,
} from 'actions/organization-actions';
import { saveBillingDetails } from 'api/organization-api';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import Spacing from 'components/common/Spacing';
import { useBoolean } from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import * as AlertActions from 'alert/actions';
import BillingData from './BillingData/BillingData';
import InvoicesList from './InvoicesList/InvoicesList';
import {
  BillingsViewContainer,
  BillingsViewInnerContainer,
  ErrorContainer,
  StyledCollapse,
} from './styled';

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
          setError('cardNumber', {
            type: 'custom',
            message:
              error?.response?.data?.errorMessage ??
              'Could not update billing information, please try again later',
          });
        });
    })
    .catch(error => {
      unsetProcessingUpdate();
      setError('cardNumber', {
        type: 'custom',
        message:
          error?.message ??
          'Could not update billing information, please try again later',
      });
    });
};

const BillingsView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [error, setError] = useState('');

  const { organizationIdentifier } = useSelector(
    store => store.userState.userProfile,
  );

  const { userProfile } = useSelector(store => ({
    userProfile: store.userState?.userProfile,
  }));

  useEffect(() => {
    if (
      !(
        userProfile?.orgUserRole === 'OWNER' ||
        userProfile?.orgUserRole === 'ADMIN'
      )
    ) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const [
    isUpdatingBilling,
    setUpdatingBilling,
    unsetUpdatingBilling,
  ] = useBoolean(false);

  const cancelUpdateBilling = () => {
    unsetUpdatingBilling();

    if (history.location === '/settings/subscription-payment') {
      history.push(SUBS_SETTINGS_PATH);
    }
  };

  useMount(() => {
    getBillingDetails({ organizationIdentifier })(dispatch);
    getInvoiceDetails({ organizationIdentifier })(dispatch);
  });

  return (
    <ViewLayout header={<BasicLayoutHeader title="Billing &amp; Invoices" />}>
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
              onSubmit={onSubmit({
                setError,
                dispatch,
                organizationIdentifier,
              })}
            />
          </Elements>
          <InvoicesList />
        </BillingsViewInnerContainer>
      </BillingsViewContainer>
    </ViewLayout>
  );
};

export default BillingsView;
