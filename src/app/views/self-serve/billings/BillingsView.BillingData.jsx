import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
} from 'react-stripe-elements';
import { useToggle } from 'react-use';

import useForm from 'react-hook-form';
import useBoolean from '../../../hooks/useBoolean';
import {
  BillingElementContainer,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
  BillingButton,
  BillingControlLabel,
  BillingRadio,
} from './BillingsView.BillingData.Components';
import { H2 } from './BillingsView.Styled';
import { saveBillingDetails } from '../../../api/organization-api';

const PAYMENT_METHODS = {
  CREDIT: 'CREDIT',
  ACH: 'ACH',
};

const billingElementStyling = {
  base: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '1rem',
  },
};

/**
 * @todo Add save billing information + Stripe handling
 *
 * @param stripe - Stripe instance
 * @param unsetUpdatingBilling - method to finish updating billing
 */
const onSubmit = ({ stripe, unsetUpdatingBilling }) => data => {
  // alert(JSON.stringify(data, null, 2));
  // console.log(stripe);

  stripe.createToken({ name: 'cardNumber' }).then(token => {
    // console.log(token);
    saveBillingDetails({
      data,
      token,
    });
  });

  // stripe.createToken(cardNumber, cardExpiry, cardCvc).then((token) => {
  //   console.log(token)
  // });

  // let response = await fetch("/charge", {
  //   method: "POST",
  //   headers: {"Content-Type": "text/plain"},
  //   body: token.id
  // });

  // if (response.ok) console.log("Purchase Complete!")

  unsetUpdatingBilling();
};

const BillingElement = ({
  Component,
  disabled,
  label,
  placeholder,
  alwaysShrink,
}) => {
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isEmpty, setEmpty] = useToggle(true);
  const [componentReference, setComponentReference] = useState(null);

  return (
    <StyledFormControl fullWidth onClick={() => componentReference?.focus()}>
      <StyledInputLabel shrink={isFocused || !isEmpty || alwaysShrink} required>
        {label}
      </StyledInputLabel>
      <BillingElementContainer>
        <Component
          onChange={({ empty }) => setEmpty(empty)}
          placeholder={isFocused ? placeholder : ''}
          onFocus={setFocused}
          onBlur={unsetFocused}
          style={billingElementStyling}
          onReady={reference => setComponentReference(reference)}
          disabled={disabled}
        />
      </BillingElementContainer>
    </StyledFormControl>
  );
};

const SaveBillingElement = ({ isUpdatingBilling, unsetUpdatingBilling }) =>
  isUpdatingBilling && (
    <Grid item sm={12} container justify="flex-end">
      <Grid item sm={6} md={2}>
        <BillingButton
          fullWidth
          onClick={unsetUpdatingBilling}
          variant="outlinedHigh"
        >
          Cancel
        </BillingButton>
      </Grid>
      <Grid item sm={6} md={4}>
        <BillingButton fullWidth type="submit" variant="contained">
          Save billing information
        </BillingButton>
      </Grid>
    </Grid>
  );

const BillingRadioGroup = ({
  isUpdatingBilling,
  setSelectedPaymentMethod,
  register,
}) => (
  <Grid item md={6}>
    <RadioGroup name="paymentMethod" row defaultValue={PAYMENT_METHODS.CREDIT}>
      <BillingControlLabel
        value={PAYMENT_METHODS.CREDIT}
        control={
          <BillingRadio
            color="default"
            disabled={!isUpdatingBilling}
            onClick={() => setSelectedPaymentMethod(PAYMENT_METHODS.CREDIT)}
            inputRef={register}
          />
        }
        label="Credit Card / ATM Card"
        labelPlacement="right"
      />
      <BillingControlLabel
        value={PAYMENT_METHODS.ACH}
        control={
          <BillingRadio
            color="default"
            disabled
            onClick={() => setSelectedPaymentMethod(PAYMENT_METHODS.ACH)}
            inputRef={register}
          />
        }
        label="ACH"
        labelPlacement="right"
      />
    </RadioGroup>
  </Grid>
);

const PaymentInformationLabel = () => (
  <Grid item xs={12}>
    <H2>Payment information</H2>
  </Grid>
);

