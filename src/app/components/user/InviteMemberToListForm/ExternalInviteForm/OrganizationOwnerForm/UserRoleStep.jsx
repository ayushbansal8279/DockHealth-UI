import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import { UserOrganizationRole } from 'helpers/user-helper';
import { useSelector } from 'react-redux';
import {
  userHasViewOnlyFeatureSelector,
  userHasDockGuestFeatureSelector,
} from 'selectors/user-selectors';
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

const { DOCK_PRO, VIEW_ONLY } = UserOrganizationRole;

const UserRoleStep = ({ navigateToPreviousStep, disabled }) => {
  const { watch, setValue } = useFormContext();

  const roleValue = watch('userRole');
  const viewOnlyRoleAvailable = useSelector(userHasViewOnlyFeatureSelector);
  const guestRoleAvailable = useSelector(userHasDockGuestFeatureSelector);

  return (
    <RoleFormWrapper
      container
      direction="column"
      justifyContent="space-between"
    >
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
          onChange={(event) => setValue(event.target.name, event.target.value)}
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
        {guestRoleAvailable && (
          <>
            <input
              id="Guest"
              type="radio"
              name="userRole"
              value="GUEST"
              checked={roleValue === 'GUEST'}
              onChange={(event) =>
                setValue(event.target.name, event.target.value)
              }
            />
            <RoleOptionLabel isSelected={roleValue === 'GUEST'} htmlFor="Guest">
              <RoleOptionHeaderWrapper>
                <RoleOptionHeader>Guests</RoleOptionHeader>
                <RoleOptionHeaderAdditionalInfo>
                  *Limited Access
                </RoleOptionHeaderAdditionalInfo>
              </RoleOptionHeaderWrapper>
              <RoleOptionDescription>
                An outside collaborator you can invite into selected lists, who
                will only have access to the tasks, patients/clients and people
                who are part of those lists.
              </RoleOptionDescription>
            </RoleOptionLabel>
            <Divider />
          </>
        )}
        <input
          id="DockLite"
          type="radio"
          name="userRole"
          value="DOCK_LITE"
          checked={roleValue === 'DOCK_LITE'}
          onChange={(event) => setValue(event.target.name, event.target.value)}
        />
        <RoleOptionLabel
          isSelected={roleValue === 'DOCK_LITE'}
          htmlFor="DockLite"
        >
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Dock Lite</RoleOptionHeader>
            <RoleOptionHeaderAdditionalInfo>
              *Limited Access
            </RoleOptionHeaderAdditionalInfo>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            A limited use member of your organization or an outside collaborator
            you can invite into a single list, who will only have access to the
            tasks, patients/clients and people who are part of that list.
          </RoleOptionDescription>
        </RoleOptionLabel>
        <Divider />
        <input
          id="DockPro"
          type="radio"
          name="userRole"
          value={DOCK_PRO}
          checked={roleValue === DOCK_PRO}
          onChange={(event) => setValue(event.target.name, event.target.value)}
        />
        <RoleOptionLabel
          isSelected={roleValue === 'DOCK_PRO'}
          htmlFor="DockPro"
        >
          <RoleOptionHeaderWrapper>
            <RoleOptionHeader>Dock Crew</RoleOptionHeader>
            <RoleOptionHeaderAdditionalInfo>
              *Limited Access
            </RoleOptionHeaderAdditionalInfo>
          </RoleOptionHeaderWrapper>
          <RoleOptionDescription>
            Dock Crew user will help configure your account and with building
            out Workflows and Smartflows for your team.
          </RoleOptionDescription>
        </RoleOptionLabel>
        <Divider />
        {viewOnlyRoleAvailable && (
          <>
            <input
              id="ViewOnly"
              type="radio"
              name="userRole"
              value={VIEW_ONLY}
              checked={roleValue === VIEW_ONLY}
              onChange={(event) =>
                setValue(event.target.name, event.target.value)
              }
            />
            <RoleOptionLabel
              isSelected={roleValue === VIEW_ONLY}
              htmlFor="ViewOnly"
            >
              <RoleOptionHeaderWrapper>
                <RoleOptionHeader>View Only</RoleOptionHeader>
                <RoleOptionHeaderAdditionalInfo>
                  *Limited Access
                </RoleOptionHeaderAdditionalInfo>
              </RoleOptionHeaderWrapper>
              <RoleOptionDescription />
            </RoleOptionLabel>
            <Divider />
          </>
        )}
      </RoleSelectionWrapper>
      <Grid container item direction="row" justifyContent="center" spacing={2}>
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
