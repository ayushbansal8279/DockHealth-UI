import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useUnmount } from 'react-use';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, IconButton, Stack } from '@mui/material';
import Drawer from 'ui-toolkit/Navigation/Drawer/Drawer';
import {
  createProfile,
  editProfileDetails,
  deleteProfile,
} from 'api/profile-api';
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
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { closeModal, openModal } from 'modal/actions';
import { getProfileName } from '@/app/views/custom-profile-details/helpers';

const ProfileDrawer = ({
  title,
  open,
  profileTypeIdentifier,
  profile,
  types,
  onClose,
  onUpdate,
  addMode = false,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const { register, handleSubmit, getValues } = useForm();
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
  });
  const {
    handleSubmit,
    getValues,
    formState: { errors },
  } = formMethods;
  const formReference = useRef(null);

  const hasErrors = Object.keys(errors).length > 0;

  const [isCollapsed, setCollapsed] = useState(true);
  const [editMode, setEditMode] = useState(addMode);

  useEffect(() => {
    if (addMode && !profile) {
      setEditMode(true);
    }
  }, [addMode, profile]);

  useUnmount(() => {
    setEditMode(false);
  });

  const editProfile = useCallback(
    (data) => {
      editProfileDetails(profile?.identifier, data?.profileMetaData, types)
        // eslint-disable-next-line no-shadow
        .then((data) => {
          setEditMode(false);
          dispatch(showGlobalAlert(AlertMessages.SAVED));
          onUpdate(data);
        })
        .catch((error) => {
          dispatch(
            showGlobalErrorAlert(error?.message ?? 'Error saving details!'),
          );
        });
    },
    [dispatch, onUpdate, profile, types],
  );

  const onSubmit = (data) => {
    if (profile && editMode) {
      editProfile(data);
    } else {
      createProfile(profileTypeIdentifier, data?.profileMetaData, types)
        // eslint-disable-next-line no-shadow
        .then((data) => {
          dispatch(showGlobalAlert(AlertMessages.SAVED));
          onUpdate(data);
        })
        .catch((error) => {
          dispatch(
            showGlobalErrorAlert(error?.message ?? 'Error saving details!'),
          );
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
          profileTypeName: getProfileName(types, profile)?.[0] || title,
          confirm: async () => {
            const isValid = await formMethods.trigger();
            if (isValid) {
              editProfile(getValues());
              if (!addMode && profile) {
                setEditMode(false);
              }
              onClose();
            }
            dispatch(closeModal());
          },
          onClose: () => {
            if (!addMode && profile) {
              setEditMode(false);
            }
            onClose();
          },
        }),
      );
    } else {
      if (!addMode && profile) {
        setEditMode(false);
      }
      onClose();
    }
  };

  const menu = useMemo(
    () => [
      { name: 'Edit', onClick: () => setEditMode(true) },
      {
        name: 'Merge',
        onClick: () => {
          dispatch(
            openModal('ProfilePicker', {
              profileTypeIdentifier: profileTypeIdentifier,
              profile: profile,
            }),
          );
          onClose();
        },
      },
      {
        name: 'Delete',
        onClick: () => {
          dispatch(
            openModal('DeleteConfirmation', {
              description: 'Are you sure to delete this profile?',
              confirm: () => {
                deleteProfile(profile.identifier).then(() => {
                  dispatch(showGlobalAlert(AlertMessages.DELETED));
                  history.push(`/custom-profiles/${profileTypeIdentifier}`);
                });
                dispatch(closeModal());
              },
            }),
          );
        },
      },
    ],
    [dispatch, history, profile, profileTypeIdentifier],
  );

  return (
    <Drawer open={open} onClickAway={handleClose}>
      <StickyHeader>
        <TitleName>{title}</TitleName>
        <MoreActinsWrapper>
          {!addMode && (
            <OptionsMenu options={menu} customButtonComponent={IconButton}>
              <MoreVertIcon />
            </OptionsMenu>
          )}
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
                            ? record?.values?.length > 1
                              ? record.values
                              : record.values?.[0] ||
                                record.values?.[0]?.value ||
                                record.values?.[0]?.customFieldOption
                                  ?.identifier
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
                  disabled={(profile && !editMode) || hasErrors}
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
