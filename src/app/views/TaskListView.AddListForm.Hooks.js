/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { findAllUsersByOrganizationId } from '../actions/people-actions';
import useBoolean from '../hooks/useBoolean';

const initializeAddListFormHooks = () => {
  const dispatch = useDispatch();
  const { register, unregister, handleSubmit, setValue, watch } = useForm({});

  const { listOwner, currentList, people } = useSelector(store => ({
    listOwner:
      store.taskListState.currentList?.creator ?? store.userState.userProfile,
    currentUser: store.userState.userProfile,
    currentList: store.taskListState.currentList,
    people: store.peopleState.peoplelist,
  }));

  const [adminsPickerOpen, openAdminsPicker, closeAdminsPicker] = useBoolean(
    false,
  );
  const [membersPickerOpen, openMembersPicker, closeMembersPicker] = useBoolean(
    false,
  );

  const taskListIdentifier = currentList?.taskListIdentifier;

  const [searchValue, setSearchValue] = useState('');

  const setDefaultFormValues = useCallback(() => {
    setValue('listName', currentList?.listName ?? '');
    setValue('listDescription', currentList?.listDescription ?? '');
    setValue('owner', listOwner);
    setValue('adminIdentifiers', currentList?.adminIdentifiers ?? []);
    setValue('memberIdentifiers', currentList?.memberIdentifiers ?? []);
    setValue('notifications', currentList?.notifications ?? true);
  }, [currentList, listOwner, setValue]);

  useEffectOnce(() => {
    findAllUsersByOrganizationId()(dispatch);

    register({ name: 'listName' });
    register({ name: 'listDescription' });
    register({ name: 'owner' });
    register({ name: 'adminIdentifiers' });
    register({ name: 'memberIdentifiers' });
    register({ name: 'notifications' });

    setDefaultFormValues();

    return () => {
      unregister('listName');
      unregister('listDescription');
      unregister('owner');
      unregister('adminIdentifiers');
      unregister('memberIdentifiers');
      unregister('notifications');
    };
  });

  useEffect(() => {
    setDefaultFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifier]);

  useEffect(() => {
    if (adminsPickerOpen || membersPickerOpen) {
      setSearchValue('');
    }
  }, [adminsPickerOpen, membersPickerOpen]);

  const listNameValue = watch('listName') ?? '';
  const listDescriptionValue = watch('listDescription') ?? '';
  const adminsValue = watch('adminIdentifiers') ?? [];
  const membersValue = watch('memberIdentifiers') ?? [];
  const notificationsValue = watch('notifications') ?? true;

  const formLabelContent = taskListIdentifier ? 'Edit a list' : 'Add a list';

  // check for people length other with results in error
  const filteredPeople =
    people !== undefined && Array.isArray(people)
      ? people
          .filter(
            ({ userIdentifier }) =>
              userIdentifier != null &&
              userIdentifier !== listOwner.userIdentifier &&
              !membersValue.includes(userIdentifier) &&
              !adminsValue.includes(userIdentifier),
          )
          .filter(({ firstName = '', middleName = '', lastName = '' }) => {
            return [
              firstName.toLowerCase(),
              middleName.toLowerCase(),
              lastName.toLowerCase(),
            ]
              .map(value => value.includes(searchValue.toLowerCase()))
              .some(Boolean);
          })
      : [];

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
        adminsValue.filter(adminId => adminId !== userIdentifier),
      );
    },
    [adminsValue, setValue],
  );

  const removeMember = useCallback(
    ({ userIdentifier }) => {
      setValue(
        'memberIdentifiers',
        membersValue.filter(memberId => memberId !== userIdentifier),
      );
    },
    [membersValue, setValue],
  );

  return {
    formLabelContent,
    handleSubmit,
    setValue,
    listOwner,
    adminsPickerOpen,
    openAdminsPicker,
    closeAdminsPicker,
    membersPickerOpen,
    openMembersPicker,
    closeMembersPicker,
    listNameValue,
    listDescriptionValue,
    adminsValue,
    membersValue,
    filteredPeople,
    addAdmin,
    removeAdmin,
    addMember,
    removeMember,
    notificationsValue,
    people,
    taskListIdentifier,
    dispatch,
    searchValue,
    setSearchValue,
  };
};

export default initializeAddListFormHooks;
