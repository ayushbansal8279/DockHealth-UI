import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { bulkEditPatientsCustomFields } from '@/app/api/patients-api';

import * as PatientsActions from 'actions/patients-actions';
import { ICustomField } from '@/app/types/CustomField';
import { FormattedMetaDataForApi } from '../BulkEditCustomFieldsModal/helpers';
import BulkEditCustomFieldsModal from '../BulkEditCustomFieldsModal';

interface Props {
  patientIdentifiers: string[];
  closeModal: VoidFunction;
}

export default function PatientCustomFieldsBulkEditModal({
  patientIdentifiers,
  closeModal,
}: Props) {
  const dispatch = useDispatch();
  const [customFields, setCustomFields] = useState<ICustomField[] | null>(null);

  useEffect(() => {
    CustomFieldsApi.getAllPatientCustomFields(true).then(
      (data: ICustomField[]) => {
        setCustomFields(data.sort((a, b) => a.sortIndex - b.sortIndex));
      },
    );
  }, []);

  const handleSave = async (formattedMetaData: FormattedMetaDataForApi) => {
    try {
      const payload = {
        metaData: formattedMetaData,
        patientIdentifiers,
      };
      await bulkEditPatientsCustomFields(payload);
      dispatch(PatientsActions.silentlyGetCurrentPatients());
      closeModal();
    } catch (error) {
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
