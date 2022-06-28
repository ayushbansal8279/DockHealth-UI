import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress, Grid, Portal } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import FormInputWithMask from 'components/common/Input/FormInputWithMask';
import FormSelect from 'components/common/Select/FormSelect';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { saveContact, editContact } from 'api/contacts-api';
import { useDispatch } from 'react-redux';
import AlertMessages from 'alert/AlertMessages';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { CommunicationType } from 'helpers/task-helpers';
import { ButtonGroupFlexStyled } from './styled';
import { mapToDTO, typeOptions, validationSchema } from './helpers';

function AddContactStep({
  type,
  handleShow,
  container,
  email,
  name,
  fax,
  phone,
  identifier,
  setContactData,
}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      type: 'INDIVIDUAL',
      email,
      name,
      fax,
      phone,
    },
  });

  const { handleSubmit } = formMethods;

  const onSubmit = async data => {
    setLoading(true);

    const apiData = mapToDTO(data);
    try {
      let response;
      if (identifier) {
        response = await editContact({ ...apiData, identifier });
      } else {
        response = await saveContact(apiData);
      }
      switch (type) {
        case CommunicationType.EMAIL:
          setContactData({
            label: response.name,
            value: response.email,
            identifier: response.identifier,
          });
          break;
        case CommunicationType.FAX:
          setContactData({
            label: response.name,
            value: response.faxPhoneNumber,
            identifier: response.identifier,
          });
          break;
        default:
          console.warn(`No Value provided for ${type}`);
          break;
      }

      dispatch(showGlobalAlert(AlertMessages.SAVED));
    } catch (error) {
      dispatch(showGlobalErrorAlert());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal container={container}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <FormSelect
                name="type"
                label="Type"
                placeholder="Type of contact"
                autoFocus
                options={typeOptions}
                shrink
              />
            </Grid>
            <Grid item>
              <FormInput
                type="text"
                name="name"
                label="Contact Name"
                placeholder="Type the contact name"
                shrink
              />
            </Grid>
            <Grid item>
              <FormInput
                name="email"
                label="Email"
                placeholder="Type the email address"
                shrink
              />
            </Grid>
            <Grid item>
              <FormInput
                name="phone"
                label="Phone"
                placeholder="Type the phone number"
                shrink
              />
            </Grid>
            <Grid item>
              <FormInputWithMask
                mask="999-999-9999"
                name="fax"
                label="Fax"
                placeholder="type the fax number"
              />
            </Grid>

            <Grid item>
              <FormInput type="text" name="notes" label="Notes" shrink />
            </Grid>
            <Grid item>
              <ButtonGroupFlexStyled disabled={loading}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    handleShow(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  endIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null
                  }
                >
                  {identifier ? 'edit' : 'save'}
                </Button>
              </ButtonGroupFlexStyled>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Portal>
  );
}

export default AddContactStep;
