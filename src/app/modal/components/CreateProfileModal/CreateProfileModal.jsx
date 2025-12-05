import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { userHasWorkspacesFeatureSelector } from 'selectors/user-selectors';
import FormInput from 'components/common/Input/FormInput';
import { createProfileType, editProfileType } from 'api/profile-type-api';
import AlertMessages from 'alert/AlertMessages';
import ScopeAndWorkspaceFields from '../common/ScopeAndWorkspaceFields/ScopeAndWorkspaceFields';
import { shouldAddItemToList } from '../common/ScopeAndWorkspaceFields/scopeHelpers';
import { CloseIconButton, CloseIcon } from '../styled';

import {
  AddPatientFieldModalWrapper,
  Title,
  FormScrollingContainer,
} from './styled';
import { TemplateForm } from '../EditTemplateModal/styled';
import {
  TEMPLATE_TYPE_OPTIONS,
  validationSchema,
} from '../EditTemplateModal/helpers';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateProfileModal = ({
  closeModal,
  template,
  onAdded,
  onUpdated,
  isCreatingNewField,
  workspaceIdentifier,
}) => {
  // const isCreatingNewField = !template;
  const [, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const workspacesAvailable = useSelector(userHasWorkspacesFeatureSelector);

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: template,
  });

  const { register, unregister, handleSubmit, setValue, watch } = formMethods;

  useEffect(() => {
    register('type');

    return () => {
      unregister('type');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isCreatingNewField) {
      setValue('type', TEMPLATE_TYPE_OPTIONS[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditSubmit = (data) => {
    setIsSaving(true);
    const updatedField = {
      ...template,
      ...data,
    };
    editProfileType(template.identifier, updatedField)
      .then(() => {
        if (typeof onUpdated === 'function') onUpdated(updatedField);
        dispatch(showGlobalAlert(AlertMessages.SAVED));
        setIsSaving(false);
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        setIsSaving(false);
      });
  };

  const handleAddSubmit = (data) => {
    const currentScope = watch('scope');
    const currentWorkspace = watch('selectedWorkspace');
    if (currentScope === 'workspace' && !currentWorkspace) {
      dispatch(showGlobalErrorAlert('Please select a workspace'));
      return;
    }
    setIsSaving(true);
    const finalWorkspaceIdentifier =
      currentScope === 'workspace' ? currentWorkspace : null;
    const { scope, selectedWorkspace, ...payloadData } = data;
    createProfileType(payloadData, finalWorkspaceIdentifier)
      .then((addedField) => {
        if (
          shouldAddItemToList(
            workspaceIdentifier,
            currentScope,
            currentWorkspace,
          )
        ) {
          if (typeof onAdded === 'function') {
            onAdded(addedField);
          }
        }
        dispatch(showGlobalAlert(AlertMessages.CREATED));
        setIsSaving(false);
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        setIsSaving(false);
      });
  };

  useEffect(() => {
    console.log('!!!:', template);
  }, [template]);

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{isCreatingNewField ? 'Add' : 'Edit'} Object</Title>
      <Box m={2} />
      <Box display="flex" flex={1} width="100%">
        <FormProvider {...formMethods}>
          <TemplateForm
            onSubmit={handleSubmit(
              template?.identifier ? handleEditSubmit : handleAddSubmit,
            )}
          >
            <FormScrollingContainer>
              <Box overflow="hidden">
                <Grid container spacing={2}>
                  <Grid item size={12}>
                    <FormInput
                      required
                      autoFocus
                      name="name"
                      label="Object name"
                    />
                  </Grid>
                  <Grid item size={12}>
                    <FormInput name="description" label="Description" />
                  </Grid>
                  {isCreatingNewField && workspacesAvailable && (
                    <ScopeAndWorkspaceFields
                      workspaceIdentifier={workspaceIdentifier}
                    />
                  )}
                </Grid>
              </Box>
            </FormScrollingContainer>
            <Box m={2} />
            <Grid container justifyContent="flex-end">
              <CancelButton onClick={closeModal}>Cancel</CancelButton>
              <Box m={1} />
              <ConfirmButton type="submit" disabled={false}>
                Save
              </ConfirmButton>
            </Grid>
          </TemplateForm>
        </FormProvider>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default CreateProfileModal;
