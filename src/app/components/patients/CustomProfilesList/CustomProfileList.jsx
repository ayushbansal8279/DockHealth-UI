import React, { useEffect, useState } from 'react';
import DataGrid, { Data } from 'ui-toolkit/Composite/DataGrid';
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserGroupDetailsSelector } from "selectors/user-groups-selectors";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { getUserGroupIdentifierByUrlParameter } from "helpers/user-groups-helper";
import { setCurrentUserGroup, unsetCurrentUserGroup } from "actions/user-groups-actions";
import Drawer from "ui-toolkit/Navigation/Drawer/Drawer";
import Input from "ui-toolkit/Form_v2/Input";
import { Box, IconButton, Stack } from "@mui/material";
import * as CustomFieldsApi from "api/custom-fields-api";
import { showGlobalErrorAlert } from "alert/actions";
import LayoutHeader from "components/template/LayoutHeader/LayoutHeader";
import OptionsMenu from "components/common/OptionsMenu/OptionsMenu";
import MoreVert from "@mui/icons-material/MoreVert";
import ViewLayout from "components/template/ViewLayout/ViewLayout";
import { ContentWrapper, MoreActinsWrapper, StickyHeader, TitleName } from "components/patients/PatientDrawer/styled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Fieldset from "ui-toolkit/Form_v2/Fieldset";

const CustomProfileList = () => {
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

  const location = useLocation();
  const history = useHistory();

  const handleRecordClick = (event, { id }) => {
    setOpen(id);
    history.push(`${location.pathname}/${id}`);
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
      <ViewLayout
        header={
          <LayoutHeader>
            <Box
              position="absolute"
              top={27}
              left={10}
            >
              <OptionsMenu
                disablePortal
                options={[]}
              >
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
        <Drawer
          open={open}
          onClose={handleClose}
        >
          <StickyHeader>
            <TitleName>{users?.find(user => user.id === open)?.name}</TitleName>
            <MoreActinsWrapper>
              <OptionsMenu options={[]} customButtonComponent={IconButton}>
                <MoreVertIcon />
              </OptionsMenu>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </MoreActinsWrapper>
          </StickyHeader>
          <ContentWrapper>
            <Stack>
              <Fieldset legend="Default">
                {customFields.map((field) =>
                  <Input
                    name={field.name}
                    label={field.name}
                    placeholder={field.placeholder}
                  />
                )}
              </Fieldset>
            </Stack>
          </ContentWrapper>
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
      </ViewLayout>
    </>
  );
};

export default CustomProfileList;
