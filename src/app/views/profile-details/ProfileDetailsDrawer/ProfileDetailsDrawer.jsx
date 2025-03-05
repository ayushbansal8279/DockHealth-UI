import React from 'react';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import ProfileGroup from './ProfileGroup';
import { IconButton, Stack } from '@mui/material';
import { StickyHeader, TitleName, MoreActinsWrapper, NewDrawerContainer } from './styled';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import { CloseIcon } from '@/app/modal/components/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as CustomFieldApi from 'api/custom-fields-api';
import { convertDefaultFields } from '@/app/components/profile-builder/helper';
import { patientSelector } from '@/app/selectors/patient-details-selectors';

const ProfileDetailsDrawer = ({ closeDrawer }) => {
  // const Context = tabName === 'patients' ? 'PATIENT' : 'PROFILE';

  const Context = 'PATIENT';
  const [defaultFields, setDefaultFields] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const patient = useSelector(patientSelector);

  const fetchProfileCustomGroups = async () => {
    const customGroups = await CustomFieldApi.searchCustomFiledGroups(Context);
    const allCustomFields = await CustomFieldApi.getAllPatientCustomFields();
    const defaultFields = await CustomFieldApi.getDefauldFields(Context);

    setDefaultFields(defaultFields);

    const enhancedDefaultFields = convertDefaultFields(defaultFields);
    const customFields = [...enhancedDefaultFields, ...allCustomFields];

    const processedGroups = customGroups.map((category) => {
      if (!category.fields) {
        return category;
      }

      const enrichedFields = category.fields.map((field) => {
        const matchingField = customFields?.find(
          (customField) => customField.identifier === field.fieldReferenceId,
        );

        return matchingField ? { ...field, ...matchingField } : field;
      });

      return { ...category, fields: enrichedFields };
    });
    setSelectedCategories(processedGroups);
  };

  useEffect(() => {
    fetchProfileCustomGroups();
  }, [patient]);

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });
  const { register, handleSubmit, getValues } = formMethods;
  const formReference = useRef(null);
  const onSubmit = () => {};

  const profileValue = patient?.patientMetaData;

  const mappedArray = defaultFields?.map(({ fieldName, identifier }) => ({
    customFieldIdentifier: identifier,
    value: patient[fieldName] ?? '',
  }));

  const finalProfile = [...mappedArray, ...profileValue];

  const handleEditButtonClick = () => {
    setEditMode(true);
  };
  const onClose = () => {
    closeDrawer();
  };

  const options = [
    {
      name: 'Edit Profile Details',
      onClick: handleEditButtonClick,
    },
  ];

  return (
    <NewDrawerContainer>
      <StickyHeader>
        <TitleName>{`${patient.lastName}, ${patient.firstName} ${
          patient.middleName ?? ''
        }`}</TitleName>
        <MoreActinsWrapper>
          {options && (
            <OptionsMenu options={options} customButtonComponent={IconButton}>
              <MoreVertIcon />
            </OptionsMenu>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MoreActinsWrapper>
      </StickyHeader>
      <div>
        <Stack>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} ref={formReference}>
              {selectedCategories?.map((category) => {
                return (
                  <>
                    <ProfileGroup
                      category={category}
                      finalProfile={finalProfile}
                      editMode={editMode}
                    />
                    <div></div>
                  </>
                );
              })}
            </form>
          </FormProvider>
        </Stack>
      </div>
    </NewDrawerContainer>
  );
};

export default ProfileDetailsDrawer;
