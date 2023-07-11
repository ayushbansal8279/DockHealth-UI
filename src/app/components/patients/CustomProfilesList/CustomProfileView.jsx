import React, { useEffect, useState, useMemo } from 'react';
import CustomProfileDetailsHeader from 'components/patients/CustomProfilesList/CustomProfileDetailsHeader/CustomProfileDetailsHeader';
import { showGlobalErrorAlert } from 'alert/actions';
import { useDispatch } from 'react-redux';
import ProfileDrawer from 'components/patients/CustomProfilesList/ProfileDrawer';
import { useParams } from 'react-router-dom';
import { getAllProfiles } from 'api/profile-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';

const CustomProfileView = () => {
  const dispatch = useDispatch();
  const { profileTypeIdentifier, profileIdentifier } = useParams();
  const [profileTypes, setProfileTypes] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const fetchProfileTypes = () => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypes(data);
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
      <CustomProfileDetailsHeader
        firstName="First Name"
        lastName="Last Name"
        onViewDetailsClick={handleDrawerOpen}
      />
      <ProfileDrawer
        open={open}
        profileTypeIdentifier={profileTypeIdentifier}
        profile={profile}
        types={profileTypes}
        onClose={handleDrawerClose}
      />
    </>
  );
};

export default CustomProfileView;
