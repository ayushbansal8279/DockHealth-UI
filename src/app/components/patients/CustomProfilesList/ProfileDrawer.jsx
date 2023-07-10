import OptionsMenu from "components/common/OptionsMenu/OptionsMenu";
import { Box, IconButton, Stack } from "@mui/material";
import React from "react";
import Drawer from "ui-toolkit/Navigation/Drawer/Drawer";
import { createProfile, editProfileType } from "api/profile-api";
import { useForm } from "react-hook-form"
import { ContentWrapper, MoreActinsWrapper, StickyHeader, TitleName } from "components/patients/PatientDrawer/styled";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Input from "components/common/Input/Input";
import LabeledCollapse from "components/common/LabeledCollapse/LabeledCollapse";
import Button from "components/common/Button/Button";

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
            <LabeledCollapse name="Default" isOpened>
              {fields?.map((field) => {
                const record = profile?.fields
                  .find(({ profileTypeField }) =>
                    field.identifier === profileTypeField.identifier);

                const render = () => {
                  switch (field.fieldType) {
                    case "TEXT":
                      return (
                        <Input
                          key={field.identifier}
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
            </LabeledCollapse>
            <Stack sx={{ m: '8px 4px' }} direction="row">
              <Button
                type="submit"
                width="170px"
                variant="primary"
                size="small"
              >
                Save
              </Button>
            </Stack>
          </form>
        </Stack>
      </ContentWrapper>
    </Drawer>
  )
};

export default ProfileDrawer;