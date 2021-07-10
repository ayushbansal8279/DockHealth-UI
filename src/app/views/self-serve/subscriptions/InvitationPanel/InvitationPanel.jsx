import { Grid } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { invitePersonToOrganization } from 'actions/people-actions';
import { noop, showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import Button from 'components/common/Button/Button';
import * as AlertActions from 'alert/actions';
import FormInput from 'components/common/Input/FormInput';
import {
  CloseButtonContainer,
  InvitationPanelContainer,
  InvitationPanelHeader,
  PanelButtonContainer,
} from './styled';

const REQUIRED_MESSAGE = 'This field is required';

const animationProperties = {
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: '8.375rem', opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

const onSubmit = ({ closeInvitationPanel, dispatch, getAllUsers }) => data => {
  invitePersonToOrganization(data)(dispatch)
    .then(() => {
      dispatch(
        AlertActions.showGlobalAlert('User added successfully', 'success'),
      );
      getAllUsers();
      closeInvitationPanel();
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ?? 'User could not be added, please try again later',
      });
    });
};

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('Please enter a valid email address'),
});

const InvitationPanel = ({ getAllUsers = () => {} }) => {
  const dispatch = useDispatch();

  const [
    isInvitationPanelOpen,
    openInvitationPanel,
    closeInvitationPanel,
  ] = useBoolean(false);

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  return (
    <InvitationPanelContainer open={isInvitationPanelOpen}>
      <InvitationPanelHeader>
        <Button
          width="400px"
          size="small"
          variant="text"
          onClick={openInvitationPanel}
        >
          + Add more users to my organization
        </Button>
        <CloseButtonContainer
          open={isInvitationPanelOpen}
          onClick={isInvitationPanelOpen ? closeInvitationPanel : noop}
        >
          &times;
        </CloseButtonContainer>
      </InvitationPanelHeader>
      <AnimatePresence>
        {isInvitationPanelOpen && (
          <motion.form
            {...animationProperties}
            onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              formMethods.handleSubmit(
                onSubmit({ closeInvitationPanel, dispatch, getAllUsers }),
              )(event);
            }}
            autoComplete="off"
            autoCorrect="off"
          >
            <FormContext {...formMethods}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormInput
                    name="firstName"
                    label="First Name"
                    autoComplete={uuid()}
                    isRequired
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormInput
                    name="lastName"
                    label="Last Name"
                    autoComplete={uuid()}
                    isRequired
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInput
                    name="email"
                    label="Email"
                    autoComplete={uuid()}
                    isRequired
                  />
                </Grid>
              </Grid>
              <PanelButtonContainer container justify="flex-end">
                <Button
                  width="150px"
                  size="small"
                  variant="text"
                  onClick={closeInvitationPanel}
                >
                  Cancel
                </Button>
                <Button type="submit" width="300px" size="small">
                  Add to organization
                </Button>
              </PanelButtonContainer>
            </FormContext>
          </motion.form>
        )}
      </AnimatePresence>
    </InvitationPanelContainer>
  );
};

export default InvitationPanel;
