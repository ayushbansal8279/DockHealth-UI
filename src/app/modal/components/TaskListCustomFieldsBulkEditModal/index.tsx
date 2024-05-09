import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { bulkEditTaskListCustomFields } from '@/app/api/task-list-api';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { ICustomField } from '@/app/types/CustomField';
import { FormattedMetaData } from '../CustomFieldsBulkEditModal/helpers';
import CustomFieldsBulkEditModal from '../CustomFieldsBulkEditModal';

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
    console.log('taskIdentifiers', taskIdentifiers);
    console.log('formattedMetaData', formattedMetaData);
    return;
    try {
      const payload = {
        metaData: formattedMetaData,
        taskIdentifiers,
      };
      await bulkEditTaskListCustomFields(payload);
      // todo: update tasks list
      closeModal();
    } catch (error) {
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
