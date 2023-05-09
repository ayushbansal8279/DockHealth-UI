import { CircularProgress, Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import FormInputWithMask from 'components/common/Input/FormInputWithMask';
import FormSelect from 'components/common/Select/FormSelect';
import React, { useState } from 'react';
import { useForm, FormProvider, useFormState } from 'react-hook-form';
import { saveContact, editContact } from 'api/contacts-api';
import { useDispatch } from 'react-redux';
import AlertMessages from 'alert/AlertMessages';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { CommunicationType } from 'helpers/task-helpers';
import { ButtonGroupFlexStyled, ContactStepFormStyled } from './styled';
import { mapToDTO, typeOptions, resolveSchema } from './helpers';
import {
  ModalDescriptionContainer,
  ModalHeader,
  ModalHeaderContainerStyled,
  ModalWrapper,
} from '../styled';

function AddContactStep({
  type,
  handleShow,
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
    resolver: resolveSchema(type),
    mode: 'onSubmit',
    defaultValues: {
      type: 'INDIVIDUAL',
      email,
      name,
      fax,
      phone,
    },
  });

  const { handleSubmit, control } = formMethods;
  const { dirtyFields } = useFormState({
    control,
  });
  const onSubmit = async (data) => {
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
          // eslint-disable-next-line no-console
          console.warn(`No Value provided for ${type}`);
          break;
      }

      dispatch(showGlobalAlert(AlertMessages.SAVED));
    } catch (error) {
      dispatch(showGlobalErrorAlert());
    } finally {
      handleShow(false);
      setLoading(false);
    }
  };

  return (
    <ModalWrapper width="400px">
      <ModalHeaderContainerStyled>
        <ModalHeader> {identifier ? 'update' : 'create'} contact</ModalHeader>
      </ModalHeaderContainerStyled>
      <ModalDescriptionContainer>
        <FormProvider {...formMethods}>
          <ContactStepFormStyled onSubmit={handleSubmit(onSubmit)}>
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
                <FormInputWithMask
                  mask="999-999-9999"
                  name="phone"
                  label="Phone"
                  placeholder="Type the phone number"
                />
              </Grid>
              <Grid item>
                <FormInputWithMask
                  mask="999-999-9999"
                  name="fax"
                  label="Fax"
                  placeholder="Type the fax number"
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
                    disabled={Object.keys(dirtyFields).length === 0}
                    endIcon={
                      loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null
                    }
                  >
                    Save
                  </Button>
                </ButtonGroupFlexStyled>
              </Grid>
            </Grid>
          </ContactStepFormStyled>
        </FormProvider>
      </ModalDescriptionContainer>
    </ModalWrapper>
  );
}

export default AddContactStep;
