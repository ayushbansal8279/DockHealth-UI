import OptionsMenu from "components/common/OptionsMenu/OptionsMenu";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import React from "react";
import Drawer from "ui-toolkit/Navigation/Drawer/Drawer";
import { createProfile, editProfileType } from "api/profile-api";
import { useForm } from "react-hook-form"
import { ContentWrapper, MoreActinsWrapper, StickyHeader, TitleName } from "components/patients/PatientDrawer/styled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Fieldset from "ui-toolkit/Form_v2/Fieldset";

const ProfileDrawer = ({ open, profileIdentifier, profile, fields, onClose }) => {
  const {
    register,
    handleSubmit
  } = useForm();
  const onSubmit = (data) => {
    if (profile) {
      editProfileType(profile.identifier, {
        fields: profile.fields.map(field => {
          return {
            profileTypeField: {
              identifier: field.profileTypeField.identifier
            },
            values: [
              {
                value: field.values[0]?.value
              }
            ]
          }
        })
      });
    } else {
      createProfile({
        fields: Object.entries(data)
          .map(([ identifier, value ]) => {
            return {
              profileTypeField: {
                identifier: identifier
              },
              values: [
                {
                  value: value
                }
              ]
            }
          }),
        profileType: {
          identifier: profileIdentifier
        }
      })
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
    >
      <StickyHeader>
        <TitleName>{profile?.name}</TitleName>
        <MoreActinsWrapper>
          <OptionsMenu options={[]} customButtonComponent={IconButton}>
            <MoreVertIcon />
          </OptionsMenu>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </MoreActinsWrapper>
      </StickyHeader>
      <ContentWrapper>
        <Stack>
          <form onClick={handleSubmit(onSubmit)}>
            <Fieldset legend="Default">
              {fields?.map((field) => {
                const record = profile?.fields
                  .find(({ profileTypeField }) =>
                    field.identifier === profileTypeField.identifier);

                const render = () => {
                  switch (field.fieldType) {
                    case "TEXT":
                      return (
                        <TextField
                          name={field.identifier}
                          label={field.name}
                          defaultValue={record ? record.values[0]?.value : ""}
                          placeholder={field.placeholder}
                          {...register(field.identifier)}
                        />
                      );
                    case "PICK_LIST":
                    default:
                      return null;
                  }
                }

                return (
                  <Box style={{ margin: '8px 4px' }}>
                    {render()}
                  </Box>
                )
              })
              }
            </Fieldset>
            <Box style={{ margin: '8px 4px' }}>
              <Button
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </form>
        </Stack>
      </ContentWrapper>
    </Drawer>
  )
};

export default ProfileDrawer;