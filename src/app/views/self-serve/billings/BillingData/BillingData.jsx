import { Grid } from '@material-ui/core';
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
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import useBoolean from 'hooks/useBoolean';
import CardAmexIcon from 'img/cards/american-express.png';
import CardDiscoverIcon from 'img/cards/discover.png';
import CardMastercardIcon from 'img/cards/mastercard.png';
import CardVisaIcon from 'img/cards/visa.png';
import { MontserratTypography } from 'styles/theme-montserrat';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import BillingInformation from '../BillingInformation/BillingInformation';
import {
  AcceptedCardsContainer,
  AddressLineToggleContainer,
  FormContainer,
} from './styled';
import { StyledCollapse, H3, Anchor } from '../styled';

const CardNumberInput = ({ inputRef, onChange, ...restProps }) => {
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <CardNumberElement
      ref={inputRef}
      showIcon={!isEmpty}
      onChange={event => {
        // eslint-disable-next-line no-unused-expressions
        onChange?.(event);
        if (isEmpty !== event.empty) setIsEmpty(event.empty);
      }}
      {...restProps}
    />
  );
};

const CardExpiryInput = ({ inputRef, ...restProps }) => {
  return <CardExpiryElement ref={inputRef} {...restProps} />;
};

const CardCvcInput = ({ inputRef, ...restProps }) => {
  return <CardCVCElement ref={inputRef} {...restProps} />;
};

const REQUIRED_MESSAGE = 'This field is required.';

const formFields = [
  {
    key: 'nameOnCard',
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
  name,
  label,
  required,
  endAdornment,
}) => {
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [fieldError, setFieldError] = useState(null);

  return (
    <Input
      name={name}
      label={label}
      required={required}
      disabled={disabled}
      shrink={!isEmpty || isFocused}
      onFocus={setFocused}
      onBlur={unsetFocused}
      placeholder=""
      error={fieldError}
      customInputComponent={Component}
      endAdornment={isEmpty && endAdornment}
      onChange={({ empty, error }) => {
        if (empty !== isEmpty) setIsEmpty(empty);

        setFieldError(error?.message ?? null);
      }}
    />
  );
};

const SaveBillingElement = ({ processingPayment, cancelSaveBillingClick }) => (
  <>
    <Spacing vertical={2} />
    <Grid item sm={12} container wrap="nowrap" justify="flex-end">
      <H3>
        <span>By selecting Subscribe I agree to the </span>
        <Anchor
          href="https://www.dock.health/terms-and-conditions"
          target="_blank"
        >
          Terms and Conditions
        </Anchor>
      </H3>
    </Grid>
    <Grid item sm={12} container justify="flex-end" wrap="nowrap">
      <Button
        onClick={cancelSaveBillingClick}
        variant="text"
        disabled={processingPayment}
        width="300px"
      >
        <MontserratTypography
          variant="h4"
          textDecoration="underline"
          weight="600"
        >
          CANCEL
        </MontserratTypography>
      </Button>
      <Spacing horizontal={4} />
      <Button type="submit" disabled={processingPayment} width="300px">
        {processingPayment ? <Loader size={LoaderSizes.medium} /> : 'Subscribe'}
      </Button>
    </Grid>
  </>
);

const UpdateBillingElement = ({
  isUpdatingBilling,
  cancelUpdateBilling,
  processingUpdate,
}) =>
  isUpdatingBilling && (
    <Grid item sm={12} container justify="flex-end" wrap="nowrap">
      <Button
        onClick={cancelUpdateBilling}
        variant="text"
        disabled={processingUpdate}
        width="300px"
      >
        <MontserratTypography
          variant="h4"
          textDecoration="underline"
          weight="600"
        >
          CANCEL
        </MontserratTypography>
      </Button>
      <Spacing horizontal={4} />
      <Button type="submit" disabled={processingUpdate} width="300px">
        {processingUpdate ? <Loader size={LoaderSizes.medium} /> : 'SAVE'}
      </Button>
    </Grid>
  );

