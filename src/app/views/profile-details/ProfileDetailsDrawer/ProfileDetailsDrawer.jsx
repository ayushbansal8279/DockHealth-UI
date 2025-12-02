import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { getProfileDetails, editProfileDetails } from '@/app/api/profile-api';
import { getAllProfileFieldTypes } from '@/app/api/profile-type-field-api';
import { getAllProfileTypes } from '@/app/api/profile-type-api';
import { getProfileName } from '../../custom-profile-details/helpers';
import ProfileDrawerLoader from './ProfileDrawerLoader';
import { DrawerWrapper } from '@/app/components/patients/PatientDrawer/styled';
import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { useDispatch, useSelector } from 'react-redux';
import { getGenderIdentityOptions } from '@/app/api/patients-api';
import { mergeDeepRight } from 'ramda';
import { updatePatientDetails } from '@/app/actions/patient-details-actions';
import { createProfileMenuOptions } from './profile-drawer-helper';
import {
  createPatientMenuOptions,
  useArchivePatient,
  useUnarchivePatient,
  useDeletePatient,
  useHandleAddButtonClick,
  useHandleChangeScopeClick,
} from './patient-drawer-helper';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
  userHasPatientCustomFieldsFeatureSelector,
} from 'selectors/user-selectors';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { useBoolean } from 'hooks/useBoolean';
import {
  addFieldOptionsInDefaultCategory,
  enrichCategoryGroups,
  formatPatientName,
  formatProfileTitle,
  mapFieldsFromIdentifiers,
  mapPatientFieldValues,
  processCustomFields,
} from './helper';

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
  const [defaultFields, setDefaultFields] = useState([]);
  const [allCustomFields, setAllCustomFields] = useState([]);
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const patientCustomFieldsAvailable = useSelector(
    userHasPatientCustomFieldsFeatureSelector,
  );
  const isAdmin = checkIfUserIsOrganizationAdmin(currentUser);
  const [isActive, setActive, unsetActive] = useBoolean(false);

  const isWorkspaceScoped =
    patient?.organizationIdentifier &&
    patient.organizationIdentifier !==
      currentOrganization?.organizationIdentifier;
  const workspaceId = isWorkspaceScoped
    ? patient?.organizationIdentifier
    : null;

  const { emrIntegrationEnabled } = currentOrganization || {};
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.add.enabled',
    ) || {};
  const patientAddEnabled =
    !emrIntegrationEnabled ||
    (emrIntegrationEnabled && quickAddPatientEnabledItem?.value === 'true');

  const fetchPatientCustomGroups = async () => {
    try {
      const [profileTypes, customGroups, defaultFields, genderIdentityOptions] =
        await Promise.all([
          getAllProfileTypes('PREDEFINED'),
          CustomFieldApi.searchCustomFiledGroups(context),
          CustomFieldApi.getDefauldFields(context),
          getGenderIdentityOptions(),
        ]);

      const patientProfileType = profileTypes.find(
        (pt) => pt.name.toLowerCase() === 'patient',
      );

      if (!patientProfileType) {
        console.error('Patient profile type not found');
        setLoading(false);
        return;
      }

      const allCustomFields = await getAllProfileFieldTypes(
        patientProfileType.identifier,
      );

      setDefaultFields(defaultFields);
      setAllCustomFields(allCustomFields);

      const title = formatPatientName(patient);
      setTitle(title);

      const enhancedDefaultFields = convertDefaultFields(defaultFields);
      const customFields = [...enhancedDefaultFields, ...allCustomFields];

      const enrichedGroups = enrichCategoryGroups(customGroups, customFields);

      const processedGroups = addFieldOptionsInDefaultCategory(
        enrichedGroups,
        genderIdentityOptions,
      );

      setSelectedCategories(processedGroups);
      setLoading(false);

      const finalProfileValues = mapPatientFieldValues(defaultFields, patient);
      setProfileValues(finalProfileValues);
    } catch (error) {
      console.error('Error fetching Patient custom groups:', error);
    }
  };

  const fetchProfileCustomGroups = async () => {
    try {
      const [customGroups, profileTypeFields, profileData] = await Promise.all([
        CustomFieldApi.searchCustomFiledGroups(context, profileTypeIdentifier),
        getAllProfileFieldTypes(profileTypeIdentifier),
        getProfileDetails(profileIdentifier),
      ]);
      setProfileTypeFields(profileTypeFields);
      setProfile(profileData);

      const profileName = getProfileName(profileTypeFields, profileData);

      const title = formatProfileTitle(profileName);
      setTitle(title);

      setProfileValues(profileData?.fields);

      const enrichedGroups = enrichCategoryGroups(
        customGroups,
        profileTypeFields,
      );

      setSelectedCategories(enrichedGroups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching object custom groups:', error);
    }
  };

  useEffect(() => {
    if (context === 'PATIENT' && patient) {
      fetchPatientCustomGroups();
    }
    if (
      context === 'PROFILETYPE' &&
      profileTypeIdentifier &&
      profileIdentifier
    ) {
      fetchProfileCustomGroups();
    }
  }, [context, profileTypeIdentifier, profileIdentifier, patient]);

  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });
  const { handleSubmit } = formMethods;
  const formReference = useRef(null);

  const updateProfile = useCallback(
    (data) => {
      editProfileDetails(
        profileIdentifier,
        data?.profileMetaData,
        profileTypeFields,
      )
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
    },
    [profileIdentifier, profileTypeFields, dispatch],
  );

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
      true,
    );

    const finalPatientData = { ...updatedPatientData };

    if (finalPatientData.dob) {
      finalPatientData.dob = moment(finalPatientData.dob).format('MM/DD/YYYY');
    }

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

  const onClose = () => {
    closeDrawer();
    if (context === 'PATIENT' && editMode) {
      const finalProfileValues = mapPatientFieldValues(defaultFields, patient);
      setProfileValues(finalProfileValues);
    }
    setEditMode(false);
    if (context === 'PATIENT') {
      unsetActive();
    }
  };

  const archivePatient = useArchivePatient(patient?.patientIdentifier);
  const unarchivePatient = useUnarchivePatient(patient?.patientIdentifier);
  const deletePatient = useDeletePatient(patient?.patientIdentifier);
  const handleAddButtonClick = useHandleAddButtonClick();
  const handleChangeScopeClick = useHandleChangeScopeClick(
    patient,
    workspaceId,
  );

  const menu = useMemo(() => {
    if (context === 'PATIENT' && patient) {
      return createPatientMenuOptions({
        dispatch,
        history,
        patient,
        isActive: editMode || isActive,
        setActive: () => {
          setEditMode(true);
          setActive();
        },
        patientAddEnabled,
        archivePatient,
        unarchivePatient,
        deletePatient,
        onClose,
        isAdmin,
        patientCustomFieldsAvailable,
        handleAddButtonClick,
        handleChangeScopeClick,
      });
    }

    if (context === 'PROFILETYPE') {
      return createProfileMenuOptions({
        dispatch,
        history,
        profile,
        profileTypeIdentifier,
        setEditMode,
        onClose,
      });
    }

    return [];
  }, [
    context,
    dispatch,
    history,
    profile,
    profileTypeIdentifier,
    setEditMode,
    onClose,
    patient,
    editMode,
    isActive,
    patientAddEnabled,
    archivePatient,
    unarchivePatient,
    deletePatient,
    isAdmin,
    patientCustomFieldsAvailable,
    handleAddButtonClick,
    handleChangeScopeClick,
  ]);

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
                {menu && (
                  <OptionsMenu
                    options={menu}
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
