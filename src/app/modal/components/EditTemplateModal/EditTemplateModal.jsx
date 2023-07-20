import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import { createTemplate, editTemplate } from 'api/template-api';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import AlertMessages from 'alert/AlertMessages';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  TemplateForm,
  FormScrollingContainer,
} from './styled';
import {
  TEMPLATE_TYPES,
  TEMPLATE_TYPE_OPTIONS,
  validationSchema,
} from './helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditTemplateModal = ({ closeModal, template, onAdded, onUpdated }) => {
  const isCreatingNewField = !template;
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

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

  const templateTypeValue = watch('type');

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
    editTemplate(updatedField)
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
    setIsSaving(true);
    createTemplate(data)
      .then((addedField) => {
        dispatch(showGlobalAlert(AlertMessages.CREATED));
        if (typeof onAdded === 'function') onAdded(addedField);
        setIsSaving(false);
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        setIsSaving(false);
      });
  };

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{isCreatingNewField ? 'Add' : 'Edit'} template</Title>
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
                  <Grid item xs={12}>
                    <FormInput
                      required
                      autoFocus
                      name="name"
                      label="Template name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormSelect
                      readOnly={!!template}
                      required
                      label="Template type"
                      name="type"
                      options={TEMPLATE_TYPE_OPTIONS}
                    />
                  </Grid>
                  {(templateTypeValue === TEMPLATE_TYPES.EMAIL ||
                    templateTypeValue === TEMPLATE_TYPES.SMS) && (
                    <Grid item xs={12}>
                      <CustomTextEditor
                        label={
                          templateTypeValue === TEMPLATE_TYPES.EMAIL
                            ? 'Subject'
                            : 'Message'
                        }
                      >
                        <RichTextEditor
                          value={template?.shortMessage}
                          onBlur={(value) => setValue('shortMessage', value)}
                          showToolbar={
                            templateTypeValue !== TEMPLATE_TYPES.EMAIL
                          }
                          multiline={templateTypeValue !== TEMPLATE_TYPES.EMAIL}
                          initOnClick
                          showCharCount
                        />
                      </CustomTextEditor>
                    </Grid>
                  )}
                  {templateTypeValue !== TEMPLATE_TYPES.SMS && (
                    <Grid item xs={12}>
                      <CustomTextEditor label="Message">
                        <RichTextEditor
                          value={template?.details}
                          onBlur={(value) => setValue('details', value)}
                          initOnClick
                          showCharCount
                        />
                      </CustomTextEditor>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </FormScrollingContainer>
            <Box m={2} />
            <Grid container justifyContent="flex-end">
              <Button width="auto" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Box m={1} />
              <Button type="submit" width="auto" disabled={isSaving}>
                Save template
              </Button>
            </Grid>
          </TemplateForm>
        </FormProvider>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditTemplateModal;
