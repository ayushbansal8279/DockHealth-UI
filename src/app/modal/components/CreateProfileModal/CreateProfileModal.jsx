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
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import { CloseIconButton, CloseIcon } from '../styled';
// import {
//   AddPatientFieldModalWrapper,
//   Title,
//   TemplateForm,
//   FormScrollingContainer,
// } from './styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  FormScrollingContainer,
} from './styled';
import { TemplateForm } from '../EditTemplateModal/styled';
// import {
//   TEMPLATE_TYPES,
//   TEMPLATE_TYPE_OPTIONS,
//   validationSchema,
// } from './helpers';
import {
  TEMPLATE_TYPES,
  TEMPLATE_TYPE_OPTIONS,
  validationSchema,
} from '../EditTemplateModal/helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateProfileModal = ({
  closeModal,
  template,
  onAdded,
  onUpdated,
  isCreatingNewField,
}) => {
  // const isCreatingNewField = !template;
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

  useEffect(() => {
    console.log('!!!:', template);
  }, [template]);

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{isCreatingNewField ? 'Add' : 'Edit'} Profile</Title>
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
                      label="Profile name"
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <FormSelect
                      readOnly={!!template}
                      required
                      label="Template type"
                      name="type"
                      options={TEMPLATE_TYPE_OPTIONS}
                    />
                  </Grid> */}
                  {/* {(templateTypeValue === TEMPLATE_TYPES.EMAIL ||
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
                          type="input"
                          initialValue={template?.shortMessage}
                          onBlur={(_, { value }) =>
                            setValue('shortMessage', value)
                          }
                        />
                      </CustomTextEditor>
                    </Grid>
                  )} */}
                  {/* {templateTypeValue !== TEMPLATE_TYPES.SMS && (
                    <Grid item xs={12}>
                      <CustomTextEditor label="Message">
                        <TextEditor
                          type="textarea"
                          initialValue={template?.details}
                          onBlur={(_, { value }) => setValue('details', value)}
                        />
                      </CustomTextEditor>
                    </Grid>
                  )} */}
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
                Create
              </Button>
            </Grid>
          </TemplateForm>
        </FormProvider>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default CreateProfileModal;
