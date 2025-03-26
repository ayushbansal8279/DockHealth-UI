import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import ProfileGroup from './ProfileGroup';
import { IconButton } from '@mui/material';
import { ArrowBack, MoreVert } from '@mui/icons-material';
import {
  StickyHeader,
  TitleName,
  MoreActinsWrapper,
  NewDrawerContainer,
  ContentWrapper,
} from './styled';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import * as CustomFieldApi from 'api/custom-fields-api';
import { convertDefaultFields } from '@/app/components/profile-builder/helper';
import { getProfileDetails } from '@/app/api/profile-api';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import { getProfileName } from '../../custom-profile-details/helpers';
import ProfileDrawerLoader from './ProfileDrawerLoader';
import { DrawerWrapper } from '@/app/components/patients/PatientDrawer/styled';

const ProfileDetailsDrawer = ({
  isOpenedDetails,
  closeDrawer,
  context,
  profileTypeIdentifier,
  profileIdentifier,
  patient,
}) => {
  const [title, setTitle] = useState('');
  const [profileValues, setProfileValues] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPatientCustomGroups = async () => {
    try {
      const [customGroups, allCustomFields, defaultFields] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(context),
        CustomFieldApi.getAllPatientCustomFields(),
        CustomFieldApi.getDefauldFields(context),
      ]);

      const title = `${patient?.lastName}, ${patient?.firstName} ${
        patient?.middleName ?? ''
      }`;
      setTitle(title);

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
      setLoading(false);

      const profileValue = patient?.patientMetaData || [];

      const mappedArray = defaultFields?.map(({ fieldName, identifier }) => ({
        customFieldIdentifier: identifier,
        value: patient[fieldName] ?? '',
      }));

      const finalProfile = [...mappedArray, ...profileValue];
      setProfileValues(finalProfile);
    } catch (error) {
      console.error('Error fetching Patient custom groups:', error);
    }
  };

  const fetchProfileCustomGroups = async () => {
    try {
      const [customGroups, profileTypeFields, profile] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(context, profileTypeIdentifier),
        getAllProfileFieldTypes(profileTypeIdentifier),
        getProfileDetails(profileIdentifier),
      ]);
      const profileName = getProfileName(profileTypeFields, profile);
      const title = [
        `${profileName?.[1] ? profileName?.[1] + ',' : ''}`,
        profileName?.[0],
        profileName?.[2],
      ].join(' ');
      setTitle(title);

      setProfileValues(profile?.fields);

      const processedGroups = customGroups.map((category) => {
        if (!category.fields) {
          return category;
        }

        const enrichedFields = category.fields.map((field) => {
          const matchingField = profileTypeFields?.find(
            (customField) => customField.identifier === field.fieldReferenceId,
          );

          return matchingField ? { ...field, ...matchingField } : field;
        });

        return { ...category, fields: enrichedFields };
      });

      setSelectedCategories(processedGroups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile custom groups:', error);
    }
  };

  useEffect(() => {
    if (context === 'PATIENT') {
      fetchPatientCustomGroups();
    }
    if (context === 'PROFILETYPE') {
      fetchProfileCustomGroups();
    }
  }, [context]);

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });
  const { register, handleSubmit, getValues } = formMethods;
  const formReference = useRef(null);
  const onSubmit = () => {};

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
    <DrawerWrapper open={isOpenedDetails} anchor="left" onClose={onClose}>
      <NewDrawerContainer>
        {loading ? (
          <ProfileDrawerLoader />
        ) : (
          <>
            <StickyHeader>
              <TitleName>{title}</TitleName>
              <MoreActinsWrapper>
                {options && (
                  <OptionsMenu
                    options={options}
                    customButtonComponent={IconButton}
                  >
                    <MoreVert />
                  </OptionsMenu>
                )}
                <IconButton onClick={onClose} style={{ width: '34px' }}>
                  <ArrowBack />
                </IconButton>
              </MoreActinsWrapper>
            </StickyHeader>
            <ContentWrapper>
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit)} ref={formReference}>
                  {selectedCategories?.map((category, key) => {
                    return (
                        <ProfileGroup
                          category={category}
                          profileValues={profileValues}
                          editMode={editMode}
                          context={context}
                          key={key}
                        />
                    );
                  })}
                </form>
              </FormProvider>
            </ContentWrapper>
          </>
        )}
      </NewDrawerContainer>
    </DrawerWrapper>
  );
};

export default ProfileDetailsDrawer;
