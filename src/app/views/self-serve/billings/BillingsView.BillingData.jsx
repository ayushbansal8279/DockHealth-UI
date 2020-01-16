import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
} from 'react-stripe-elements';
import { useToggle } from 'react-use';

import useBoolean from '../../../hooks/useBoolean';
import {
  BillingElementContainer,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
  BillingButton,
} from './BillingsView.BillingData.Components';

const PAYMENT_METHODS = {
  CREDIT: Symbol('CREDIT'),
  ACH: Symbol('ACH'),
};

const billingElementStyling = {
  base: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '1rem',
  },
};

const BillingElement = ({ Component, label, placeholder, alwaysShrink }) => {
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isEmpty, setEmpty] = useToggle(true);
  const componentReference = useRef(null);

  return (
    <StyledFormControl fullWidth>
      <StyledInputLabel shrink={isFocused || !isEmpty || alwaysShrink} required>
        {label}
      </StyledInputLabel>
      <BillingElementContainer
        onClick={() => componentReference.current?._ref.click()}
      >
        <Component
          onChange={({ empty }) => setEmpty(empty)}
          placeholder={isFocused ? placeholder : ''}
          onFocus={setFocused}
          onBlur={unsetFocused}
          style={billingElementStyling}
          ref={componentReference}
        />
      </BillingElementContainer>
    </StyledFormControl>
  );
};

const SaveBillingElement = ({ isUpdatingBilling, unsetUpdatingBilling }) =>
  isUpdatingBilling && (
    <>
      <Grid item sm={8} md={4}>
        <BillingButton onClick={unsetUpdatingBilling} variant="contained">
          Save billing
        </BillingButton>
      </Grid>
      <Grid item sm={4} md={2}>
        <BillingButton onClick={unsetUpdatingBilling} variant="outlined">
          Cancel
        </BillingButton>
      </Grid>
    </>
  );

const CreditPaymentForm = ({ isUpdatingBilling, unsetUpdatingBilling }) => (
  <>
    <Grid item sm={12} md={6}>
      <StyledFormControl fullWidth>
        <StyledInputLabel required>Name on card</StyledInputLabel>
        <StyledInputBase name="nameOnCard" placeholder="Name" />
      </StyledFormControl>
    </Grid>
    <Grid item sm={12} md={6}>
      <BillingElement
        Component={CardNumberElement}
        label="Card number"
        placeholder="1234 1234 1234 1234"
      />
    </Grid>
    <Grid item sm={12} md={6}>
      <BillingElement
        Component={CardExpiryElement}
        label="Expiration date"
        placeholder="MM/YY"
      />
    </Grid>
    <Grid item sm={12} md={6}>
      <BillingElement
        Component={CardCVCElement}
        label="CVC"
        placeholder="CVC Code"
      />
    </Grid>
    {isUpdatingBilling && (
      <>
        <Grid item sm={12}>
          <StyledFormControl fullWidth>
            <StyledInputLabel required>Billing address</StyledInputLabel>
            <StyledInputBase name="billingAddress" placeholder="Address" />
          </StyledFormControl>
        </Grid>
        <Grid item sm={12} md={6}>
          <StyledFormControl fullWidth>
            <StyledInputLabel required>Postal Code</StyledInputLabel>
            <StyledInputBase name="postalCode" placeholder="Postal code" />
          </StyledFormControl>
        </Grid>
      </>
    )}
    <SaveBillingElement
      isUpdatingBilling={isUpdatingBilling}
      unsetUpdatingBilling={unsetUpdatingBilling}
    />
  </>
);

const ACHPaymentForm = ({ isUpdatingBilling, unsetUpdatingBilling }) => {
  const [accountType, setAccountType] = useState('');

  return (
    <>
      <Grid item sm={12} md={6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel required>Routing number</StyledInputLabel>
          <StyledInputBase name="routingNumber" placeholder="000000000" />
        </StyledFormControl>
      </Grid>
      <Grid item sm={12} md={6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel required>Bank account number</StyledInputLabel>
          <StyledInputBase
            name="bankAccountNumber"
            placeholder="000000000000"
          />
        </StyledFormControl>
      </Grid>
      <Grid item sm={12} md={6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel shrink required>
            Account type
          </StyledInputLabel>
          <Select
            value={accountType}
            onChange={event => setAccountType(event.target.value)}
            placeholder="Select account type"
            input={<StyledInputBase name="accountType" />}
          >
            <MenuItem value="current">Current</MenuItem>
            <MenuItem value="checking">Checking</MenuItem>
          </Select>
        </StyledFormControl>
      </Grid>
      <Grid item sm={12} md={6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel required>Bank name</StyledInputLabel>
          <StyledInputBase name="bankName" placeholder="Bank name here" />
        </StyledFormControl>
      </Grid>
      <Grid item sm={12} md={6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel required>Account holder name</StyledInputLabel>
          <StyledInputBase
            name="accountHolderName"
            placeholder="Account name here"
          />
        </StyledFormControl>
      </Grid>
      <SaveBillingElement
        isUpdatingBilling={isUpdatingBilling}
        unsetUpdatingBilling={unsetUpdatingBilling}
      />
    </>
  );
};

const BillingData = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS.CREDIT,
  );

  const [
    isUpdatingBilling,
    setUpdatingBilling,
    unsetUpdatingBilling,
  ] = useBoolean(false);

  return (
    <>
      <Grid container spacing={8} justify="space-between">
        <RadioGroup
          name="paymentMethod"
          row
          defaultValue={PAYMENT_METHODS.CREDIT.toString()}
        >
          <FormControlLabel
            value={PAYMENT_METHODS.CREDIT.toString()}
            control={
              <Radio
                disabled={!isUpdatingBilling}
                onClick={() => setSelectedPaymentMethod(PAYMENT_METHODS.CREDIT)}
                style={{ color: '#125375' }}
              />
            }
            label="Credit Card / ATM Card"
            labelPlacement="top"
          />
          <FormControlLabel
            value={PAYMENT_METHODS.ACH.toString()}
            control={
              <Radio
                disabled={!isUpdatingBilling}
                onClick={() => setSelectedPaymentMethod(PAYMENT_METHODS.ACH)}
                style={{ color: '#125375' }}
              />
            }
            label="ACH"
            labelPlacement="top"
          />
        </RadioGroup>
        {!isUpdatingBilling && (
          <Grid item md={2} sm={12} container justify="flex-end">
            <BillingButton onClick={setUpdatingBilling} variant="outlined">
              Update billing
            </BillingButton>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={8}>
        {selectedPaymentMethod === PAYMENT_METHODS.CREDIT && (
          <CreditPaymentForm
            isUpdatingBilling={isUpdatingBilling}
            unsetUpdatingBilling={unsetUpdatingBilling}
          />
        )}
        {selectedPaymentMethod === PAYMENT_METHODS.ACH && (
          <ACHPaymentForm
            isUpdatingBilling={isUpdatingBilling}
            unsetUpdatingBilling={unsetUpdatingBilling}
          />
        )}
      </Grid>
    </>
  );
};

export default injectStripe(BillingData);
