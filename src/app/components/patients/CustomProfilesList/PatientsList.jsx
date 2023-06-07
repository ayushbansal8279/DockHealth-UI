import React, { useEffect, useState } from 'react';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserGroupDetailsSelector } from "selectors/user-groups-selectors";
import { useParams } from "react-router-dom";
import { getUserGroupIdentifierByUrlParameter } from "helpers/user-groups-helper";
import { setCurrentUserGroup, unsetCurrentUserGroup } from "actions/user-groups-actions";
import Drawer from "ui-toolkit/Navigation/Drawer/Drawer";
import Input from "ui-toolkit/Form_v2/Input";
import { Stack } from "@mui/material";
import * as CustomFieldsApi from "api/custom-fields-api";
import { showGlobalErrorAlert } from "alert/actions";

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

  const handleRecordClick = (event, { id }) => {
    setOpen(id);
  }

  const handleClose = () => {
    setOpen(null);
  }

  const [open, setOpen] = useState(null);

  const [customFields, setCustomFields] = useState([]);

  const fetchUserCustomFields = () => {
    CustomFieldsApi.getAllProviderCustomFields()
      .then((data) => {
        const customFieldsData = data?.filter(
          (cf) => cf.contextType === 'CUSTOM',
        );
        setCustomFields(customFieldsData);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  useEffect(() => {
    fetchUserCustomFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Drawer
        open={open}
        onClose={handleClose}
      >
        <Stack>
          {customFields.map((field) =>
            <Input
              name={field.name}
              label={field.name}
              placeholder={field.placeholder}
            />
          )}
        </Stack>
      </Drawer>
      <DataGrid
        dataset={users}
        onRecordClick={handleRecordClick}
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
    </>
  );
};

export default PatientsList;
