import React, { useEffect, useRef, useMemo } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import { userProfileSelector } from 'selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUser } from 'actions/person-details-actions';
import { FormProvider, useForm } from 'react-hook-form';
import { openModal, closeModal } from 'modal/actions';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { validationSchema } from './helpers';
import PersonForm from '../PersonForm/PersonForm';
import {
  DrawerWrapper,
  ContentWrapper,
  TitleName,
  StickyHeader,
  MoreActionsWrapper,
} from './styled';

const PersonDetailsDrawer = ({ user, isOpenedDetails, closeDrawer }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(userProfileSelector);
  const isAdmin = userProfile?.orgUserRole === 'ADMIN';
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
          confirm: () => {
            formReference.current.dispatchEvent(new Event('submit'));
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
    if (!isOpenedDetails) {
      unsetActive();
    } else {
      reset({ ...editableFields });
      clearErrors(Object.keys(editableFields));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedDetails]);

  const handleFormSubmit = data => {
    unsetActive();
    dispatch(
      updateUser({
        ...data,
        userIdentifier,
      }),
    );
  };

  const contextMenuOptions = useMemo(
    () => [
      isAdmin && {
        name: 'Edit',
        onClick: setActive,
      },
    ],
    [isAdmin, setActive],
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
            {isAdmin && (
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
