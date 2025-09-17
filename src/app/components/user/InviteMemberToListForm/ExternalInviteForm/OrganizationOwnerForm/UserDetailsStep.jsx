import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import Input from 'components/common/Input/Input';
import { TextField } from '@mui/material';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import IIcon from 'img/!-icon.svg';
import {
  InfoText,
  Header,
  InfoContainer,
  UserDetailsFormWrapper,
} from './styled';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import * as yup from 'yup';

const UserDetailsStep = ({
  closeInviteForm,
  disabled,
  isOrganizationAdmin,
}) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isValid, setIsValid] = useState(false);

  const firstNameValue = watch('firstName');
  const lastNameInputValue = watch('lastName');
  const emailInputValue = watch('email');

  const validationSchema = yup.object().shape({
    firstNameValue: yup.string().required(),
    lastNameInputValue: yup.string().required(),
    emailInputValue: yup.string().email().required(),
  });

  const handleValidation = async () => {
    const valid = await validationSchema.isValid({
      firstNameValue,
      lastNameInputValue,
      emailInputValue,
    });
    setIsValid(valid);
  };

  useEffect(() => {
    handleValidation();
  }, [firstNameValue, lastNameInputValue, emailInputValue]);

  const sx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'grey',
    },
  };

  const inputStyle = {
    style: {
      textTransform: 'capitalize',
    },
  };

  return (
    <UserDetailsFormWrapper>
      <Header>Invite User</Header>
      <Grid container direction="column" spacing={2}>
        <Grid
          container
          item
          direction="row"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item size={12}>
            <TextField
              sx={sx}
              InputLabelProps={inputStyle}
              type="text"
              name="firstName"
              label="First name"
              required
              error={errors?.firstName?.message}
              value={firstNameValue}
              onChange={(event) => setValue('firstName', event.target.value)}
            />
          </Grid>
          <Grid item size={12}>
            <TextField
              sx={sx}
              InputLabelProps={inputStyle}
              type="text"
              name="lastName"
              label="Last name"
              required
              error={errors?.lastName?.message}
              value={lastNameInputValue}
              onChange={(event) => setValue('lastName', event.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Spacing vertical={3} />
          <TextField
            sx={sx}
            InputLabelProps={inputStyle}
            type="email"
            name="email"
            label="Email address"
            placeholder="Type the email address to invite"
            required
            error={errors?.email?.message}
            value={emailInputValue}
            onChange={(event) => setValue('email', event.target.value)}
          />
        </Grid>
        <Grid item>
          <Spacing vertical={2} />
          <InfoContainer>
            {!isOrganizationAdmin && (
              <>
                <img src={IIcon} alt="!icon" />
                <InfoText>Approval Required</InfoText>
              </>
            )}
          </InfoContainer>
          <Spacing vertical={4} />
        </Grid>
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          spacing={2}
        >
          <Grid item size={5}>
            <CancelButton
              fullWidth
              variant="secondary"
              type="button"
              onClick={closeInviteForm}
            >
              Cancel
            </CancelButton>
          </Grid>
          <Grid item size={5}>
            <ConfirmButton
              fullWidth
              disabled={!isValid || disabled}
              type="submit"
            >
              Next
            </ConfirmButton>
          </Grid>
        </Grid>
      </Grid>
    </UserDetailsFormWrapper>
  );
};

export default UserDetailsStep;
