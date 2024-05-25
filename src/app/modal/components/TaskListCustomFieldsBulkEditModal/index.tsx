import React from 'react';
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

interface Props {
  taskIdentifiers: string[];
  taskWorkflowIdentifiers: string[];
  customFields: ICustomField[];
  closeModal: VoidFunction;
}

export default function TaskListCustomFieldsBulkEditModal({
  taskIdentifiers,
  taskWorkflowIdentifiers,
  customFields,
  closeModal,
}: Props) {
  const dispatch = useDispatch();

  const handleSave = async (formattedMetaData: FormattedMetaDataForApi) => {
    try {
      const payload = {
        metaData: formattedMetaData,
        taskIdentifiers,
        taskWorkflowIdentifiers,
      };
      await bulkEditCustomFieldsByTaskIdentifiers(payload);
      dispatch(
        updateCustomFieldsByTaskIdentifiers({
          taskIdentifiers,
          taskWorkflowIdentifiers,
          metaData: convertMetaDataApiToState(formattedMetaData),
        }),
      );
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
        customFields={customFields}
        onSave={handleSave}
        closeModal={closeModal}
      />
    )
  );
}
