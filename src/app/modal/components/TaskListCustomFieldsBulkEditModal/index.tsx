import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { bulkEditCustomFieldsByTaskIdentifiers } from '@/app/api/task-api';
import { ICustomField } from '@/app/types/CustomField';
import {
  FormattedMetaDataForApi,
  convertMetaDataApiToState,
} from '../BulkEditCustomFieldsModal/helpers';
import BulkEditCustomFieldsModal from '../BulkEditCustomFieldsModal';
import { showGlobalAlert, showGlobalErrorAlert } from '@/app/alert/actions';
import AlertMessages from '@/app/alert/AlertMessages';
import { updateCustomFieldsByTaskIdentifiers } from '@/app/actions/task-actions';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { bulkEditPatientsCustomFields } from '@/app/api/patients-api';

interface Props {
  taskIdentifiers: string[];
  taskWorkflowIdentifiers: string[];
  customFields: ICustomField[];
  patientIdentifiers: string[];
  closeModal: VoidFunction;
}

export default function TaskListCustomFieldsBulkEditModal({
  taskIdentifiers,
  taskWorkflowIdentifiers,
  customFields,
  patientIdentifiers,
  closeModal,
}: Props) {
  const dispatch = useDispatch();
  const [allCustomFields, setAllCustomFields] = useState<ICustomField[]>(customFields);

  useEffect(() => {
    CustomFieldsApi.getAllPatientCustomFields(true).then(
      (data: ICustomField[]) => {
        setAllCustomFields((prevFields) => [
          ...(prevFields || []),  
          ...data.sort((a, b) => a.sortIndex - b.sortIndex),
        ]);
      },
    );
  }, []);

  const handleSave = async (formattedMetaData: FormattedMetaDataForApi) => {
    const taskFormattedMetaData = formattedMetaData.filter((item) => {
      const field = allCustomFields?.find(
        (field) => field.identifier === item.customFieldIdentifier
      );
      return field?.targetType === 'TASK';
    });

    const patientFormattedMetaData = formattedMetaData.filter((item) => {
      const field = allCustomFields?.find(
        (field) => field.identifier === item.customFieldIdentifier
      );
      return field?.targetType === 'PATIENT';
    });

    const filteredPatientIdentifiers = patientIdentifiers?.filter(id => id !== undefined);

    try {
      if (taskFormattedMetaData.length > 0) {
        const taskPayload = {
          metaData: taskFormattedMetaData,
          taskIdentifiers,
          taskWorkflowIdentifiers,
        };
        await bulkEditCustomFieldsByTaskIdentifiers(taskPayload);
  
        dispatch(
          updateCustomFieldsByTaskIdentifiers({
            taskIdentifiers,
            taskWorkflowIdentifiers,
            metaData: convertMetaDataApiToState(taskFormattedMetaData),
          }),
        );
      }

      if (patientFormattedMetaData.length > 0 && filteredPatientIdentifiers.length > 0) {
        const patientPayload = {
          metaData: patientFormattedMetaData,
          patientIdentifiers: filteredPatientIdentifiers,
        };
        await bulkEditPatientsCustomFields(patientPayload);
      }

      dispatch(showGlobalAlert(AlertMessages.UPDATED));
      closeModal();
    } catch (error) {
      dispatch(showGlobalErrorAlert());
      console.error(error);
    }
  };

  return (
    !!customFields && (
      <BulkEditCustomFieldsModal
        customFields={allCustomFields}
        onSave={handleSave}
        closeModal={closeModal}
      />
    )
  );
}
