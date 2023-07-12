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
import { Box } from '@mui/material';

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

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box position="absolute" top={27} left={10} />
            <LayoutHeader.Title title={name} description="" />
          </LayoutHeader>
        }
      >
        <CustomProfileDetailsHeader
          firstName={
            profile?.fields?.[0].values?.[0].value ||
            profile?.fields?.[0].values?.[0]?.customFieldOption.name
          }
          lastName={
            profile?.fields?.[1].values?.[0].value ||
            profile?.fields?.[1].values?.[0]?.customFieldOption.name
          }
          onViewDetailsClick={handleDrawerOpen}
          profileTypeName={name}
          profileTypeIdentifier={profileTypeIdentifier}
        />
        <ProfileDrawer
          open={open}
          profileTypeIdentifier={profileTypeIdentifier}
          profile={profile}
          types={profileTypeFields}
          onClose={handleDrawerClose}
        />
      </ViewLayout>
    </>
  );
};

export default CustomProfileView;
