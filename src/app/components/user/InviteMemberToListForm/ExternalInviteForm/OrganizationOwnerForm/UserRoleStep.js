import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { UserOrganizationRole } from 'helpers/user-helper';
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

const { DOCK_PRO } = UserOrganizationRole;

const UserRoleStep = ({ navigateToPreviousStep, disabled }) => {
  const { watch, setValue } = useFormContext();

  const roleValue = watch('userRole');

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
          name="userRole"
          value="MEMBER"
          checked={roleValue === 'MEMBER'}
          onChange={event => setValue(event.target.name, event.target.value)}
        />
        <RoleOptionLabel isSelected={roleValue === 'MEMBER'} htmlFor="Member">
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Member</RoleOptionHeader>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            Part of your Organization. Can add and invite members who are
            already part of your organization. Can access all patients/clients
            and people in the group/practice.
          </RoleOptionDescription>
        </RoleOptionLabel>
        <Divider />
        <input
          id="Guest"
          type="radio"
          name="userRole"
          value="GUEST"
          checked={roleValue === 'GUEST'}
          onChange={event => setValue(event.target.name, event.target.value)}
        />
        <RoleOptionLabel isSelected={roleValue === 'GUEST'} htmlFor="Guest">
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Guests</RoleOptionHeader>
            <RoleOptionHeaderAdditionalInfo>
              *Limited Access
            </RoleOptionHeaderAdditionalInfo>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            An outside collaborator you can invite into selected lists, who will
            only have access to the tasks, patients/clients and people who are
            part of those lists.
          </RoleOptionDescription>
        </RoleOptionLabel>
        <Divider />
        <input
          id="DockPro"
          type="radio"
          name="dockPro"
          value={DOCK_PRO}
          checked={roleValue === DOCK_PRO}
          onChange={event => setValue(event.target.name, event.target.value)}
        />
        <RoleOptionLabel isSelected={roleValue === DOCK_PRO} htmlFor="Dock Pro">
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Dock Pro</RoleOptionHeader>
            <RoleOptionHeaderAdditionalInfo>
              *Limited Access
            </RoleOptionHeaderAdditionalInfo>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            A Dock Pro user you invite will only have access to the workflow
            library and can help your team with building out Workflows for your
            team.
          </RoleOptionDescription>
        </RoleOptionLabel>
      </RoleSelectionWrapper>
      <Grid container item direction="row" justify="center" spacing={2}>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="secondary"
            type="button"
            onClick={navigateToPreviousStep}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={7}>
          <Button fullWidth disabled={disabled} type="submit">
            Assign role and Invite
          </Button>
        </Grid>
      </Grid>
    </RoleFormWrapper>
  );
};

export default UserRoleStep;
