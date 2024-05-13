import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { bulkEditCustomFieldsByTaskIdentifiers } from '@/app/api/task-api';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { ICustomField } from '@/app/types/CustomField';
import { FormattedMetaData } from '../CustomFieldsBulkEditModal/helpers';
import CustomFieldsBulkEditModal from '../CustomFieldsBulkEditModal';
import { showGlobalAlert, showGlobalErrorAlert } from '@/app/alert/actions';
import AlertMessages from '@/app/alert/AlertMessages';
import { updateCustomFieldsByTaskIdentifiers } from '@/app/actions/task-actions';

interface Props {
  taskIdentifiers: string[];
  taskListIdentifier?: string;
  closeModal: VoidFunction;
}

export default function TaskListCustomFieldsBulkEditModal({
  taskIdentifiers,
  taskListIdentifier,
  closeModal,
}: Props) {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState<ICustomField[] | null>(null);

  useEffect(() => {
    CustomFieldsApi.getAllTaskListCustomFields(taskListIdentifier).then(
      (data: ICustomField[]) => {
        setCustomFields(data.sort((a, b) => a.sortIndex - b.sortIndex));
      },
    );
  }, []);

  const handleSave = async (formattedMetaData: FormattedMetaData) => {
    try {
      const payload = {
        metaData: formattedMetaData,
        taskIdentifiers,
      };
      await bulkEditCustomFieldsByTaskIdentifiers(payload);
      dispatch(
        updateCustomFieldsByTaskIdentifiers(taskIdentifiers, formattedMetaData),
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
      <CustomFieldsBulkEditModal
        customFields={customFields}
        onSave={handleSave}
        closeModal={closeModal}
      />
    )
  );
}