const CreditPaymentForm = ({
  isUpdatingBilling,
  cancelUpdateBilling,
  firstTimeSaveBillingDetails,
  processingPayment,
  cancelSaveBillingClick,
  hasDiscountCode,
  processingUpdate,
}) => {
  const [addressLine2Visible, toggleAddressLine2Visible] = useToggle(false);

  return (
    <FormContainer container spacing={2} visible={isUpdatingBilling}>
      <Grid item sm={12}>
        <MontserratTypography variant="h4">
          Credit card information
        </MontserratTypography>
      </Grid>
      <Spacing vertical={3} />
      <Grid item sm={12} md={6}>
        <FormInput required name="nameOnCard" label="Name on card" />
      </Grid>
      <Grid item sm={12} md={6} style={{ placeSelf: 'flex-end' }}>
        <BillingElement
          id="card-number"
          name="cardNumber"
          Component={CardNumberInput}
          label="Card number"
          required
          onChange={() => {}}
          endAdornment={
            <AcceptedCardsContainer>
              <img alt="Visa" title="Visa" src={CardVisaIcon} />
              <img
                alt="Mastercard"
                title="Mastercard"
                src={CardMastercardIcon}
              />
              <img
                alt="American Express"
                title="American Express"
                src={CardAmexIcon}
              />
              <img alt="Discover" title="Discover" src={CardDiscoverIcon} />
            </AcceptedCardsContainer>
          }
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-expiry"
          name="cardExpiration"
          Component={CardExpiryInput}
          label="Expiration date"
          required
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <BillingElement
          id="card-cvc"
          name="cardCvc"
          Component={CardCvcInput}
          label="CVC"
          disabled={!isUpdatingBilling}
          required
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
        <FormInput required name="address" label="Address line 1" />
      </Grid>
      <Grid item sm={12}>
        <MontserratTypography variant="h4">
          <AddressLineToggleContainer onClick={toggleAddressLine2Visible}>
            <span>{addressLine2Visible ? '×' : '+'}</span>
            <span> Address line 2</span>
          </AddressLineToggleContainer>
        </MontserratTypography>
        <StyledCollapse in={addressLine2Visible} timeout={250}>
          <Spacing vertical={3} />
          <FormInput name="address2" label="" />
        </StyledCollapse>
      </Grid>
      <Grid item sm={12} md={3}>
        <FormInput required name="zip" label="ZIP" />
      </Grid>
      <Grid item sm={12} md={6}>
        <FormInput required name="city" label="City" />
      </Grid>
      <Grid item sm={12} md={3}>
        <FormInput required name="state" label="State" />
      </Grid>
      {hasDiscountCode && <Grid item sm={12} md={9} />}
      {hasDiscountCode && (
        <Grid item sm={12} md={3} wrap="nowrap" justify="flex-end">
          <FormInput name="discountCode" label="Discount code" />
        </Grid>
      )}
      {firstTimeSaveBillingDetails && (
        <SaveBillingElement
          processingPayment={processingPayment}
          cancelSaveBillingClick={cancelSaveBillingClick}
        />
      )}
      {!firstTimeSaveBillingDetails && (
        <UpdateBillingElement
          isUpdatingBilling={isUpdatingBilling}
          cancelUpdateBilling={cancelUpdateBilling}
          processingUpdate={processingUpdate}
        />
      )}
    </FormContainer>
  );
};

const BillingData = ({
  stripe,
  isUpdatingBilling,
  setUpdatingBilling,
  unsetUpdatingBilling,
  cancelUpdateBilling,
  onSubmit,
  firstTimeSaveBillingDetails,
  processingPayment,
  cancelSaveBillingClick,
}) => {
  const { billingDetails, hasDiscountCode } = useSelector(store => ({
    billingDetails: store.organizationState.billingDetails,
    userProfile: store.userState.userProfile,
    hasDiscountCode: store.organizationState?.referralConfig?.hasDiscountCode,
  }));

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const {
    handleSubmit,
    register,
    setValue,
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
      billingAddressLine2,
      billingAddressPostalCode,
      billingAddressState,
      billingName,
      cardExpiration,
      cardLastFour,
    } = billingDetails || {};

    setValue('nameOnCard', billingName ?? '');
    setValue('cardExpiration', cardExpiration ?? '**/**');
    setValue(
      'cardNumber',
      `${'*'.repeat(4)} ${'*'.repeat(4)} ${'*'.repeat(4)} ${cardLastFour ??
        '*'.repeat(4)}`,
    );
    setValue('cardCvc', '***');
    setValue('city', billingAddressCity);
    setValue('address', billingAddressLine1);
    setValue('address2', billingAddressLine2);
    setValue('zip', billingAddressPostalCode);
    setValue('state', billingAddressState);

    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingDetails, isUpdatingBilling]);

  const [
    processingUpdate,
    setProcessingUpdate,
    unsetProcessingUpdate,
  ] = useBoolean(false);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit({
          stripe,
          unsetUpdatingBilling,
          setProcessingUpdate,
          unsetProcessingUpdate,
        }),
      )}
      autoComplete="off"
      autoCorrect="off"
    >
      <FormContext {...formMethods}>
        <CreditPaymentForm
          isUpdatingBilling={isUpdatingBilling}
          cancelUpdateBilling={cancelUpdateBilling}
          firstTimeSaveBillingDetails={firstTimeSaveBillingDetails}
          processingPayment={processingPayment}
          cancelSaveBillingClick={cancelSaveBillingClick}
          hasDiscountCode={hasDiscountCode}
          processingUpdate={processingUpdate}
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
