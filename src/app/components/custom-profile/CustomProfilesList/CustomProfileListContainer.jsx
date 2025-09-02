import React from 'react';
import { useParams } from 'react-router-dom';

import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import CustomProfileList from './CustomProfileList';

const CustomProfileListContainer = () => {
  const {
    groupIdentifier: groupIdentifierUrlParameter,
    profileTypeIdentifier,
  } = useParams();
  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );

  return (
    <CustomProfileList
      profileTypeIdentifier={profileTypeIdentifier}
      groupIdentifier={groupIdentifier}
      showHeader={true}
    />
  );
};

export default CustomProfileListContainer;
