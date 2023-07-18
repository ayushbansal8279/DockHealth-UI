import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Box, IconButton, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import React, { useCallback, useMemo, useState } from 'react';
import Drawer from 'ui-toolkit/Navigation/Drawer/Drawer';
import { createProfile, editProfileType, deleteProfile } from 'api/profile-api';
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
import { closeModal, openModal } from 'modal/actions';

const ProfileDrawer = ({
  open,
  profileTypeIdentifier,
  profile,
  types,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, getValues } = useForm();

  const [isCollapsed, setCollapsed] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const editProfile = useCallback(
    (data) => {
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
    },
    [profile?.identifier, types],
  );

  const onSubmit = (data) => {
    if (profile && editMode) {
      editProfile(data);
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
    onClose();
  };

  const handleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  const handleClickAway = () => {
    dispatch(
      openModal('InterruptEdit', {
        description: 'Are you sure to delete this profile?',
        confirm: () => {
          editProfile(getValues());
          dispatch(closeModal());
        },
      }),
    );
  };

  const menu = useMemo(
    () => [
      { name: 'Edit', onClick: () => setEditMode(true) },
      {
        name: 'Delete',
        onClick: () => {
          dispatch(
            openModal('DeleteConfirmation', {
              description: 'Are you sure to delete this profile?',
              confirm: () => {
                deleteProfile(profile.identifier);
                dispatch(closeModal());
              },
            }),
          );
        },
      },
    ],
    [dispatch, profile?.identifier],
  );

  return (
    <Drawer open={open} onClickAway={handleClickAway}>
      <StickyHeader>
        <TitleName>{profile?.name}</TitleName>
        <MoreActinsWrapper>
          <OptionsMenu options={menu} customButtonComponent={IconButton}>
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
                          readOnly={profile && !editMode}
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
                          readOnly={profile && !editMode}
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
                disabled={profile && !editMode}
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
