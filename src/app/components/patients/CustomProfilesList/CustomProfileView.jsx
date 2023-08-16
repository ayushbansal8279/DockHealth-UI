import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomProfileDetailsHeader from 'components/patients/CustomProfilesList/CustomProfileDetailsHeader/CustomProfileDetailsHeader';
import { showGlobalErrorAlert } from 'alert/actions';
import ProfileDrawer from 'components/patients/CustomProfilesList/ProfileDrawer';
import { getAllProfiles } from 'api/profile-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import { Box, Tabs } from '@mui/material';
import { ColumnsConfigProvider } from 'context-api/columns-config-context';
import {
  TASK_ITEM_BASE_COLUMN_CONFIG,
  TaskItemColumn,
} from 'helpers/task-helpers';
import CustomProfileNotes from 'components/patients/CustomProfilesList/CustomProfileNotes/CustomProfileNotes';
import { MainTab } from 'views/patient-details/styled';
import CustomProfileDetailsCompletedTasks from './CustomProfileDetailsCompletedTasks';

const PERSON_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.LIST_NAME]: true,
};

const CustomProfileView = () => {
  const dispatch = useDispatch();
  const { name, profileTypeIdentifier, profileIdentifier } = useParams();
  const [profileTypeFields, setProfileTypeFields] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const fetchProfileTypes = () => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypeFields(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  const fetchProfiles = () => {
    getAllProfiles(profileTypeIdentifier)
      .then((data) => {
        setProfiles(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  const profile = useMemo(
    () => profiles.find(({ identifier }) => identifier === profileIdentifier),
    [profiles, profileIdentifier],
  );

  const profileName = useMemo(
    () =>
      profile?.fields
        .filter((field) =>
          field?.profileTypeField?.displayOptions?.includes('PROFILE_NAME'),
        )
        .map(
          (field) =>
            field.values?.[0].value ||
            field.values?.[0]?.customFieldOption.name,
        ),
    [profile],
  );

  const profileHeader = useMemo(
    () =>
      Object.fromEntries(
        profile?.fields
          .filter((field) =>
            field?.profileTypeField?.displayOptions?.includes('PROFILE_HEADER'),
          )
          .map((field) => {
            return [
              field.profileTypeField.name,
              field.values?.[0].value ||
                field.values?.[0]?.customFieldOption.name,
            ];
          }) || [],
      ),
    [profile],
  );

  useEffect(() => {
    fetchProfileTypes();
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (_, value) => {
    setCurrentTab(value);
  };

  return (
    <ColumnsConfigProvider>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box position="absolute" top={27} left={10} />
            <LayoutHeader.Title title={name} description="" />
          </LayoutHeader>
        }
      >
        <CustomProfileDetailsHeader
          firstName={profileName?.[0]}
          lastName={profileName?.[1]}
          header={profileHeader}
          onViewDetailsClick={handleDrawerOpen}
          profileTypeName={name}
          profileTypeIdentifier={profileTypeIdentifier}
        >
          <Tabs value={currentTab} onChange={handleTabChange}>
            <MainTab label="All Tasks" />
            <MainTab label="Notes" />
          </Tabs>
        </CustomProfileDetailsHeader>
        <ProfileDrawer
          open={open}
          profileTypeIdentifier={profileTypeIdentifier}
          profile={profile}
          types={profileTypeFields}
          onClose={handleDrawerClose}
        />
        {currentTab === 0 && (
          <CustomProfileDetailsCompletedTasks
            profileIdentifier={profileIdentifier}
            groupName="Profile's Tasks"
            taskItemConfig={PERSON_VIEW_COLUMNS_CONFIG}
            changingGroupOrderDisabled
          />
        )}
        {currentTab === 1 && (
          <CustomProfileNotes profileIdentifier={profileIdentifier} />
        )}
      </ViewLayout>
    </ColumnsConfigProvider>
  );
};

export default CustomProfileView;
