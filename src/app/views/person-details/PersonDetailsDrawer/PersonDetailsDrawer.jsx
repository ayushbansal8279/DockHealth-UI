import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUser } from 'actions/person-details-actions';
import { FormProvider, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { useHistory } from 'react-router-dom';
import { removeUserFromOrganization } from 'api/organization-api';
import { showGlobalErrorAlert } from 'alert/actions';
import { UserOrganizationRole } from 'helpers/user-helper';
import PersonForm from '../PersonForm/PersonForm';
import { validationSchema } from './helpers';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActionsWrapper,
} from './styled';

const { ADMIN, OWNER } = UserOrganizationRole;

const PersonDetailsDrawer = ({ user, isOpenedDetails, closeDrawer }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userProfile = useSelector(userProfileSelector);
  const isAdminOrOwner =
    userProfile.orgUserRole === ADMIN || userProfile.orgUserRole === OWNER;
  const [isActive, setActive, unsetActive] = useBoolean(false);
  const {
    firstName,
    lastName,
    email,
    workPhoneNumber,
    department,
    userMetaData,
    userIdentifier,
  } = user;
  const editableFields = {
    firstName,
    lastName,
    email,
    workPhoneNumber,
    department,
    userMetaData,
  };
  const formMethods = useForm({
    defaultValues: editableFields,
    reValidateMode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  const { reset, clearErrors } = formMethods;
  const formReference = useRef(null);

  const close = () => {
    unsetActive();
    closeDrawer();
    clearErrors(Object.keys(editableFields));
  };

  const handleClose = () => {
    if (isActive) {
      dispatch(
        openModal('InterruptEdit', {
          isWorkflowModal: true,
          profileTypeName: "USER",
          confirm: () => {
            formReference.current.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            );
            dispatch(closeModal());
          },
          onClose: close,
        }),
      );
    } else {
      close();
    }
  };

  useEffect(() => {
    if (isOpenedDetails) {
      reset({ ...editableFields });
      clearErrors(Object.keys(editableFields));
    } else {
      unsetActive();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedDetails]);

  const handleFormSubmit = (data) => {
    unsetActive();
    dispatch(
      updateUser({
        ...data,
        userIdentifier,
      }),
    );
  };

  const handleArchiveUser = useCallback(() => {
    dispatch(
      openModal('ArchivePerson', {
        confirm: () => {
          removeUserFromOrganization(userIdentifier)
            .then(() => {
              history.push('/people');
            })
            .catch((error) => {
              dispatch(
                showGlobalErrorAlert(
                  error?.errorMessage ??
                    'Could not archive this person, please try again later',
                ),
              );
            });
        },
      }),
    );
  }, [dispatch, history, userIdentifier]);
  const contextMenuOptions = useMemo(
    () => [
      isAdminOrOwner && {
        name: 'Edit',
        onClick: setActive,
      },
      isAdminOrOwner && {
        name: 'Archive',
        onClick: handleArchiveUser,
      },
    ],
    [handleArchiveUser, isAdminOrOwner, setActive],
  );

  return (
    <FormProvider {...formMethods}>
      <DrawerWrapper
        open={isOpenedDetails}
        anchor="right"
        onClose={handleClose}
      >
        <StickyHeader>
          <TitleName>{`${lastName}, ${firstName}`}</TitleName>
          <MoreActionsWrapper>
            {isAdminOrOwner && (
              <OptionsMenu
                options={contextMenuOptions}
                customButtonComponent={IconButton}
              >
                <MoreVertIcon />
              </OptionsMenu>
            )}
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </MoreActionsWrapper>
        </StickyHeader>
        <ContentWrapper>
          <PersonForm
            ref={formReference}
            user={user}
            onSubmit={handleFormSubmit}
            edited={isActive}
          />
        </ContentWrapper>
      </DrawerWrapper>
    </FormProvider>
  );
};

export default PersonDetailsDrawer;
