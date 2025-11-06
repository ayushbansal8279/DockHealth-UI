import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import { UserOrganizationRole } from 'helpers/user-helper';
import { useSelector } from 'react-redux';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import {
  userHasViewOnlyFeatureSelector,
  userHasDockGuestFeatureSelector,
} from 'selectors/user-selectors';
import {
  RoleFormWrapper,
  RoleSelectionHeader,
  Divider,
  RoleSelectionWrapper,
  RoleItem,
  RoleItemLabel,
  RoleItemDescription,
  LimitedAccessLabel,
} from './styled';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';

const { DOCK_PRO, VIEW_ONLY } = UserOrganizationRole;

const UserRoleStep = ({ 
  navigateToPreviousStep, 
  disabled, 
  contextName = "Organization", 
  visibleRoles 
}) => {
  const { watch, setValue } = useFormContext();

  const roleValue = watch('userRole');
  const viewOnlyRoleAvailable = useSelector(userHasViewOnlyFeatureSelector);
  const guestRoleAvailable = useSelector(userHasDockGuestFeatureSelector);
  const email = watch('email');
  const dockProEnabled = email?.includes('@dock.health');

  const allowedRoles = visibleRoles || ['MEMBER', 'GUEST', 'DOCK_LITE', 'DOCK_PRO', 'VIEW_ONLY'];

  return (
    <RoleFormWrapper
      container
      direction="column"
      justifyContent="space-between"
    >
      <Grid item>
        <RoleSelectionHeader>
          Select their role in your {contextName}
        </RoleSelectionHeader>
        <Divider />
      </Grid>
      <RoleSelectionWrapper>
        {allowedRoles.includes('MEMBER') && (
          <RoleItem
            isSelected={roleValue === 'MEMBER'}
            onClick={() => setValue('userRole', 'MEMBER')}
          >
            <img src={roleValue === 'MEMBER' ? CircleCompleted : Circle} alt="circle" />
            <div>
              <RoleItemLabel isSelected={roleValue === 'MEMBER'}>
                Member
              </RoleItemLabel>
              <RoleItemDescription>
                Part of your Organization. Can add and invite members who are
                already part of your organization. Can access all patients/clients
                and people in the group/practice.
              </RoleItemDescription>
            </div>
          </RoleItem>
        )}
        {guestRoleAvailable && allowedRoles.includes('GUEST') && (
          <RoleItem
            isSelected={roleValue === 'GUEST'}
            onClick={() => setValue('userRole', 'GUEST')}
          >
            <img src={roleValue === 'GUEST' ? CircleCompleted : Circle} alt="circle" />
            <div>
              <RoleItemLabel isSelected={roleValue === 'GUEST'}>
                Guests
                <LimitedAccessLabel>*Limited Access</LimitedAccessLabel>
              </RoleItemLabel>
              <RoleItemDescription>
                An outside collaborator you can invite into selected lists, who
                will only have access to the tasks, patients/clients and people
                who are part of those lists.
              </RoleItemDescription>
            </div>
          </RoleItem>
        )}
        {allowedRoles.includes('DOCK_LITE') && (
          <RoleItem
            isSelected={roleValue === 'DOCK_LITE'}
            onClick={() => setValue('userRole', 'DOCK_LITE')}
          >
            <img src={roleValue === 'DOCK_LITE' ? CircleCompleted : Circle} alt="circle" />
            <div>
              <RoleItemLabel isSelected={roleValue === 'DOCK_LITE'}>
                Dock Lite
                <LimitedAccessLabel>*Limited Access</LimitedAccessLabel>
              </RoleItemLabel>
              <RoleItemDescription>
                A limited use member of your organization or an outside collaborator
                you can invite into a single list, who will only have access to the
                tasks, patients/clients and people who are part of that list.
              </RoleItemDescription>
            </div>
          </RoleItem>
        )}
        {dockProEnabled && allowedRoles.includes('DOCK_PRO') && (
          <RoleItem
            isSelected={roleValue === DOCK_PRO}
            onClick={() => setValue('userRole', DOCK_PRO)}
          >
            <img src={roleValue === DOCK_PRO ? CircleCompleted : Circle} alt="circle" />
            <div>
              <RoleItemLabel isSelected={roleValue === DOCK_PRO}>
                Dock Crew
                <LimitedAccessLabel>*Limited Access</LimitedAccessLabel>
              </RoleItemLabel>
              <RoleItemDescription>
                Dock Crew user will help configure your account and with
                building out Workflows and Smartflows for your team.
              </RoleItemDescription>
            </div>
          </RoleItem>
        )}
        {viewOnlyRoleAvailable && allowedRoles.includes('VIEW_ONLY') && (
          <RoleItem
            isSelected={roleValue === VIEW_ONLY}
            onClick={() => setValue('userRole', VIEW_ONLY)}
          >
            <img src={roleValue === VIEW_ONLY ? CircleCompleted : Circle} alt="circle" />
            <div>
              <RoleItemLabel isSelected={roleValue === VIEW_ONLY}>
                View Only
                <LimitedAccessLabel>*Limited Access</LimitedAccessLabel>
              </RoleItemLabel>
              <RoleItemDescription />
            </div>
          </RoleItem>
        )}
      </RoleSelectionWrapper>
      <Grid container item direction="row" justifyContent="center" spacing={2} sx={{ paddingTop: '20px' }}>
        <Grid item>
          <CancelButton
            fullWidth
            variant="secondary"
            type="button"
            onClick={navigateToPreviousStep}
          >
            Back
          </CancelButton>
        </Grid>
        <Grid item>
          <ConfirmButton fullWidth disabled={disabled} type="submit">
            Assign Role and Invite
          </ConfirmButton>
        </Grid>
      </Grid>
    </RoleFormWrapper>
  );
};

export default UserRoleStep;