const CreditPaymentForm = ({
  isUpdatingBilling,
  unsetUpdatingBilling,
  setSelectedPaymentMethod,
  register,
}) => {
  return (
    <>
      {isUpdatingBilling && (
        <>
          <Grid item sm={12}>
            <H2>Billing information</H2>
          </Grid>
          <Grid item sm={12} container justify="space-between">
            <BillingRadioGroup
              isUpdatingBilling={isUpdatingBilling}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              register={register}
            />
          </Grid>
          <Grid item sm={12}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>Name</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="name"
                placeholder="Name"
              />
            </StyledFormControl>
          </Grid>
          <Grid item sm={12}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>Email</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="email"
                placeholder="Email"
              />
            </StyledFormControl>
          </Grid>
          <Grid item sm={12}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>Address</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="address"
                placeholder="Address"
              />
            </StyledFormControl>
          </Grid>
          <Grid item sm={12}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>City</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="city"
                placeholder="city"
              />
            </StyledFormControl>
          </Grid>
          <Grid item sm={12} md={6}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>State</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="state"
                placeholder="State"
              />
            </StyledFormControl>
          </Grid>
          <Grid item sm={12} md={6}>
            <StyledFormControl fullWidth>
              <StyledInputLabel required>Zip</StyledInputLabel>
              <StyledInputBase
                inputRef={register}
                name="zip"
                placeholder="Zip"
              />
            </StyledFormControl>
          </Grid>
          <PaymentInformationLabel />
        </>
      )}
      <Grid item sm={12} md={isUpdatingBilling ? 12 : 6}>
        <BillingElement
          id="card-number"
          Component={CardNumberElement}
          label="Card number"
          placeholder="1234 1234 1234 1234"
          disabled={!isUpdatingBilling}
        />
      </Grid>
      <Grid item sm={12} md={isUpdatingBilling ? 12 : 6}>
        <StyledFormControl fullWidth>
          <StyledInputLabel required>Name on card</StyledInputLabel>
          <StyledInputBase
            name="nameOnCard"
            inputRef={register}
            placeholder="Name"
            disabled={!isUpdatingBilling}
          />
        </StyledFormControl>
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-expiry"
          Component={CardExpiryElement}
          label="Expiration date"
          placeholder="MM/YY"
          disabled={!isUpdatingBilling}
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-cvc"
          Component={CardCVCElement}
          label="CVC"
          placeholder="CVC Code"
          disabled={!isUpdatingBilling}
        />
      </Grid>
      <SaveBillingElement
        isUpdatingBilling={isUpdatingBilling}
        unsetUpdatingBilling={unsetUpdatingBilling}
      />
    </>
  );
};

/**
 * @deprecated
 */
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

const BillingData = ({ stripe }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS.CREDIT,
  );

  const [
    isUpdatingBilling,
    setUpdatingBilling,
    unsetUpdatingBilling,
  ] = useBoolean(false);

  const { handleSubmit, register } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit({ stripe, unsetUpdatingBilling }))}>
      {!isUpdatingBilling && (
        <Grid container spacing={16} justify="space-between">
          <Grid item sm={12}>
            <PaymentInformationLabel />
          </Grid>
          <BillingRadioGroup
            isUpdatingBilling={isUpdatingBilling}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
          <Grid item md={6} sm={12} container justify="flex-end">
            <BillingButton onClick={setUpdatingBilling} variant="outlined">
              Update billing information
            </BillingButton>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={16}>
        {selectedPaymentMethod === PAYMENT_METHODS.CREDIT && (
          <CreditPaymentForm
            isUpdatingBilling={isUpdatingBilling}
            unsetUpdatingBilling={unsetUpdatingBilling}
            setSelectedPaymentMethod={selectedPaymentMethod}
            register={register}
          />
        )}
        {selectedPaymentMethod === PAYMENT_METHODS.ACH && (
          <ACHPaymentForm
            isUpdatingBilling={isUpdatingBilling}
            unsetUpdatingBilling={unsetUpdatingBilling}
          />
        )}
      </Grid>
    </form>
  );
};

export default injectStripe(BillingData);
