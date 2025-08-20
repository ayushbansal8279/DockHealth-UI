import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { showGlobalErrorAlert } from 'alert/actions';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import { getAllProfiles } from 'api/profile-api';
import CustomProfileList from './CustomProfileList';

const CustomProfileListContainer = () => {
  const dispatch = useDispatch();
  const {
    groupIdentifier: groupIdentifierUrlParameter,
    profileTypeIdentifier,
  } = useParams();
  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );

  const fetchProfiles = useCallback(() => {
    return getAllProfiles(profileTypeIdentifier)
      .then((data) => {
        return data;
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        return [];
      });
  }, [dispatch, profileTypeIdentifier]);

  return (
    <CustomProfileList
      profileTypeIdentifier={profileTypeIdentifier}
      groupIdentifier={groupIdentifier}
      fetchProfiles={fetchProfiles}
      showHeader={true}
    />
  );
};

export default CustomProfileListContainer;
