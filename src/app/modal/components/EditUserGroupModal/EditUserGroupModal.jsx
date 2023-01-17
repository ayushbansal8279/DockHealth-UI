import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { usePrevious } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import compose from 'ramda/src/compose';
import pluck from 'ramda/src/pluck';
import join from 'ramda/src/join';
import split from 'ramda/src/split';
import take from 'ramda/src/take';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getUserGroupAvatarThumbnailUrl } from 'helpers/user-groups-helper';
import { createUserGroup, updateUserGroup } from 'actions/user-groups-actions';
import { Grid } from '@material-ui/core';
import ColorPicker from 'components/common/ColorPicker/ColorPicker';
import InitialsInput from 'components/common/InitialsInput/InitialsInput';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing.tsx';
import Button from 'components/common/Button/Button';
import AvatarInput from 'components/user/AvatarInput/AvatarInput';
import { ORGANIZATION_TILE_COLORS } from 'styles/organization-tile-colors';
import { openModal } from 'modal/actions';
import {
  isCreatingUserGroupsSelector,
  creatingUserGroupsErrorSelector,
  isSavingUserGroupSelector,
  userGroupErrorSelector,
} from 'selectors/user-groups-selectors';
import {
  EditPatientListModalWrapper,
  Title,
  ButtonWrapper,
  Header,
  StyledForm,
  SectionTitle,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

function getRandomTileColor() {
  return ORGANIZATION_TILE_COLORS[
    Math.floor(Math.random() * ORGANIZATION_TILE_COLORS.length)
  ];
}

const validationSchema = object().shape({
  name: string().required('This field is required'),
});

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditUserGroupModal = ({ userGroup, closeModal }) => {
  const { identifier } = userGroup || {};
  const userGroupError = useSelector(
    userGroup
      ? userGroupErrorSelector(identifier)
      : creatingUserGroupsErrorSelector,
  );
  const isSaving = useSelector(
    userGroup
      ? isSavingUserGroupSelector(userGroup.identifier)
      : isCreatingUserGroupsSelector,
  );
  const dispatch = useDispatch();

  const formMethods = useForm({
    defaultValues: userGroup
      ? {
          name: userGroup.name,
          description: userGroup.description,
          bubbleColor: userGroup.bubbleColor,
          initials: userGroup.initials,
        }
      : {
          bubbleColor: getRandomTileColor().hex,
        },
    reValidateMode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const { register, unregister, watch, setValue, handleSubmit } = formMethods;

  const groupNameValue = watch('name');
  const avatarColorValue = watch('bubbleColor');
  const initialsValue = watch('initials');
  const avatarValue = watch('avatar');

  useEffect(() => {
    register('bubbleColor');
    register('initials');
    register('avatar');

    return () => {
      unregister('bubbleColor');
      unregister('initials');
      unregister('avatar');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previousIsSaving = usePrevious(isSaving);

  useEffect(() => {
    if (
      (identifier, !isSaving && previousIsSaving === true && !userGroupError)
    ) {
      dispatch(
        openModal('AddUserToGroup', {
          userGroupIdentifier: identifier,
        }),
      );
    }
  }, [dispatch, isSaving, previousIsSaving, identifier, userGroupError]);

  useEffect(() => {
    if (!userGroup) {
      const newInitials = groupNameValue
        ? compose(join(''), pluck(0), take(2), split(' '))(groupNameValue)
        : '';
      setValue('initials', newInitials);
    }
  }, [groupNameValue, setValue, userGroup]);

  const onSubmit = data => {
    if (identifier) {
      dispatch(updateUserGroup(identifier, data));
    } else {
      const onSuccessCallback = createdGroupIdentifier => {
        dispatch(
          openModal('AddUserToGroup', {
            userGroupIdentifier: createdGroupIdentifier,
          }),
        );
      };
      dispatch(createUserGroup(data, onSuccessCallback));
    }
  };

  return (
    <EditPatientListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <StyledForm onSubmit={event => handleSubmit(onSubmit)(event)}>
        <FormProvider {...formMethods}>
          <Grid container direction="column" justifyContent="space-between">
            <Grid item>
              <Header>
                <Title>User Group Builder</Title>
              </Header>
              <FormInput
                autoFocus
                fullWidth
                label="Group name"
                name="name"
                required
                placeholder="Add your user group name here"
              />
              <Spacing vertical={4} />
              <FormInput
                fullWidth
                label="Description of group"
                name="description"
                placeholder="Do you want to add a description for the group?"
              />
              <Spacing vertical={4} />
              <SectionTitle>Select initials for your group</SectionTitle>
              <InitialsInput
                name="initials"
                placeholder="ab"
                value={initialsValue}
                onChange={v => {
                  setValue('initials', v);
                }}
                maxChar={2}
              />
              <Spacing vertical={4} />
              <SectionTitle>Choose a color for the group</SectionTitle>
              <ColorPicker
                name="bubbleColor"
                value={avatarColorValue}
                onChange={event => {
                  const { name, value } = event.target;
                  setValue(name, value);
                }}
              />
              <Spacing vertical={4} />
              <SectionTitle>OR Select a picture</SectionTitle>
              <AvatarInput
                initials={initialsValue}
                isGroup
                name={groupNameValue}
                color={avatarColorValue}
                pictureSrc={
                  avatarValue !== undefined
                    ? avatarValue
                    : getUserGroupAvatarThumbnailUrl(userGroup)
                }
                onChange={newAvatar => setValue('avatar', newAvatar)}
              />
            </Grid>
            <Grid container direction="row" justifyContent="center">
              <Spacing vertical={3} />
              <ButtonWrapper>
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={closeModal}
                  size="small"
                >
                  Cancel
                </Button>
              </ButtonWrapper>
              <Spacing horizontal={3} />
              <ButtonWrapper>
                <Button
                  fullWidth
                  type="submit"
                  disabled={isSaving}
                  size="small"
                >
                  Save
                </Button>
              </ButtonWrapper>
            </Grid>
          </Grid>
        </FormProvider>
      </StyledForm>
    </EditPatientListModalWrapper>
  );
};

export default EditUserGroupModal;
