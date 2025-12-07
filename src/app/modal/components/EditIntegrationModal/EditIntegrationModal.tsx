import React, { useState, useEffect } from 'react';
import {
  ModalWrapper,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ActionButtonsContainer,
  CloseIconButton,
  CloseIcon,
  BasicInfoSection,
  FilterSectionTypography,
  SelectWrapper,
} from './styled';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../actions';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';
import IntegrationTextField from './IntegrationTextField';
import { Integration } from '@/app/views/Integrations/helper';
import { updateIntegrationToOrg } from '@/app/api/integration-api';

interface EditIntegrationModalProps {
  integration: Integration;
  onSuccess?: () => void;
}

export default function EditIntegrationModal({
  integration,
  onSuccess,
}: EditIntegrationModalProps) {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (integration?.settingsTemplate?.authInfo) {
      const initialValues: Record<string, string> = {};
      integration.settingsTemplate.authInfo.forEach((field) => {
        initialValues[field.key] = '';
      });
      setFieldValues(initialValues);
    }
  }, [integration]);

  const handleClose = () => dispatch(closeModal());

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await updateIntegrationToOrg({
        enabled: integration.enabled,
        integrationCode: integration.integrationCode,
        integrationName: integration.integrationName,
        ...fieldValues,
      });

      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save integration settings:', error);
      alert('Failed to save integration settings. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const authFields = integration?.settingsTemplate?.authInfo || [];
  const halfLength = Math.ceil(authFields.length / 2);
  const firstHalf = authFields.slice(0, halfLength);
  const secondHalf = authFields.slice(halfLength);

  return (
    <ModalWrapper>
      <CloseIconButton onClick={handleClose} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>

      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Edit {integration.integrationName}</ModalTitle>
        </ModalHeader>

        <ModalContent>
          <BasicInfoSection>
            <FilterSectionTypography variant="subtitle2">
              Integration Settings
            </FilterSectionTypography>

            {authFields.length === 0 ? (
              <p>No configuration fields available for this integration.</p>
            ) : (
              <>
                {firstHalf.map((field, index) => {
                  const pairedField = secondHalf[index];
                  return (
                    <SelectWrapper key={field.key}>
                      <IntegrationTextField
                        label={field.name}
                        value={fieldValues[field.key] || ''}
                        onChange={(value) =>
                          handleFieldChange(field.key, value)
                        }
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                        required={field.required}
                      />
                      {pairedField && (
                        <IntegrationTextField
                          label={pairedField.name}
                          value={fieldValues[pairedField.key] || ''}
                          onChange={(value) =>
                            handleFieldChange(pairedField.key, value)
                          }
                          placeholder={`Enter ${pairedField.name.toLowerCase()}`}
                          required={pairedField.required}
                        />
                      )}
                    </SelectWrapper>
                  );
                })}
              </>
            )}
          </BasicInfoSection>
        </ModalContent>

        <ActionButtonsContainer>
          <CancelButton onClick={handleClose} disabled={submitting}>
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </ConfirmButton>
        </ActionButtonsContainer>
      </ModalContainer>
    </ModalWrapper>
  );
}
