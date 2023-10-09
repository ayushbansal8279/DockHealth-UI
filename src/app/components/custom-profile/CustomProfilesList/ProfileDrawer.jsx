import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, IconButton, Stack } from '@mui/material';
import Drawer from 'ui-toolkit/Navigation/Drawer/Drawer';
import { createProfile, editProfileType, deleteProfile } from 'api/profile-api';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ContentWrapper,
  MoreActinsWrapper,
  StickyHeader,
  TitleName,
} from 'components/patients/PatientDrawer/styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
// import Input from 'components/common/Input/Input';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import Button from 'components/common/Button/Button';
// import Select from 'components/common/Select/Select';
import CustomField from 'components/common/CustomField/CustomField';
import { closeModal, openModal } from 'modal/actions';

const ProfileDrawer = ({
  title,
  open,
  profileTypeIdentifier,
  profile,
  types,
  onClose,
  addMode = false,
}) => {
  const dispatch = useDispatch();
  // const { register, handleSubmit, getValues } = useForm();
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });
  const { register, handleSubmit, getValues } = formMethods;
  const formReference = useRef(null);

  const [isCollapsed, setCollapsed] = useState(true);
  const [editMode, setEditMode] = useState(addMode);

  const editProfile = useCallback(
    (data) => {
      editProfileType(profile?.identifier, {
        fields: Object.entries(data?.profileMetaData)?.map(
          ([identifier, value]) => {
            const type = types.find(
              (fieldType) => fieldType.identifier === identifier,
            );
            return {
              profileTypeField: {
                identifier,
              },
              values: [
                type.fieldType === '"PICK_LIST"'
                  ? {
                      customFieldOption: {
                        identifier: value,
                      },
                    }
                  : {
                      value,
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
        fields: Object.entries(data?.profileMetaData)?.map(
          ([identifier, value]) => {
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
          },
        ),
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

  const handleClose = () => {
    if (editMode) {
      dispatch(
        openModal('InterruptEdit', {
          description: 'You have unsaved',
          confirm: () => {
            editProfile(getValues());
            dispatch(closeModal());
            setEditMode(false);
            onClose();
          },
          onClose: () => {
            setEditMode(false);
            onClose();
          },
        }),
      );
    } else {
      setEditMode(false);
      onClose();
    }
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
    <Drawer open={open} onClickAway={handleClose}>
      <StickyHeader>
        <TitleName>{title}</TitleName>
        <MoreActinsWrapper>
          <OptionsMenu options={menu} customButtonComponent={IconButton}>
            <MoreVertIcon />
          </OptionsMenu>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </MoreActinsWrapper>
      </StickyHeader>
      <ContentWrapper>
        <Stack>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} ref={formReference}>
              <LabeledCollapse
                name="Default"
                isOpened={isCollapsed}
                onClick={handleCollapse}
              >
                {types?.map((field) => {
                  const record = profile?.fields?.find(
                    (profileField) =>
                      field.identifier ===
                      profileField.profileTypeFieldIdentifier,
                  );

                  const render = () => {
                    return (
                      <CustomField
                        readOnly={!editMode}
                        field={field}
                        initialValue={
                          record
                            ? record.values?.[0] ||
                              record.values?.[0]?.value ||
                              record.values?.[0]?.customFieldOption?.identifier
                            : ''
                        }
                        fieldsGroupKey="profileMetaData"
                      />
                    );
                  };

                  return (
                    <Box key={field.identifier} style={{ margin: '8px 4px' }}>
                      {render()}
                    </Box>
                  );
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
          </FormProvider>
        </Stack>
      </ContentWrapper>
    </Drawer>
  );
};

export default ProfileDrawer;
