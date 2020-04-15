/* eslint-disable react-hooks/rules-of-hooks */

import { splitAt } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { object, string } from 'yup';
import { findAllUsersByOrganizationId } from '../actions/people-actions';
import useBoolean from '../hooks/useBoolean';

const MAX_VISIBLE_MEMBERS_COUNT = 5;

const filterPeopleBasedOnIdentifier = ({
  listOwner,
  membersValue,
  adminsValue,
  membersPickerOpen,
  adminsPickerOpen,
}) => ({ userIdentifier }) =>
  userIdentifier != null &&
  userIdentifier !== listOwner.userIdentifier &&
  ((adminsPickerOpen && !membersValue.includes(userIdentifier)) ||
    (membersPickerOpen && !adminsValue.includes(userIdentifier)));

const getFormWatchedValues = ({ watch }) => ({
  listNameValue: watch('listName') ?? '',
  listDescriptionValue: watch('listDescription') ?? '',
  adminsValue: watch('adminIdentifiers') ?? [],
  membersValue: watch('memberIdentifiers') ?? [],
  notificationsValue: watch('notifications') ?? true,
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

    register({ name: 'listDescription' });
    register({ name: 'owner' });
    register({ name: 'adminIdentifiers' });
    register({ name: 'memberIdentifiers' });
    register({ name: 'notifications' });

    setDefaultFormValues();

    return () => {
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

  const {
    listNameValue,
    listDescriptionValue,
    adminsValue: allAdminsValue,
    membersValue: allMembersValue,
    notificationsValue,
  } = getFormWatchedValues({ watch });

  const [adminsValue, restOfAdminsValue] = splitAt(
    MAX_VISIBLE_MEMBERS_COUNT,
    allAdminsValue,
  );
  const [membersValue, restOfMembersValue] = splitAt(
    MAX_VISIBLE_MEMBERS_COUNT,
    allMembersValue,
  );

  const formLabelContent = taskListIdentifier ? 'EDIT A LIST' : 'ADD A LIST';

  const filteredPeople = Array.isArray(people)
    ? people
        .filter(
          filterPeopleBasedOnIdentifier({
            listOwner,
            membersValue,
            adminsValue,
            membersPickerOpen,
            adminsPickerOpen,
          }),
        )
        .filter(({ firstName = '', middleName = '', lastName = '' }) =>
          [
            firstName.toLowerCase(),
            middleName.toLowerCase(),
            lastName.toLowerCase(),
          ]
            .map(value => value.includes(searchValue.toLowerCase()))
            .some(Boolean),
        )
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

  const [adminsWithOwner, restOfAdminsWithOwner] = splitAt(
    MAX_VISIBLE_MEMBERS_COUNT,
    allAdminsWithOwner,
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
    allAdminsValue,
    adminsValue,
    restOfAdminsValue,
    allMembersValue,
    membersValue,
    restOfMembersValue,
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
    allAdminsWithOwner,
    adminsWithOwner,
    restOfAdminsWithOwner,
    formContext,
  };
};

export default initializeAddListFormHooks;
