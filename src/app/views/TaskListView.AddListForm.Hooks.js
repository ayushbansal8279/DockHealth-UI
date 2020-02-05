/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback, useEffect } from 'react';
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

  const taskListId = currentList?.taskListId;

  const setDefaultFormValues = useCallback(() => {
    setValue('listName', currentList?.listName ?? '');
    setValue('owner', listOwner);
    setValue('admins', currentList?.admins ?? []);
    setValue('members', currentList?.members ?? []);
    setValue('notifications', currentList?.notifications ?? true);
  }, [currentList, listOwner, setValue]);

  useEffectOnce(() => {
    findAllUsersByOrganizationId()(dispatch);

    register({ name: 'listName' });
    register({ name: 'owner' });
    register({ name: 'admins' });
    register({ name: 'members' });
    register({ name: 'notifications' });

    setDefaultFormValues();

    return () => {
      unregister('listName');
      unregister('owner');
      unregister('admins');
      unregister('members');
      unregister('notifications');
    };
  });

  useEffect(() => {
    setDefaultFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListId]);

  const listNameValue = watch('listName') ?? '';
  const adminsValue = watch('admins') ?? [];
  const membersValue = watch('members') ?? [];
  const notificationsValue = watch('notifications') ?? true;

  const formLabelContent = taskListId ? 'Edit a list' : 'Add a list';

  const filteredPeople = (people ?? []).filter(({ userId }) => {
    if (
      userId == null ||
      userId === listOwner.userId ||
      membersValue.includes(userId) ||
      adminsValue.includes(userId)
    ) {
      return false;
    }

    return true;
  });

  const addAdmin = useCallback(
    ({ userId }) => {
      setValue('admins', [...adminsValue, userId]);
    },
    [adminsValue, setValue],
  );

  const addMember = useCallback(
    ({ userId }) => {
      setValue('members', [...membersValue, userId]);
    },
    [membersValue, setValue],
  );

  const removeAdmin = useCallback(
    ({ userId }) => {
      setValue('admins', adminsValue.filter(adminId => adminId !== userId));
    },
    [adminsValue, setValue],
  );

  const removeMember = useCallback(
    ({ userId }) => {
      setValue('members', membersValue.filter(memberId => memberId !== userId));
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
    adminsValue,
    membersValue,
    filteredPeople,
    addAdmin,
    removeAdmin,
    addMember,
    removeMember,
    notificationsValue,
    people,
    taskListId,
    dispatch,
  };
};

export default initializeAddListFormHooks;
