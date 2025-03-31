import React, { useCallback } from 'react';
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
  SaveWrapper,
} from './styled';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import * as CustomFieldApi from 'api/custom-fields-api';
import { convertDefaultFields } from '@/app/components/profile-builder/helper';
import { getProfileDetails } from '@/app/api/profile-api';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import { getProfileName } from '../../custom-profile-details/helpers';
import ProfileDrawerLoader from './ProfileDrawerLoader';
import { DrawerWrapper } from '@/app/components/patients/PatientDrawer/styled';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { normalizeHyperlink } from '@/app/helpers/custom-fields-helpers';
import { FieldType } from '@/app/helpers/field-type-helpers';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { editProfileDetails } from 'api/profile-api';
import { useDispatch } from 'react-redux';
import { getGenderIdentityOptions } from '@/app/api/patients-api';
import { mergeDeepRight } from 'ramda';
import { updatePatientDetails } from '@/app/actions/patient-details-actions';
import { mapFieldsFromIdentifiers, processCustomFields } from './helper';

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
  const [profileTypeFields, setProfileTypeFields] = useState([]);
  const [genderIdentityOptions, setGenderIdentityOptions] = useState([]);
  const [defaultFields, setDefaultFields] = useState([]);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const dispatch = useDispatch();

  const fetchPatientCustomGroups = async () => {
    try {
      const [customGroups, allCustomFields, defaultFields, genderIdentity] =
        await Promise.all([
          CustomFieldApi.searchCustomFiledGroups(context),
          CustomFieldApi.getAllPatientCustomFields(),
          CustomFieldApi.getDefauldFields(context),
          getGenderIdentityOptions(),
        ]);
      setDefaultFields(defaultFields);
      setAllCustomFields(allCustomFields);

      const genders = genderIdentity?.map((item) => {
        return {
          identifier: item?.genderIdentityType,
          name: item?.description,
        };
      });
      setGenderIdentityOptions(genders);

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
      setProfileTypeFields(profileTypeFields);

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

  const updateProfile = useCallback((data) => {
    editProfileDetails(profileIdentifier, {
      fields: Object.entries(data?.profileMetaData)?.map(
        ([identifier, value]) => {
          const type = profileTypeFields.find(
            (fieldType) => fieldType.identifier === identifier,
          );

          return {
            profileTypeField: { identifier },
            values: Array.isArray(value)
              ? value?.map((selectedValue) => ({ value: selectedValue }))
              : [
                  type?.fieldType === '"PICK_LIST"'
                    ? { customFieldOption: { identifier: value } }
                    : {
                        value:
                          type?.fieldType === FieldType.HYPERLINK
                            ? normalizeHyperlink(value)
                            : value,
                      },
                ],
          };
        },
      ),
      // eslint-disable-next-line no-shadow
    })
      // eslint-disable-next-line no-shadow
      .then(async () => {
        setEditMode(false);
        dispatch(showGlobalAlert(AlertMessages.SAVED));
        const profile = await getProfileDetails(profileIdentifier);
        setProfileValues(profile?.fields);
      })
      .catch((error) => {
        dispatch(
          showGlobalErrorAlert(error?.message ?? 'Error saving details!'),
        );
      });
  }, []);

  const updatePatient = (data) => {
    data.phoneHome = data.phoneHome ?? '';
    data.phoneMobile = data.phoneMobile ?? '';

    const { mappedFields, unmappedFields } = mapFieldsFromIdentifiers(
      defaultFields,
      data.profileMetaData,
    );

    const updatedPatientData = mergeDeepRight(patient, mappedFields);
    const processedCustomFields = processCustomFields(
      unmappedFields,
      allCustomFields,
    );

    const finalPatientData = { ...updatedPatientData };

    delete finalPatientData.dob; // need to work on for DOB

    finalPatientData.patientMetaData = processedCustomFields;

    const fieldsToExclude = [
      'allNotes',
      'patientLabels',
      'createdDateTime',
      'updatedDateTime',
    ];

    fieldsToExclude.forEach((field) => {
      finalPatientData[field] = undefined;
    });

    dispatch(updatePatientDetails(patient.patientIdentifier, finalPatientData));
  };

  const onSubmit = (data) => {
    if (context === 'PATIENT') {
      updatePatient(data);
    }
    if (context === 'PROFILETYPE') {
      updateProfile(data);
    }
  };

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
                        genderIdentityOptions={genderIdentityOptions}
                        category={category}
                        profileValues={profileValues}
                        editMode={editMode}
                        context={context}
                        key={key}
                      />
                    );
                  })}
                  <SaveWrapper>
                    <CancelButton onClick={onClose}>Close</CancelButton>
                    <ConfirmButton type="submit">Save</ConfirmButton>
                  </SaveWrapper>
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
