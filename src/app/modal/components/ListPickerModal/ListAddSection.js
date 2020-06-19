import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addTaskList } from 'api/tasklist-api';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import ModalFormInput from './ModalFormInput/ModalFormInput';
import { Title, Description, StyledButton, AddListForm } from './styled';

const ListAddSection = ({
  initialListName,
  onCancel,
  addListPayload,
  listSelectSave,
}) => {
  const [isSavingList, setSavingList] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = formData => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      ...addListPayload,
      ...formData,
    })
      .then(({ taskListIdentifier }) => {
        setSavingList(true);
        listSelectSave(taskListIdentifier);
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
            required
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
          <Grid item xs={6}>
            <StyledButton
              variant="outlined"
              type="button"
              size="small"
              onClick={onCancel}
            >
              Cancel
            </StyledButton>
          </Grid>
          <Grid item xs={6}>
            <StyledButton variant="contained" type="submit" size="small">
              Save
            </StyledButton>
          </Grid>
        </Grid>
      </AddListForm>
    </>
  );
};

export default ListAddSection;
