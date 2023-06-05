import React, { useEffect } from "react";
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserGroupDetailsSelector } from "selectors/user-groups-selectors";
import { useParams } from "react-router-dom";
import { getUserGroupIdentifierByUrlParameter } from "helpers/user-groups-helper";
import { setCurrentUserGroup, unsetCurrentUserGroup } from "actions/user-groups-actions";

const PatientsList = () => {
  const dispatch = useDispatch();
  const { groupIdentifier: groupIdentifierUrlParameter } = useParams();
  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  useEffect(() => {
    dispatch(setCurrentUserGroup(groupIdentifier));

    return () => {
      dispatch(unsetCurrentUserGroup());
    };
  }, [dispatch, groupIdentifier]);
  const { users, name } = useSelector(getCurrentUserGroupDetailsSelector) || {};
  console.log(users, name, groupIdentifierUrlParameter, groupIdentifier);

  if (!users || !users.length) {
    return null;
  }

  return (
    <DataGrid
      multiselect
      dataset={users}
    >
      <Data
        hidden
        field="id"
        name="ID"
        value={({ id }) => id}
      />
      <Data
        field="user"
        name="USER"
        value={({ name }) => name}
      />
      <Data
        field="email"
        name="EMAIL"
        value={({ email }) => email}
      />
      <Data
        field="user_status"
        name="USER STATUS"
        value={({ orgUserRole }) => orgUserRole}
      />
    </DataGrid>
  );
};

export default PatientsList;
