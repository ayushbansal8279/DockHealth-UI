import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ICustomField } from '@/app/types/CustomField';
import {
  FormattedMetaDataForApi,
} from '../BulkEditCustomFieldsModal/helpers';
import BulkEditCustomFieldsModal from '../BulkEditCustomFieldsModal';
import { showGlobalErrorAlert } from '@/app/alert/actions';
import * as CustomFieldsApi from '@/app/api/custom-fields-api';
import { profileBulkEditCustomFields } from '@/app/actions/profile-actions';
import { getTransformedProfileFields } from '@/app/helpers/profile-helpers';

interface Props {
  profileIdentifiers: string[];
  profileTypeIdentifier: string;
  profileStatus: string;
  onCloseModal: VoidFunction;
  closeModal: VoidFunction;
}

export default function ProfileCustomFieldsBulkEditModal({
  profileIdentifiers,
  profileTypeIdentifier,
  profileStatus,
  onCloseModal,
  closeModal,
}: Props) {
  const dispatch = useDispatch();
  const [allCustomFields, setAllCustomFields] = useState<ICustomField[]>([]);

  useEffect(() => {
    CustomFieldsApi.getAllProfileCustomFields(profileTypeIdentifier, true).then(
      (data: ICustomField[]) => {
        setAllCustomFields(data.sort((a, b) => a.sortIndex - b.sortIndex));
      },
    );
  }, [profileTypeIdentifier]);

  const handleSave = async (formattedMetaData: FormattedMetaDataForApi) => {
    try {
      if (formattedMetaData.length > 0) {
        const profileMetaData = formattedMetaData.reduce((acc, item) => {
          if ('selectedOptionIdentifiers' in item) {
            acc[item.customFieldIdentifier] = item.selectedOptionIdentifiers;
          } else {
            acc[item.customFieldIdentifier] = item.value;
          }
          return acc;
        }, {} as Record<string, any>);

        const transformedFields = getTransformedProfileFields(profileMetaData, allCustomFields);

        await dispatch(profileBulkEditCustomFields(
          profileIdentifiers,
          profileTypeIdentifier,
          transformedFields,
          profileStatus
        ));
        onCloseModal();
      }
    } catch (error) {
      dispatch(showGlobalErrorAlert());
      console.error(error);
    }
  };

  return (
    <BulkEditCustomFieldsModal
      customFields={allCustomFields}
      onSave={handleSave}
      closeModal={closeModal}
    />
  );
}
