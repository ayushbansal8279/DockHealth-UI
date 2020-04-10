import { Button, Collapse, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
} from 'react-stripe-elements';
import { useEffectOnce, useToggle } from 'react-use';
import { object, string } from 'yup';
import Spacing from '../../../components/common/Spacing';
import {
  UniversalFormControl,
  UniversalInputLabel,
  UniversalMontserratInput,
} from '../../../components/userProfileView/UniversalInput';
import useBoolean from '../../../hooks/useBoolean';
import palette from '../../../palette';
import { MontserratTypography } from '../../../theme-montserrat';
import BillingInformation from './BillingsView.BillingData.BillingInformation';
import {
  BillingElementContainer,
  FormContainer,
  StyledFormHelperText,
} from './BillingsView.BillingData.Components';

const REQUIRED_MESSAGE = 'This field is required.';

const billingElementStyling = {
  base: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: '16px',
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
}) => {
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isEmpty, setEmpty] = useToggle(true);
  const [componentReference, setComponentReference] = useState(null);

  const [fieldError, setFieldError] = useState(null);

  return (
    <>
      <UniversalFormControl
        fullWidth
        onClick={() => componentReference?.focus()}
        error={Boolean(fieldError)}
      >
        <UniversalInputLabel shrink={isFocused || !isEmpty || alwaysShrink}>
          <MontserratTypography variant="h4">
            <span>{label} </span>
            <span style={{ color: palette.oPlusRed }}>*</span>
          </MontserratTypography>
        </UniversalInputLabel>
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
      </UniversalFormControl>
      <Collapse in={Boolean(fieldError)}>
        <StyledFormHelperText>{fieldError}</StyledFormHelperText>
      </Collapse>
    </>
  );
};

const SaveBillingElement = ({ isUpdatingBilling, unsetUpdatingBilling }) =>
  isUpdatingBilling && (
    <Grid item sm={12} container justify="flex-end" wrap="nowrap">
      <Button size="small" onClick={unsetUpdatingBilling} variant="text">
        <MontserratTypography
          variant="h4"
          textDecoration="underline"
          weight="600"
        >
          CANCEL
        </MontserratTypography>
      </Button>
      <Spacing horizontal={4} />
      <Button type="submit" variant="contained" size="small">
        SAVE
      </Button>
    </Grid>
  );

const getInputPropsMethod = ({ setValue, values, errors }) => ({ name }) => ({
  onChange: event => setValue(name, event.target.value),
  name,
  value: values[name],
  error: Boolean(errors[name]),
});

const CreditPaymentForm = ({
  isUpdatingBilling,
  unsetUpdatingBilling,
  setValue,
  values,
  errors,
}) => {
  const getInputProps = getInputPropsMethod({ setValue, values, errors });

  return (
    <FormContainer container spacing={2} visible={isUpdatingBilling}>
      <Grid item sm={12}>
        <MontserratTypography variant="h4">
          Credit card information
        </MontserratTypography>
      </Grid>
      <Spacing vertical={3} />
      <Grid item sm={12} md={6}>
        <UniversalMontserratInput
          name="nameOnCard"
          label="Name on card"
          required
        />
      </Grid>
      <Grid item sm={12} md={6}>
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
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-expiry"
          Component={CardExpiryElement}
          label="Expiration date"
          placeholder="MM/YY"
          isUpdatingBilling={isUpdatingBilling}
          required
          alwaysShrink
          inputProps={getInputProps({ name: 'cardExpiration' })}
        />
      </Grid>
      <Spacing vertical={4} />
      <Grid item sm={12}>
        <MontserratTypography variant="h4">
          Billing address
        </MontserratTypography>
      </Grid>
      <Spacing vertical={3} />
      <Grid item sm={12}>
        <UniversalMontserratInput name="name" label="Name" required />
      </Grid>
      <Grid item sm={12}>
        <UniversalMontserratInput name="email" label="Email" required />
      </Grid>
      <Grid item sm={12}>
        <UniversalMontserratInput
          name="address"
          label="Address line 1"
          required
        />
      </Grid>
      <Grid item sm={12}>
        <UniversalMontserratInput name="address2" label="Address line 2" />
      </Grid>
      <Grid item sm={12} md={3}>
        <UniversalMontserratInput name="zip" label="ZIP" required />
      </Grid>
      <Grid item sm={12} md={6}>
        <UniversalMontserratInput name="city" label="City" required />
      </Grid>
      <Grid item sm={12} md={3}>
        <UniversalMontserratInput name="state" label="State" required />
      </Grid>
      <SaveBillingElement
        isUpdatingBilling={isUpdatingBilling}
        unsetUpdatingBilling={unsetUpdatingBilling}
      />
    </FormContainer>
  );
};

const BillingData = ({
  stripe,
  isUpdatingBilling,
  setUpdatingBilling,
  unsetUpdatingBilling,
  onSubmit,
}) => {
  const { billingDetails, userProfile } = useSelector(store => ({
    billingDetails: store.organizationState.billingDetails,
    userProfile: store.userState.userProfile,
  }));

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    watch,
    unregister,
    clearError,
  } = formMethods;

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
    <form
      onSubmit={handleSubmit(onSubmit({ stripe, unsetUpdatingBilling }))}
      autoComplete="off"
      autoCorrect="off"
    >
      <FormContext {...formMethods}>
        <CreditPaymentForm
          isUpdatingBilling={isUpdatingBilling}
          unsetUpdatingBilling={unsetUpdatingBilling}
          setValue={setValue}
          values={values}
          errors={errorsValues}
        />
        {!isUpdatingBilling && (
          <BillingInformation setUpdatingBilling={setUpdatingBilling}>
            Update billing
          </BillingInformation>
        )}
      </FormContext>
    </form>
  );
};

export default injectStripe(BillingData);
