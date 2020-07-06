import React, { useState } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { saveTaskList } from 'actions/tasklist-actions';
import Input from 'components/common/Input/Input';
import { useFormContext, FormContext } from 'react-hook-form';
import { showAlert } from 'helpers/utility-functions';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';
import PeoplePicker from 'components/common/PeoplePicker/PeoplePicker';
import {
  CancelButton,
  CloseButton,
  ModalContent,
  ModalText,
  Footer,
  FormContainer,
  FormLabel,
  FormIconContainer,
  FormDivider,
  StyledButton,
  StyledModal,
} from './styled';
import initializeListFormHooks from './hooks';
import messages from './messages';
import * as AlertActions from 'alert/actions';

const ADMIN_PICKER = 'ADMIN_PICKER';
const MEMBER_PICKER = 'MEMBER_PICKER';

const InvitedModal = ({ userName, closeModal }) => (
  <StyledModal>
    <ModalContent>
      <CloseButton onClick={closeModal}>
        <Close />
      </CloseButton>
      <ModalText>We’ve sent an invitation email to {userName}.</ModalText>
    </ModalContent>
  </StyledModal>
);

const InputWithContext = props => {
  const { register, errors } = useFormContext();
  const { name } = props;

  return <Input {...props} ref={register} error={errors?.[name]?.message} />;
};

const onSubmit = ({
  dispatch,
  setListFormOpen,
  taskListIdentifier = null,
}) => data => {
  const taskList = { ...data, taskListIdentifier };

  saveTaskList(taskList)(dispatch)
    .then(() => {
      dispatch(AlertActions.showGlobalAlert(messages.submit.success));
      setListFormOpen(false);
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.message ?? messages.submit.error,
      });
    });
};

const ListForm = ({ setListFormOpen }) => {
  const {
    addAdmin,
    addMember,
    allAdminsWithOwner,
    allMembersValue,
    currentUser,
    dispatch,
    formContext,
    formLabelContent,
    handleSubmit,
    people,
    peopleListForAdminPicker,
    peopleListForMemberPicker,
    removeAdmin,
    removeMember,
    taskListIdentifier,
  } = initializeListFormHooks();

  const { orgUserRole } = currentUser;
  const [pickerOpened, setPickerOpened] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  return (
    <FormContainer
      onSubmit={handleSubmit(
        onSubmit({ dispatch, setListFormOpen, taskListIdentifier }),
      )}
      autoComplete="off"
      autoCorrect="off"
    >
      {modalContent && (
        <InvitedModal
          closeModal={() => setModalContent(null)}
          userName={modalContent}
        />
      )}
      {taskListIdentifier && (
        <>
          <Grid container justify="space-between" alignItems="center">
            <FormLabel>
              <RobotoTypography variant="h4">
                {formLabelContent}
              </RobotoTypography>
            </FormLabel>
            <FormIconContainer>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setListFormOpen(false)}
              >
                <Close />
              </IconButton>
            </FormIconContainer>
          </Grid>
          <FormDivider />
        </>
      )}
      <FormContext {...formContext}>
        <InputWithContext
          fullWidth
          label={messages.form.listName.label}
          name="listName"
          required
          showError
        />
      </FormContext>
      <FormContext {...formContext}>
        <InputWithContext
          fullWidth
          label={messages.form.description.label}
          name="listDescription"
          placeholder={messages.form.description.placeholder}
        />
      </FormContext>
      <PeoplePicker
        addPerson={addAdmin}
        availablePeopleList={peopleListForAdminPicker}
        closePicker={() => setPickerOpened(null)}
        currentUserRole={orgUserRole}
        isOpen={pickerOpened === ADMIN_PICKER}
        openModal={userName => setModalContent(userName)}
        peopleIdentifiers={allAdminsWithOwner}
        peopleLabel={messages.form.admins.label}
        peopleList={people}
        setOpenedPicker={() => setPickerOpened(ADMIN_PICKER)}
        removePerson={removeAdmin}
        taskListIdentifier={taskListIdentifier}
        tooltipDescritpion={messages.form.admins.tooltip}
      />
      <PeoplePicker
        addPerson={addMember}
        availablePeopleList={peopleListForMemberPicker}
        closePicker={() => setPickerOpened(null)}
        currentUserRole={orgUserRole}
        isOpen={pickerOpened === MEMBER_PICKER}
        openModal={userName => setModalContent(userName)}
        peopleIdentifiers={allMembersValue}
        peopleLabel={messages.form.members.label}
        peopleList={people}
        setOpenedPicker={() => setPickerOpened(MEMBER_PICKER)}
        removePerson={removeMember}
        taskListIdentifier={taskListIdentifier}
        tooltipDescritpion={messages.form.members.tooltip}
      />
      <Footer container justify="flex-end" direction="row" wrap="nowrap">
        <CancelButton
          onClick={() => setListFormOpen(false)}
          variant="text"
          type="button"
        >
          <MontserratTypography>
            <span style={{ fontWeight: '600' }}>{messages.form.cancel}</span>
          </MontserratTypography>
        </CancelButton>
        <StyledButton variant="contained" type="submit" size="small">
          {messages.form.saveList}
        </StyledButton>
      </Footer>
    </FormContainer>
  );
};

export default ListForm;
