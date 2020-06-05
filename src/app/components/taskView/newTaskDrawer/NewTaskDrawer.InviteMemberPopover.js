import { Button, Grid } from '@material-ui/core';
import { shape, string, func } from 'prop-types';
import React from 'react';
import { FormContext } from 'react-hook-form';

import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { noop } from 'helpers/utility-functions';
import { RobotoTypography } from 'styles/theme';

import InputPopover from './NewTaskDrawer.InputPopover';
import initializeInviteMemberPopoverHooks from './NewTaskDrawer.InviteMemberPopover.Hooks';
import { FormContainer } from './NewTaskDrawer.InviteMemberPopover.Styled';
import TextInput from './NewTaskDrawer.TextInput';

const InviteMemberPopover = ({
  anchorElement,
  isPopoverOpen,
  closePopover,
  initialValue,
  setParentFormValue,
  taskList,
}) => {
  const taskListIdentifier = taskList?.taskListIdentifier;
  const {
    formMethods,
    onSubmit,
    isInviting,
  } = initializeInviteMemberPopoverHooks({
    closePopover,
    initialValue,
    taskListIdentifier,
    isPopoverOpen,
    setParentFormValue,
  });

  const { handleSubmit } = formMethods;

  return (
    <InputPopover
      anchorElement={anchorElement}
      isPopoverOpen={isPopoverOpen}
      closePopover={closePopover}
    >
      <FormContext {...formMethods}>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextInput
                  name="firstName"
                  label="First Name"
                  required
                  placeholder="Type the first name of person to invite"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="lastName"
                  label="Last Name"
                  required
                  placeholder="Type the last name of person to invite"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="email"
                  label="Email"
                  required
                  placeholder="Type the email address of person to invite"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Spacing vertical={3} />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="small"
                  disabled={isInviting}
                >
                  <Grid
                    container
                    wrap="nowrap"
                    justify="center"
                    alignItems="center"
                  >
                    <RobotoTypography variant="h4" condensed>
                      Invite
                    </RobotoTypography>
                    {isInviting && (
                      <>
                        <Spacing horizontal={3} />
                        <Loader size={16} />
                      </>
                    )}
                  </Grid>
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormContainer>
      </FormContext>
    </InputPopover>
  );
};

InviteMemberPopover.propTypes = {
  ...InputPopover.propTypes,
  initialValue: string,
  taskList: shape({
    taskListIdentifier: string.isRequired,
  }),
  setParentFormValue: func,
};

InviteMemberPopover.defaultProps = {
  ...InputPopover.defaultProps,
  initialValue: '',
  taskList: {},
  setParentFormValue: noop,
};

export default InviteMemberPopover;
