import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import pathEq from 'ramda/es/pathEq';

import { changeUserRoleForOrg } from '../../../actions/people-actions';
import useBoolean from '../../../hooks/useBoolean';
import {
  MemberTypeLabelButton,
  StyledListItem,
  StyledPopover,
} from './SubscriptionsView.MemberTypeLabel.Components';
import { H4 } from './SubscriptionsView.Styled';

const renderUserTypesOptions = ({
  changeUserRole,
  userId,
  userTypes,
  closePopover,
}) => {
  return Object.entries(userTypes)
    .filter(pathEq(['1', 'selectable'], true))
    .map(([role, { label }]) => (
      <StyledListItem
        key={role}
        button
        onClick={() => {
          changeUserRole({ userId, role })
            .then(() => {
              Swal.fire({
                icon: 'success',
                position: 'top-right',
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                title: `User's role changed successfully`,
              });

              // fix z-index for drawer container
              Swal.getContainer().style.zIndex = 10000;

              closePopover();
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  error.errorMessage ??
                  `User's role could not be changed, please try again later`,
              });

              // fix z-index for drawer container
              Swal.getContainer().style.zIndex = 10000;

              closePopover();
            });
        }}
      >
        <H4>{label}</H4>
      </StyledListItem>
    ));
};

const MemberTypeLabel = ({
  userId,
  userType: { label, changeable },
  userTypes,
}) => {
  const labelReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userId: markedUserId, role }) =>
      changeUserRoleForOrg(markedUserId, role)(dispatch),
    [dispatch],
  );

  return (
    <>
      <MemberTypeLabelButton
        ref={labelReference}
        clickable={changeable}
        onClick={changeable ? openPopover : undefined}
      >
        {label}
      </MemberTypeLabelButton>
      {changeable && (
        <StyledPopover
          anchorEl={labelReference.current}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          onClose={closePopover}
          open={isPopoverOpen}
        >
          {renderUserTypesOptions({
            userId,
            userTypes,
            closePopover,
            changeUserRole,
          })}
        </StyledPopover>
      )}
    </>
  );
};

export default MemberTypeLabel;
