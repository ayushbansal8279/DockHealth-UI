import React, { useEffect, useState } from 'react';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import { useParams } from "react-router-dom";
import { setCurrentUserGroup, unsetCurrentUserGroup } from "actions/user-groups-actions";
import { Box, Stack } from "@mui/material";
import { getAllProfiles } from "api/profile-api";
import { getAllProfileFieldTypes } from "api/profile-type-field-api";
import { showGlobalErrorAlert } from "alert/actions";
import LayoutHeader from "components/template/LayoutHeader/LayoutHeader";
import OptionsMenu from "components/common/OptionsMenu/OptionsMenu";
import MoreVert from "@mui/icons-material/MoreVert";
import ViewLayout from "components/template/ViewLayout/ViewLayout";
import ProfileDrawer from "components/patients/CustomProfilesList/ProfileDrawer";
import { Add as AddIcon } from "@mui/icons-material";
import AdornedButton from "components/common/AdornedButton/AdornedButton";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserGroupDetailsSelector } from 'selectors/user-groups-selectors';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import Drawer from 'ui-toolkit/Navigation/Drawer/Drawer';
import Input from 'ui-toolkit/Form_v2/Input';
import { Box, IconButton, Stack } from '@mui/material';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { showGlobalErrorAlert } from 'alert/actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@mui/icons-material/MoreVert';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import {
  ContentWrapper,
  MoreActinsWrapper,
  StickyHeader,
  TitleName,
} from 'components/patients/PatientDrawer/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Fieldset from 'ui-toolkit/Form_v2/Fieldset';

const CustomProfileList = () => {
  const dispatch = useDispatch();
  const { groupIdentifier: groupIdentifierUrlParameter, profileIdentifier } = useParams();
  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  useEffect(() => {
    dispatch(setCurrentUserGroup(groupIdentifier));

    return () => {
      dispatch(unsetCurrentUserGroup());
    };
  }, [dispatch, groupIdentifier]);

  const { users } = useSelector(getCurrentUserGroupDetailsSelector) || {};

  const location = useLocation();
  const history = useHistory();

  const handleRecordClick = (event, { id }) => {
    setOpen(id);
    //history.push(`${location.pathname}/${id}`);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const [open, setOpen] = useState(null);

  const [customFields, setCustomFields] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const fetchUserCustomFields = () => {
    getAllProfileFieldTypes(profileIdentifier)
      .then((data) => {
        setCustomFields(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  const fetchCustomProfiles = () => {
    getAllProfiles(profileIdentifier)
      .then((data) => {
        setProfiles(data)
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      })
  };

  useEffect(() => {
    fetchUserCustomFields();
    fetchCustomProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileAddClick = () => {
    setOpen(true);
  }

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box position="absolute" top={27} left={10}>
              <OptionsMenu disablePortal options={[]}>
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box>
            <LayoutHeader.Title
              title="Custom Profiles"
              description="Some description"
            />
          </LayoutHeader>
        }
      >
        <ProfileDrawer
          open={open}
          profileIdentifier={profileIdentifier}
          profile={profiles.find(profile => profile.identifier === open)}
          fields={customFields}
          onClose={handleClose}
        />
        <Stack direction="row-reverse" sx={{ m: "16px 32px" }}>
          <Box display="flex" alignItems="center">
              <Box m={1} />
              <AdornedButton
                adornment={<AddIcon />}
                onClick={handleProfileAddClick}
              >
                ADD A PROVIDER
              </AdornedButton>
          </Box>
        </Stack>
        <DataGrid
          dataset={profiles}
          onRecordClick={handleRecordClick}
        >
          {customFields.map(field => (
            <Data
              name={field.name}
              value={(data) => {
                const record = data.fields
                  .find(({ profileTypeField }) =>
                    field.identifier === profileTypeField.identifier);

                if (record) {
                  switch (field.fieldType) {
                    case "TEXT":
                      return record.values[0]?.value;
                    case "PICK_LIST":
                      return record.values[0]?.customFieldOption.name;
                    default:
                      return ""
                  }
                }

                return "";
              }}
            />
          ))}

        </DataGrid>
      </ViewLayout>
    </>
  );
};

export default CustomProfileList;
