import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { getAllContacts, deleteContact } from 'api/contacts-api';
import { AddEntitiesContainer } from 'components/common/AddButton/AddButton';
import { getContactColumns } from './helpers';
import { ViewContainer } from './styled';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '../smart-flow-builder/TaskNodeHandles/styled';
import ReusableDataGrid from 'components/common/ReusableDataGrid';

// const PAGE_SIZE = 30;

const Contacts = () => {
  const userProfile = useSelector(userProfileSelector);
  const [contacts, setContacts] = useState([]);
  // const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllContacts().then((list) => setContacts(list));
  }, []);

  useEffect(() => {
    if (
      userProfile?.orgUserRole === 'GUEST' ||
      userProfile?.orgUserRole === 'DOCK_LITE'
    ) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const onAddContact = useCallback(() => {
    dispatch(
      openModal('EditContact', {
        onAdded: (newContact) => {
          setContacts((s) => [newContact, ...s]);
        },
      }),
    );
  }, [dispatch]);

  const onEditContact = useCallback(
    ({ id }) => {
      dispatch(
        openModal('EditContact', {
          contact: contacts.find((t) => t.identifier === id),
          onUpdated: (contact) => {
            setContacts((s) => [
              ...s.map((t) =>
                t.identifier === contact.identifier ? contact : t,
              ),
            ]);
          },
        }),
      );
    },
    [dispatch, contacts],
  );

  const onDeteleContact = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete contact',
        description:
          'Are you sure you want to delete this contact? This action cannot be undone.',
        confirm: () => {
          dispatch(closeModal());
          deleteContact(id);
          setContacts((s) => [...s.filter((t) => t.identifier !== id)]);
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  const columns = useMemo(
    () => getContactColumns({ onEditContact, onDeteleContact }),
    [onDeteleContact, onEditContact],
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Contacts" />}>
      <ViewContainer>
        <AddEntitiesContainer>
          {/* <AddButton onClick={onAddContact}> */}
          <ToolbarButton
            // ref={buttonReference}
            icon={
              <span style={{ marginLeft: '-5px' }}>
                <AddIcon />
              </span>
            }
            onClick={onAddContact}
            // isOpen={open}
            // active={open}
            // hasPopover
          >
            <span style={{ marginLeft: '-5px' }}>Create Contact</span>
          </ToolbarButton>
          {/* </AddButton> */}
        </AddEntitiesContainer>
        <ReusableDataGrid
          columns={columns}
          rows={contacts.map((t) => ({ ...t, id: t.identifier }))}
          rowHeight={35}
        />
      </ViewContainer>
    </ViewLayout>
  );
};

export default Contacts;
