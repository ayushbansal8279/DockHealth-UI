import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import CustomProfileList from '@/app/components/custom-profile/CustomProfilesList/CustomProfileList';
import { getProfileRelationships } from '@/app/api/profile-api';

const ProfileRelationship = () => {
  const dispatch = useDispatch();
  const {
    profileIdentifier,
    relationshipProfileIdentifier,
    patientIdentifier,
  } = useParams();

  const identifier = profileIdentifier || patientIdentifier;

  const fetchProfileTypeFields = useCallback(() => {
    return getAllProfileFieldTypes(relationshipProfileIdentifier)
      .then((data) => {
        return data;
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        return [];
      });
  }, [dispatch, relationshipProfileIdentifier]);

  const fetchRelationships = useCallback(() => {
    return getProfileRelationships(identifier, relationshipProfileIdentifier)
      .then((data) => {
        return data;
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        return [];
      });
  }, [dispatch, identifier, relationshipProfileIdentifier]);

  useEffect(() => {
    fetchProfileTypeFields();
    fetchRelationships();
  }, [fetchProfileTypeFields, fetchRelationships]);

  return (
    <CustomProfileList
      profileTypeIdentifier={relationshipProfileIdentifier}
      fetchProfileTypeFields={fetchProfileTypeFields}
      fetchProfiles={fetchRelationships}
      showHeader={false}
    />
  );
};

export default ProfileRelationship;
