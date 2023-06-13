import React, { useEffect, useState } from "react";
import CustomProfileDetailsHeader from "components/patients/CustomProfilesList/CustomProfileDetailsHeader/CustomProfileDetailsHeader";
import { ContentWrapper, MoreActinsWrapper, StickyHeader, TitleName } from "components/patients/PatientDrawer/styled";
import OptionsMenu from "components/common/OptionsMenu/OptionsMenu";
import { IconButton, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Fieldset from "ui-toolkit/Form_v2/Fieldset";
import Input from "ui-toolkit/Form_v2/Input";
import Drawer from "ui-toolkit/Navigation/Drawer/Drawer";
import * as CustomFieldsApi from "api/custom-fields-api";
import { showGlobalErrorAlert } from "alert/actions";

const CustomProfileView = () => {
  const [isDrawerVisible, setDrawerVisibility] = useState(false);

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

  const handleDrawerOpen = () => {
    setDrawerVisibility(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisibility(false);
  };

  return (
    <>
      <CustomProfileDetailsHeader
        onViewDetailsClick={handleDrawerOpen}
      />
      <Drawer
        open={isDrawerVisible}
        onClose={handleDrawerClose}
      >
        <StickyHeader>
          <TitleName>{null}</TitleName>
          <MoreActinsWrapper>
            <OptionsMenu options={[]} customButtonComponent={IconButton}>
              <MoreVertIcon />
            </OptionsMenu>
            <IconButton onClick={handleDrawerClose}>
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
    </>
  )
};

export default CustomProfileView;