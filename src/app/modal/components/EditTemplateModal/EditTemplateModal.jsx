import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import { createTemplate, editTemplate } from 'api/template-api';
import TextEditor from 'components/common/TextEditor/TextEditor';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { EditorState } from 'draft-js';
import AlertMessages from 'alert/AlertMessages';
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

  const handleEditSubmit = data => {
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

  const handleAddSubmit = data => {
    setIsSaving(true);
    createTemplate(data)
      .then(addedField => {
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

  const initialSubjectData = useMemo(() => {
    if (!template?.shortMessage) return;
    const newContent = createMentionEntities(
      template.shortMessage,
      template.shortMessage,
      [],
      false,
    );
    // eslint-disable-next-line consistent-return
    return EditorState.push(EditorState.createEmpty(), newContent);
  }, [template]);

  const initialMessageData = useMemo(() => {
    if (!template?.details) return;
    const enableRichText =
      templateTypeValue === TEMPLATE_TYPES.EMAIL ||
      templateTypeValue === TEMPLATE_TYPES.EMR_NOTE ||
      templateTypeValue === TEMPLATE_TYPES.FAX;
    const newContent = createMentionEntities(
      template.details,
      template.details,
      [],
      enableRichText,
    );
    // eslint-disable-next-line consistent-return
    return EditorState.push(EditorState.createEmpty(), newContent);
  }, [template, templateTypeValue]);

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
                        <TextEditor
                          initialState={initialSubjectData}
                          disableMentions
                          onBlur={(_, text) => setValue('shortMessage', text)}
                        />
                      </CustomTextEditor>
                    </Grid>
                  )}
                  {templateTypeValue !== TEMPLATE_TYPES.SMS && (
                    <Grid item xs={12}>
                      <CustomTextEditor label="Message">
                        <TextEditor
                          initialState={initialMessageData}
                          showToolbar
                          disableMentions
                          isDrawerEditor
                          onBlur={(_, text) => setValue('details', text)}
                        />
                      </CustomTextEditor>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </FormScrollingContainer>
            <Box m={2} />
            <Grid container justify="flex-end">
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
