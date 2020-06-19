import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addTaskList } from 'api/tasklist-api';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import {
  Title,
  Description,
  StyledButton,
  AddListFormInput,
  AddListFormInputWrapper,
  AddListFormInputLabel,
  AddListForm,
  InputErrorLabel,
} from './styled';

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
          <AddListFormInputWrapper>
            <AddListFormInputLabel hasError={errors.listName}>
              Add list
            </AddListFormInputLabel>
            <AddListFormInput
              name="listName"
              placeholder="What would you like to name your list?"
              defaultValue={initialListName}
              disabled={isSavingList}
              ref={register({ required: true })}
              hasError={errors.listName}
            />
            {errors.listName?.type === 'required' && (
              <InputErrorLabel>This field is required</InputErrorLabel>
            )}
          </AddListFormInputWrapper>
          <Spacing vertical={4} />
          <AddListFormInputWrapper>
            <AddListFormInputLabel>Description</AddListFormInputLabel>
            <AddListFormInput
              name="listDescription"
              placeholder="Add a description for your new list"
              disabled={isSavingList}
              ref={register}
            />
          </AddListFormInputWrapper>
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
            <StyledButton
              variant="contained"
              type="submit"
              size="small"
              onClick={() => {}}
            >
              Save
            </StyledButton>
          </Grid>
        </Grid>
      </AddListForm>
    </>
  );
};

export default ListAddSection;
