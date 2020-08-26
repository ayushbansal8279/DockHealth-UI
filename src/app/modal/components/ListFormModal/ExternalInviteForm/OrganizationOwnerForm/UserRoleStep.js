import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import {
  RoleFormWrapper,
  RoleSelectionHeader,
  Divider,
  RoleSelectionWrapper,
  RoleOptionLabel,
  RoleOptionHeaderWrapper,
  RoleOptionHeader,
  RoleOptionDescription,
  RoleOptionHeaderAdditionalInfo,
} from './styled';

const UserRoleStep = ({ navigateToPreviousStep, disabled }) => {
  const { watch, setValue } = useFormContext();

  const roleValue = watch('role');

  return (
    <RoleFormWrapper container direction="column" justify="space-between">
      <Grid item>
        <RoleSelectionHeader>
          Select their role in your Organization
        </RoleSelectionHeader>
        <Divider />
      </Grid>
      <RoleSelectionWrapper>
        <input
          id="Member"
          type="radio"
          name="role"
          value="MEMBER"
          checked={roleValue === 'MEMBER'}
          onChange={event => setValue('role', event.target.value)}
        />
        <RoleOptionLabel isSelected={roleValue === 'MEMBER'} htmlFor="Member">
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Member</RoleOptionHeader>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            Part of your Organization. Can add and invite members who are
            already part of your organization. Can access all patients and
            people in the group/practice.
          </RoleOptionDescription>
        </RoleOptionLabel>
        <Divider />
        <input
          id="Guest"
          type="radio"
          name="role"
          value="GUEST"
          checked={roleValue === 'GUEST'}
          onChange={event => setValue('role', event.target.value)}
        />
        <RoleOptionLabel isSelected={roleValue === 'GUEST'} htmlFor="Guest">
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Guests</RoleOptionHeader>
            <RoleOptionHeaderAdditionalInfo>
              *Limited Access
            </RoleOptionHeaderAdditionalInfo>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            Not part of your Organization. Only have access to this list asks on
            this list and the patients and people on this list.
          </RoleOptionDescription>
        </RoleOptionLabel>
      </RoleSelectionWrapper>
      <Grid container item direction="row" justify="center" spacing={2}>
        <Grid item xs={5}>
          <Button
            fullWidth
            variant="outlined"
            type="button"
            size="small"
            onClick={navigateToPreviousStep}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            disabled={disabled}
            type="submit"
          >
            Assign role
          </Button>
        </Grid>
      </Grid>
    </RoleFormWrapper>
  );
};

export default UserRoleStep;
