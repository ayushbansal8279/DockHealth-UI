import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addTaskList } from 'api/task-list-api';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import ModalFormInput from './ModalFormInput/ModalFormInput';
import { Title, Description, AddListForm } from './styled';

const ListAddSection = ({
  initialListName,
  onCancel,
  addListPayload,
  listSelectSave,
  refreshLists,
}) => {
  const [isSavingList, setSavingList] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (formData) => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      ...addListPayload,
      ...formData,
    })
      .then(({ taskListIdentifier }) => {
        setSavingList(true);
        listSelectSave(taskListIdentifier);
        refreshLists();
      })
      .catch(() => {
        setSavingList(false);
      });
  };

  return (
    <>
      <Title>Create new list</Title>
      <Description>Name your new list and move your task</Description>
      <Spacing vertical={5} />
      <AddListForm onSubmit={handleSubmit(onSubmit)}>
        <div>
          <ModalFormInput
            name="listName"
            label="Add list"
            placeholder="What would you like to name your list?"
            initialValue={initialListName}
            disabled={isSavingList}
            register={register}
            isRequired
            errors={errors.listName}
          />
          <Spacing vertical={4} />
          <ModalFormInput
            name="listDescription"
            label="Description"
            placeholder="Add a description for your new list"
            disabled={isSavingList}
            register={register}
            errors={errors.listDescription}
          />
        </div>
        <Grid container direction="row" spacing={2}>
          <Grid item size={6}>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item size={6}>
            <Button type="submit">Save</Button>
          </Grid>
        </Grid>
      </AddListForm>
    </>
  );
};

export default ListAddSection;
