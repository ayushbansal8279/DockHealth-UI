/* eslint-disable react-hooks/rules-of-hooks */

import { take } from 'ramda';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { object, string } from 'yup';
import { findAllUsersByOrganizationId } from 'actions/people-actions';

const MAX_VISIBLE_MEMBERS_COUNT = 5;

const getFormWatchedValues = ({ watch }) => ({
  listNameValue: watch('listName') ?? '',
  listDescriptionValue: watch('listDescription') ?? '',
  adminsValue: watch('adminIdentifiers') ?? [],
  membersValue: watch('memberIdentifiers') ?? [],
});

const validationSchema = object().shape({
  listName: string().required('This field is required'),
});

const initializeAddListFormHooks = () => {
  const dispatch = useDispatch();
  const formContext = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { register, unregister, handleSubmit, setValue, watch } = formContext;

  const { listOwner, currentUser, currentList, people } = useSelector(
    store => ({
      listOwner:
        store.taskListState.currentList?.creator ?? store.userState.userProfile,
      currentUser: store.userState.userProfile,
      currentList: store.taskListState.currentList,
      people: store.peopleState.peoplelist,
    }),
  );

  const taskListIdentifier = currentList?.taskListIdentifier;

  const setDefaultFormValues = useCallback(() => {
    setValue('listName', currentList?.listName ?? '');
    setValue('listDescription', currentList?.listDescription ?? '');
    setValue('owner', listOwner);
    setValue('adminIdentifiers', currentList?.adminIdentifiers ?? []);
    setValue('memberIdentifiers', currentList?.memberIdentifiers ?? []);
  }, [currentList, listOwner, setValue]);

  useEffectOnce(() => {
    findAllUsersByOrganizationId()(dispatch);

    register({ name: 'listDescription' });
    register({ name: 'owner' });
    register({ name: 'adminIdentifiers' });
    register({ name: 'memberIdentifiers' });

    setDefaultFormValues();

    return () => {
      unregister('listDescription');
      unregister('owner');
      unregister('adminIdentifiers');
      unregister('memberIdentifiers');
    };
  });

  useEffect(() => {
    setDefaultFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifier]);

  const {
    adminsValue: allAdminsValue,
    membersValue: allMembersValue,
    listNameValue,
    listDescriptionValue,
  } = getFormWatchedValues({ watch });

  const adminsValue = take(MAX_VISIBLE_MEMBERS_COUNT, allAdminsValue);
  const membersValue = take(MAX_VISIBLE_MEMBERS_COUNT, allMembersValue);

  const formLabelContent = taskListIdentifier ? 'EDIT A LIST' : 'ADD A LIST';

  const addAdmin = useCallback(
    ({ userIdentifier }) => {
      setValue('adminIdentifiers', [...adminsValue, userIdentifier]);
    },
    [adminsValue, setValue],
  );

  const addMember = useCallback(
    ({ userIdentifier }) => {
      setValue('memberIdentifiers', [...membersValue, userIdentifier]);
    },
    [membersValue, setValue],
  );

  const removeAdmin = useCallback(
    ({ userIdentifier }) => {
      setValue(
        'adminIdentifiers',
        adminsValue?.filter(adminId => adminId !== userIdentifier) ?? [],
      );
    },
    [adminsValue, setValue],
  );

  const removeMember = useCallback(
    ({ userIdentifier }) => {
      setValue(
        'memberIdentifiers',
        membersValue?.filter(memberId => memberId !== userIdentifier) ?? [],
      );
    },
    [membersValue, setValue],
  );

  const allAdminsWithOwner = [
    ...(allAdminsValue || []),
    listOwner?.userIdentifier,
  ].filter(Boolean);

  const peopleListForAdminPicker = people.filter(
    ({ userIdentifier }) =>
      !allMembersValue.includes(userIdentifier) &&
      userIdentifier !== listOwner?.userIdentifier,
  );

  const peopleListForMemberPicker = people.filter(
    ({ userIdentifier }) => !allAdminsWithOwner.includes(userIdentifier),
  );

  return {
    addAdmin,
    addMember,
    allAdminsWithOwner,
    allMembersValue,
    currentUser,
    dispatch,
    formContext,
    formLabelContent,
    handleSubmit,
    listNameValue,
    listDescriptionValue,
    people,
    peopleListForAdminPicker,
    peopleListForMemberPicker,
    removeAdmin,
    removeMember,
    taskListIdentifier,
  };
};

export default initializeAddListFormHooks;
