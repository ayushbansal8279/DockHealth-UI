import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
} from 'react-stripe-elements';
import { useEffectOnce, useToggle } from 'react-use';
import { object, string } from 'yup';
import useBoolean from '../../../hooks/useBoolean';
import {
  BillingButton,
  BillingElementContainer,
  StyledFormControl,
  StyledFormHelperText,
  StyledInputBase,
  StyledInputLabel,
} from './BillingsView.BillingData.Components';
import { H2 } from './BillingsView.Styled';

const PAYMENT_METHODS = {
  CREDIT: 'CREDIT',
  ACH: 'ACH',
};

const REQUIRED_MESSAGE = 'This field is required.';

const billingElementStyling = {
  base: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '1rem',
  },
};

const formFields = [
  {
    key: 'nameOnCard',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
  {
    key: 'name',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
  {
    key: 'cardExpiration',
    defaultValue: '',
  },
  {
    key: 'cardNumber',
    defaultValue: '',
  },
  {
    key: 'cardCvc',
    defaultValue: '',
  },
  {
    key: 'email',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE)
      .email('This field requires valid email address'),
  },
  {
    key: 'city',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
  {
    key: 'address',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
  {
    key: 'zip',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
  {
    key: 'state',
    defaultValue: '',
    validation: string()
      .required(REQUIRED_MESSAGE)
      .typeError(REQUIRED_MESSAGE),
  },
];

const validationSchema = object().shape(
  Object.fromEntries(
    formFields
      .map(({ key, validation }) => (validation ? [key, validation] : null))
      .filter(Boolean),
  ),
);

const BillingElement = ({
  Component,
  disabled,
  label,
  placeholder,
  alwaysShrink,
  isUpdatingBilling,
  inputProps = {},
}) => {
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isEmpty, setEmpty] = useToggle(true);
  const [componentReference, setComponentReference] = useState(null);

  const [fieldError, setFieldError] = useState(null);

  if (isUpdatingBilling) {
    return (
      <>
        <StyledFormControl
          fullWidth
          onClick={() => componentReference?.focus()}
          error={Boolean(fieldError)}
        >
          <StyledInputLabel
            shrink={isFocused || !isEmpty || alwaysShrink}
            required
          >
            {label}
          </StyledInputLabel>
          <BillingElementContainer error={Boolean(fieldError)}>
            <Component
              onChange={({ empty, error }) => {
                setFieldError(error?.message ?? null);
                setEmpty(empty);
              }}
              placeholder={isFocused ? placeholder : undefined}
              onFocus={setFocused}
              onBlur={unsetFocused}
              style={billingElementStyling}
              onReady={reference => setComponentReference(reference)}
              disabled={disabled}
            />
          </BillingElementContainer>
        </StyledFormControl>
        <Collapse in={Boolean(fieldError)}>
          <StyledFormHelperText>{fieldError}</StyledFormHelperText>
        </Collapse>
      </>
    );
  }

  return (
    <StyledFormControl fullWidth>
      <StyledInputLabel required>{label}</StyledInputLabel>
      <StyledInputBase {...inputProps} placeholder={placeholder} disabled />
    </StyledFormControl>
  );
};

const PaymentInformationLabel = () => (
  <Grid item xs={12}>
    <H2>Payment information</H2>
  </Grid>
);

const getInputPropsMethod = ({ setValue, values, errors }) => ({ name }) => ({
  onChange: event => setValue(name, event.target.value),
  name,
  value: values[name],
  error: Boolean(errors[name]),
});

const StyledFormInput = ({
  name,
  label,
  error,
  required,
  getInputProps,
  ...props
}) => (
  <>
    <StyledFormControl fullWidth error={Boolean(error)}>
      <StyledInputLabel required={required}>{label}</StyledInputLabel>
      <StyledInputBase {...getInputProps({ name })} {...props} />
    </StyledFormControl>
    <Collapse in={Boolean(error)}>
      <StyledFormHelperText>{error}</StyledFormHelperText>
    </Collapse>
  </>
);

const CreditPaymentForm = ({
  isUpdatingBilling,
  unsetUpdatingBilling,
  setValue,
  values,
  errors,
  SaveBillingElement,
}) => {
  const getInputProps = getInputPropsMethod({ setValue, values, errors });

  return (
    <>
      {isUpdatingBilling && (
        <>
          <Grid item sm={12}>
            <H2>Billing information</H2>
          </Grid>
          <Grid item sm={12}>
            <StyledFormInput
              name="name"
              placeholder="Name"
              label="Name"
              error={errors.name}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
          </Grid>
          <Grid item sm={12}>
            <StyledFormInput
              name="email"
              placeholder="Email"
              label="Email"
              error={errors.email}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
          </Grid>
          <Grid item sm={12}>
            <StyledFormInput
              name="address"
              placeholder="Address"
              label="Address"
              error={errors.address}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
          </Grid>
          <Grid item sm={12}>
            <StyledFormInput
              name="city"
              placeholder="City"
              label="City"
              error={errors.city}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <StyledFormInput
              name="state"
              placeholder="State"
              label="State"
              error={errors.state}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <StyledFormInput
              name="zip"
              placeholder="Zip"
              label="Zip"
              error={errors.zip}
              required
              getInputProps={getInputProps}
              autoComplete="none"
            />
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
          isUpdatingBilling={isUpdatingBilling}
          required
          alwaysShrink
          inputProps={getInputProps({ name: 'cardNumber' })}
        />
      </Grid>
      <Grid item sm={12} md={isUpdatingBilling ? 12 : 6}>
        <StyledFormInput
          name="nameOnCard"
          placeholder="Name"
          label="Name on card"
          error={errors.nameOnCard}
          getInputProps={getInputProps}
          disabled={!isUpdatingBilling}
          autoComplete="none"
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-expiry"
          Component={CardExpiryElement}
          label="Expiration date"
          placeholder="MM/YY"
          disabled={!isUpdatingBilling}
          isUpdatingBilling={isUpdatingBilling}
          required
          alwaysShrink
          inputProps={getInputProps({ name: 'cardExpiration' })}
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-cvc"
          Component={CardCVCElement}
          label="CVC"
          placeholder="CVC Code"
          disabled={!isUpdatingBilling}
          isUpdatingBilling={isUpdatingBilling}
          required
          alwaysShrink
          inputProps={getInputProps({ name: 'cardCvc' })}
        />
      </Grid>
      <SaveBillingElement
        isUpdatingBilling={isUpdatingBilling}
        unsetUpdatingBilling={unsetUpdatingBilling}
      />
    </>
  );
};

const BillingData = ({
  stripe,
  isUpdatingBilling,
  setUpdatingBilling,
  unsetUpdatingBilling,
  onSubmit,
  SaveBillingElement,
}) => {
  const [selectedPaymentMethod] = useState(PAYMENT_METHODS.CREDIT);

  const { billingDetails, userProfile } = useSelector(store => ({
    billingDetails: store.organizationState.billingDetails,
    userProfile: store.userState.userProfile,
  }));

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    watch,
    unregister,
    clearError,
  } = useForm({
    validationSchema,
  });

  useEffectOnce(() => {
    formFields.forEach(({ key }) => {
      register({ name: key });
    });

    return () => {
      formFields.forEach(({ key }) => {
        unregister(key);
      });
    };
  });

  useEffect(() => {
    const {
      billingAddressCity,
      billingAddressLine1,
      billingAddressPostalCode,
      billingAddressState,
      billingEmail,
      billingName,
      cardExpiration,
      cardLastFour,
    } = billingDetails || {};

    const currentUserName = `${userProfile.firstName} ${userProfile.lastName}`.trim();

    setValue('name', billingName ?? currentUserName);
    setValue('nameOnCard', billingName);
    setValue('cardExpiration', cardExpiration ?? '**/**');
    setValue(
      'cardNumber',
      `${'*'.repeat(4)} ${'*'.repeat(4)} ${'*'.repeat(4)} ${cardLastFour ??
        '*'.repeat(4)}`,
    );
    setValue('cardCvc', '***');
    setValue('email', billingEmail ?? userProfile.email);
    setValue('city', billingAddressCity);
    setValue('address', billingAddressLine1);
    setValue('zip', billingAddressPostalCode);
    setValue('state', billingAddressState);

    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingDetails, isUpdatingBilling]);

  const values = Object.fromEntries(
    formFields.map(({ key, defaultValue }) => [
      key,
      watch(key) ?? defaultValue,
    ]),
  );

  const errorsValues = Object.fromEntries(
    formFields.map(({ key }) => [key, errors?.[key]?.message ?? '']),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit({ stripe, unsetUpdatingBilling }))}>
      {!isUpdatingBilling && (
        <Grid container spacing={16} justify="space-between">
          <Grid item sm={12}>
            <PaymentInformationLabel />
          </Grid>
          <Grid item sm={12} container justify="flex-end">
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
            setValue={setValue}
            values={values}
            errors={errorsValues}
            SaveBillingElement={SaveBillingElement}
          />
        )}
      </Grid>
    </form>
  );
};

export default injectStripe(BillingData);
