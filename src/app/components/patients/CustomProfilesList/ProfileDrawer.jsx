import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box, IconButton, Stack } from '@mui/material';
import React, { useState } from 'react';
import Drawer from 'ui-toolkit/Navigation/Drawer/Drawer';
import { createProfile, editProfileType } from 'api/profile-api';
import { useForm } from 'react-hook-form';
import {
  ContentWrapper,
  MoreActinsWrapper,
  StickyHeader,
  TitleName,
} from 'components/patients/PatientDrawer/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Input from 'components/common/Input/Input';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import Button from 'components/common/Button/Button';
import Select from 'components/common/Select/Select';

const ProfileDrawer = ({
  open,
  profileTypeIdentifier,
  profile,
  types,
  onClose,
}) => {
  const { register, handleSubmit } = useForm();

  const [isCollapsed, setCollapsed] = useState(true);

  const onSubmit = (data) => {
    if (profile) {
      editProfileType(profile.identifier, {
        fields: Object.entries(data).map(([identifier, value]) => {
          const type = types.find(
            (fieldType) => fieldType.identifier === identifier,
          );
          return {
            profileTypeField: {
              identifier,
            },
            values: [
              type.fieldType === 'TEXT'
                ? {
                    value,
                  }
                : {
                    customFieldOption: {
                      name: value,
                    },
                  },
            ],
          };
        }),
      });
    } else {
      createProfile({
        fields: Object.entries(data).map(([identifier, value]) => {
          return {
            profileTypeField: {
              identifier,
            },
            values: [
              {
                value,
              },
            ],
          };
        }),
        profileType: {
          identifier: profileTypeIdentifier,
        },
      });
    }
  };

  const handleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <Drawer open={open} onClose={onClose}>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <LabeledCollapse
              name="Default"
              isOpened={isCollapsed}
              onClick={handleCollapse}
            >
              {types?.map((field) => {
                const record = profile?.fields?.find(
                  ({ profileTypeField }) =>
                    field.identifier === profileTypeField.identifier,
                );

                const render = () => {
                  switch (field.fieldType) {
                    case 'TEXT': {
                      return (
                        <Input
                          key={field.identifier}
                          name={field.identifier}
                          label={field.name}
                          defaultValue={record ? record.values[0]?.value : ''}
                          placeholder={field.placeholder}
                          {...register(field.identifier)}
                        />
                      );
                    }
                    case 'PICK_LIST': {
                      return (
                        <Select
                          name={field.identifier}
                          label={field.name}
                          defaultValue={
                            record
                              ? record.values[0]?.customFieldOption.name
                              : ''
                          }
                          options={field.options.map((option) => ({
                            label: option.name,
                            value: option.identifier,
                          }))}
                          {...register(field.identifier)}
                        />
                      );
                    }
                    default: {
                      return null;
                    }
                  }
                };

                return <Box style={{ margin: '8px 4px' }}>{render()}</Box>;
              })}
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
  );
};

export default ProfileDrawer;
